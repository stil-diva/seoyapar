/**
 * SEOYapar - DataForSEO API Proxy
 * Cloudflare Worker - API credentials'ları güvenli tutar
 * 
 * Endpoints:
 *   { keywords: [...] }           → Keyword Search Volume (Google Ads data)
 *   { action: "health" }          → Health check + balance
 *   { action: "serp", query: "" } → Google SERP results for competitor analysis
 * 
 * Environment Variables:
 *   DATAFORSEO_LOGIN    - DataForSEO API login (email)
 *   DATAFORSEO_PASSWORD - DataForSEO API password
 *   ALLOWED_ORIGIN      - İzin verilen domain
 */

const DATAFORSEO_API = 'https://api.dataforseo.com/v3';
const TURKEY_LOCATION_CODE = 2792;
const TURKISH_LANGUAGE_CODE = 'tr';

export default {
    async fetch(request, env) {
        const corsHeaders = {
            'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400',
        };

        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        if (request.method !== 'POST') {
            return jsonResponse({ error: 'Only POST allowed' }, 405, corsHeaders);
        }

        try {
            const body = await request.json();
            const { keywords, action, query } = body;

            const authHeader = 'Basic ' + btoa(`${env.DATAFORSEO_LOGIN}:${env.DATAFORSEO_PASSWORD}`);

            // ===== HEALTH CHECK =====
            if (action === 'health') {
                if (env.DATAFORSEO_LOGIN && env.DATAFORSEO_PASSWORD) {
                    try {
                        const resp = await fetch(`${DATAFORSEO_API}/appendix/user_data`, {
                            method: 'GET',
                            headers: { 'Authorization': authHeader, 'Content-Type': 'application/json' }
                        });
                        const data = await resp.json();
                        const balance = data?.tasks?.[0]?.result?.[0]?.money?.balance ?? -1;
                        return jsonResponse({
                            status: 'ok', hasCredentials: true, credits: balance,
                            version: '3.0', provider: 'dataforseo'
                        }, 200, corsHeaders);
                    } catch (e) {
                        return jsonResponse({
                            status: 'ok', hasCredentials: true, credits: -1,
                            version: '3.0', provider: 'dataforseo'
                        }, 200, corsHeaders);
                    }
                }
                return jsonResponse({ status: 'ok', hasCredentials: false, version: '3.0', provider: 'dataforseo' }, 200, corsHeaders);
            }

            if (!env.DATAFORSEO_LOGIN || !env.DATAFORSEO_PASSWORD) {
                return jsonResponse({ error: 'API credentials not configured' }, 401, corsHeaders);
            }

            // ===== COMPETITOR ANALYSIS (Trendyol — FREE) =====
            if (action === 'competitors' && query) {
                const competitorData = await getTrendyolCompetitors(query);
                return jsonResponse({ success: true, data: competitorData, source: 'trendyol' }, 200, corsHeaders);
            }

            // ===== SERP ANALYSIS (DataForSEO — paid, try Trendyol fallback) =====
            if (action === 'serp' && query) {
                // Try Trendyol first (free)
                try {
                    const trendyolData = await getTrendyolCompetitors(query);
                    if (trendyolData.products && trendyolData.products.length > 0) {
                        return jsonResponse({ success: true, data: trendyolData, source: 'trendyol' }, 200, corsHeaders);
                    }
                } catch (e) {
                    console.warn('Trendyol fallback failed:', e);
                }
                // Fall back to DataForSEO SERP if available
                try {
                    const serpData = await getSerpResults(query, authHeader);
                    return jsonResponse({ success: true, data: serpData, source: 'dataforseo' }, 200, corsHeaders);
                } catch (e) {
                    return jsonResponse({ error: 'SERP analysis unavailable: ' + e.message }, 200, corsHeaders);
                }
            }

            // ===== KEYWORD SEARCH VOLUME =====
            if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
                return jsonResponse({ error: 'keywords array required' }, 400, corsHeaders);
            }

            const kwList = keywords.slice(0, 1000);
            const volumeData = await getKeywordVolumes(kwList, authHeader);
            return jsonResponse({
                success: true, data: volumeData, source: 'dataforseo',
                timestamp: new Date().toISOString()
            }, 200, corsHeaders);

        } catch (err) {
            return jsonResponse({ error: err.message }, 500, corsHeaders);
        }
    }
};

// ===== Keyword Search Volume =====
async function getKeywordVolumes(keywords, authHeader) {
    const requestBody = [{
        location_code: TURKEY_LOCATION_CODE,
        language_code: TURKISH_LANGUAGE_CODE,
        keywords: keywords
    }];

    const response = await fetch(
        `${DATAFORSEO_API}/keywords_data/google_ads/search_volume/live`,
        {
            method: 'POST',
            headers: { 'Authorization': authHeader, 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        }
    );

    if (!response.ok) throw new Error(`DataForSEO API error: ${response.status}`);

    const data = await response.json();
    const results = {};

    if (data.tasks?.[0]?.status_code === 20000 && data.tasks[0].result) {
        for (const item of data.tasks[0].result) {
            const keyword = item.keyword || '';
            results[keyword.toLowerCase()] = {
                keyword,
                avgMonthlySearches: item.search_volume || 0,
                competition: item.competition || 'UNSPECIFIED',
                competitionIndex: item.competition_index || 0,
                cpc: item.cpc || 0,
                lowTopOfPageBid: item.low_top_of_page_bid || 0,
                highTopOfPageBid: item.high_top_of_page_bid || 0,
                monthlySearchVolumes: (item.monthly_searches || []).map(m => ({
                    month: m.month, year: m.year, searches: m.search_volume || 0
                }))
            };
        }
    }

    for (const kw of keywords) {
        if (!results[kw.toLowerCase()]) {
            results[kw.toLowerCase()] = {
                keyword: kw, avgMonthlySearches: 0, competition: 'UNSPECIFIED',
                competitionIndex: 0, cpc: 0, lowTopOfPageBid: 0, highTopOfPageBid: 0,
                monthlySearchVolumes: []
            };
        }
    }

    return results;
}

// ===== Google SERP Results (for competitor analysis) =====
async function getSerpResults(query, authHeader) {
    const requestBody = [{
        keyword: query,
        location_code: TURKEY_LOCATION_CODE,
        language_code: TURKISH_LANGUAGE_CODE,
        device: 'desktop',
        os: 'windows',
        depth: 30
    }];

    const response = await fetch(
        `${DATAFORSEO_API}/serp/google/organic/live/regular`,
        {
            method: 'POST',
            headers: { 'Authorization': authHeader, 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        }
    );

    if (!response.ok) throw new Error(`DataForSEO SERP error: ${response.status}`);

    const data = await response.json();
    const results = { query, competitors: [], marketplaceResults: [] };

    if (data.tasks?.[0]?.status_code === 20000 && data.tasks[0].result?.[0]?.items) {
        const items = data.tasks[0].result[0].items;

        for (const item of items) {
            if (item.type !== 'organic') continue;

            const domain = item.domain || '';
            const title = item.title || '';
            const url = item.url || '';
            const position = item.rank_absolute || 0;
            const description = item.description || '';

            const isMarketplace = /trendyol|hepsiburada|n11|gittigidiyor|amazon\.com\.tr|morhipo|boyner|lcwaikiki|defacto|koton/.test(domain);

            const entry = { title, domain, url, position, description };

            if (isMarketplace) {
                results.marketplaceResults.push(entry);
            }
            results.competitors.push(entry);
        }
    }

    return results;
}

// ===== Trendyol Competitor Search (FREE — no API key needed) =====
async function getTrendyolCompetitors(query) {
    // Try both API patterns
    const urls = [
        `https://public.trendyol.com/discovery-web-searchgw-service/v2/api/infinite-scroll/sr?q=${encodeURIComponent(query)}&pi=1&culture=tr-TR&storefrontId=1&language=tr&pageSize=20`,
        `https://apigw.trendyol.com/discovery-web-searchgw-service/v2/api/infinite-scroll/sr?q=${encodeURIComponent(query)}&pi=1&culture=tr-TR&storefrontId=1&language=tr&pageSize=20`
    ];

    let data = null;
    for (const url of urls) {
        try {
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                    'Accept': '*/*',
                    'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7'
                }
            });
            if (response.ok) {
                data = await response.json();
                break;
            }
        } catch (e) {
            continue;
        }
    }

    if (!data) {
        return { query, products: [], competitors: [], marketplaceResults: [], totalResults: 0, source: 'trendyol' };
    }

    const rawProducts = data?.result?.products || [];

    const products = rawProducts.map((p, i) => ({
        position: i + 1,
        title: p.name || '',
        brand: p.brand?.name || '',
        merchant: p.merchantName || '',
        price: p.price?.sellingPrice || p.price?.originalPrice || 0,
        rating: p.ratingScore?.averageRating || 0,
        reviewCount: p.ratingScore?.totalCount || 0,
        url: `https://www.trendyol.com${p.url || ''}`,
        imageUrl: p.images?.[0] ? `https://cdn.dsmcdn.com/${p.images[0]}` : ''
    }));

    // Extract unique stores/brands
    const stores = {};
    for (const p of products) {
        const key = p.merchant || p.brand;
        if (!key) continue;
        if (!stores[key]) {
            stores[key] = { name: key, domain: 'trendyol.com', count: 0, positions: [], titles: [] };
        }
        stores[key].count++;
        stores[key].positions.push(p.position);
        stores[key].titles.push(p.title);
    }

    const competitors = Object.values(stores)
        .sort((a, b) => a.positions[0] - b.positions[0])
        .slice(0, 10);

    // Also format as marketplace results for compatibility with existing frontend
    const marketplaceResults = products.map(p => ({
        title: `${p.brand} ${p.title}`,
        domain: 'trendyol.com',
        url: p.url,
        position: p.position,
        description: `${p.merchant} — ₺${p.price}`
    }));

    return {
        query,
        products,
        competitors,
        marketplaceResults,
        totalResults: data?.result?.totalCount || products.length,
        source: 'trendyol'
    };
}

function jsonResponse(data, status, corsHeaders) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
}
