/**
 * SEOYapar - Google Ads Keyword Planner Proxy
 * Cloudflare Worker - API anahtarlarını güvenli tutar
 * 
 * Environment Variables (Cloudflare Dashboard → Workers → Settings → Variables):
 *   GOOGLE_CLIENT_ID       - OAuth2 Client ID
 *   GOOGLE_CLIENT_SECRET   - OAuth2 Client Secret
 *   GOOGLE_REFRESH_TOKEN   - OAuth2 Refresh Token
 *   GOOGLE_DEVELOPER_TOKEN - Google Ads Developer Token
 *   GOOGLE_CUSTOMER_ID     - Google Ads Customer ID (10 haneli, tiresiz)
 *   ALLOWED_ORIGIN         - İzin verilen domain (ör: https://seoyapar.com)
 */

const GOOGLE_ADS_API_VERSION = 'v17';
const TURKISH_LANGUAGE_ID = '1037';  // languageConstants/1037
const TURKEY_GEO_ID = '2792';        // geoTargetConstants/2792

export default {
    async fetch(request, env) {
        // CORS headers
        const corsHeaders = {
            'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400',
        };

        // Handle preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        if (request.method !== 'POST') {
            return jsonResponse({ error: 'Only POST allowed' }, 405, corsHeaders);
        }

        try {
            const body = await request.json();
            const { keywords, action } = body;

            if (action === 'health') {
                return jsonResponse({
                    status: 'ok',
                    hasCredentials: !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_DEVELOPER_TOKEN),
                    version: '1.0'
                }, 200, corsHeaders);
            }

            if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
                return jsonResponse({ error: 'keywords array required' }, 400, corsHeaders);
            }

            // Rate limit: max 50 keywords per request
            const kwList = keywords.slice(0, 50);

            // Step 1: Get fresh access token
            const accessToken = await getAccessToken(env);
            if (!accessToken) {
                return jsonResponse({ error: 'OAuth token failed. Check credentials.' }, 401, corsHeaders);
            }

            // Step 2: Query Google Ads Keyword Planner
            const volumeData = await getKeywordVolumes(kwList, accessToken, env);

            return jsonResponse({
                success: true,
                data: volumeData,
                source: 'google_keyword_planner',
                timestamp: new Date().toISOString()
            }, 200, corsHeaders);

        } catch (err) {
            return jsonResponse({ error: err.message }, 500, corsHeaders);
        }
    }
};

// ===== OAuth2 Token Refresh =====
async function getAccessToken(env) {
    const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: env.GOOGLE_CLIENT_ID,
            client_secret: env.GOOGLE_CLIENT_SECRET,
            refresh_token: env.GOOGLE_REFRESH_TOKEN,
            grant_type: 'refresh_token'
        })
    });

    if (!response.ok) {
        console.error('Token refresh failed:', await response.text());
        return null;
    }

    const data = await response.json();
    return data.access_token;
}

// ===== Google Ads Keyword Planner API =====
async function getKeywordVolumes(keywords, accessToken, env) {
    const customerId = env.GOOGLE_CUSTOMER_ID.replace(/-/g, '');
    const url = `https://googleads.googleapis.com/${GOOGLE_ADS_API_VERSION}/customers/${customerId}:generateKeywordIdeas`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'developer-token': env.GOOGLE_DEVELOPER_TOKEN,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            language: `languageConstants/${TURKISH_LANGUAGE_ID}`,
            geoTargetConstants: [`geoTargetConstants/${TURKEY_GEO_ID}`],
            includeAdultKeywords: false,
            keywordSeed: {
                keywords: keywords
            },
            // Historical metrics for the keyword itself (not ideas)
            keywordPlanNetwork: 'GOOGLE_SEARCH'
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Keyword Planner API error:', errorText);
        throw new Error(`Google Ads API error: ${response.status}`);
    }

    const data = await response.json();
    const results = {};

    // Parse results
    if (data.results) {
        for (const result of data.results) {
            const keyword = result.text;
            const metrics = result.keywordIdeaMetrics || {};

            results[keyword.toLowerCase()] = {
                keyword: keyword,
                avgMonthlySearches: metrics.avgMonthlySearches || 0,
                competition: metrics.competition || 'UNSPECIFIED',
                competitionIndex: metrics.competitionIndex || 0,
                lowTopOfPageBidMicros: metrics.lowTopOfPageBidMicros
                    ? parseInt(metrics.lowTopOfPageBidMicros) / 1000000
                    : 0,
                highTopOfPageBidMicros: metrics.highTopOfPageBidMicros
                    ? parseInt(metrics.highTopOfPageBidMicros) / 1000000
                    : 0,
                // Monthly breakdown (last 12 months)
                monthlySearchVolumes: (metrics.monthlySearchVolumes || []).map(m => ({
                    month: m.month,
                    year: m.year,
                    searches: m.monthlySearches || 0
                }))
            };
        }
    }

    // For keywords not found in results, mark as 0
    for (const kw of keywords) {
        if (!results[kw.toLowerCase()]) {
            results[kw.toLowerCase()] = {
                keyword: kw,
                avgMonthlySearches: 0,
                competition: 'UNSPECIFIED',
                competitionIndex: 0,
                lowTopOfPageBidMicros: 0,
                highTopOfPageBidMicros: 0,
                monthlySearchVolumes: []
            };
        }
    }

    return results;
}

function jsonResponse(data, status, corsHeaders) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
}
