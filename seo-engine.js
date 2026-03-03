// ===== SEO Analysis Engine =====
// Material mappings: technical term -> customer-friendly search terms
const MATERIAL_MAPPINGS = {
    'elastan': ['esnek', 'esnek kumaş', 'likralı', 'streç'],
    'likra': ['esnek', 'esnek kumaş', 'streç', 'likralı'],
    'spandex': ['esnek', 'esnek kumaş', 'streç'],
    'polyester': ['hafif', 'dayanıklı'],
    'pamuk': ['pamuklu', 'doğal kumaş', 'saf pamuk', '%100 pamuk'],
    'pamuklu': ['pamuklu', 'doğal kumaş'],
    'cotton': ['pamuklu', 'doğal kumaş'],
    'keten': ['keten', 'doğal', 'yazlık'],
    'linen': ['keten', 'doğal', 'yazlık'],
    'viskon': ['yumuşak kumaş', 'dökümlü'],
    'viskoz': ['yumuşak kumaş', 'dökümlü'],
    'saten': ['saten', 'parlak', 'ipeksi'],
    'şifon': ['şifon', 'transparan', 'hafif'],
    'denim': ['kot', 'denim', 'jean'],
    'kadife': ['kadife', 'yumuşak'],
    'polar': ['polar', 'sıcak tutan', 'içi tüylü'],
    'fleece': ['polar', 'sıcak tutan'],
    'kaşmir': ['kaşmir', 'premium'],
    'ipek': ['ipek', 'ipeksi', 'lüks'],
    'triko': ['triko', 'örgü', 'kışlık'],
    'krep': ['krep', 'dökümlü'],
    'tül': ['tül', 'transparan'],
    'dantel': ['dantelli', 'dantel'],
    'neopren': ['neopren', 'scuba kumaş'],
    'scuba': ['scuba kumaş', 'kalın kumaş'],
    'astar': ['astarlı'],
    'astarlı': ['astarlı'],
    'su geçirmez': ['su geçirmez', 'yağmurluk'],
    'su itici': ['su geçirmez', 'su itici'],
    'anti-bakteriyel': ['anti-bakteriyel', 'hijyenik'],
};

// Feature keywords that should be in title if found in description
const FEATURE_KEYWORDS = {
    'büyük beden': ['büyük beden', 'plus size', 'battal', 'xl', 'xxl'],
    'battal': ['büyük beden', 'battal', 'plus size'],
    'plus size': ['büyük beden', 'plus size'],
    'düğmeli': ['düğmeli'],
    'fermuarlı': ['fermuarlı', 'fermuar'],
    'kapüşonlu': ['kapüşonlu', 'kapşonlu'],
    'cepli': ['cepli'],
    'beli lastikli': ['beli lastikli', 'lastikli bel'],
    'lastikli': ['lastikli'],
    'yüksek bel': ['yüksek bel'],
    'slim fit': ['slim fit', 'dar kalıp'],
    'oversize': ['oversize', 'bol kalıp', 'salaş'],
    'regular fit': ['regular fit', 'normal kalıp'],
    'skinny': ['skinny', 'dar paça'],
    'boyfriend': ['boyfriend'],
    'mom fit': ['mom fit', 'mom jean'],
    'ispanyol paça': ['ispanyol paça', 'wide leg'],
    'bol paça': ['bol paça', 'wide leg'],
    'çizgili': ['çizgili'],
    'kareli': ['kareli', 'ekose'],
    'çiçekli': ['çiçekli', 'çiçek desenli'],
    'düz renk': ['düz renk', 'basic'],
    'baskılı': ['baskılı', 'yazılı'],
    'nakışlı': ['nakışlı', 'işlemeli'],
    'uzun kol': ['uzun kol', 'uzun kollu'],
    'kısa kol': ['kısa kol', 'kısa kollu'],
    'kolsuz': ['kolsuz'],
    'v yaka': ['v yaka', 'v yakalı'],
    'bisiklet yaka': ['bisiklet yaka', 'sıfır yaka'],
    'polo yaka': ['polo yaka'],
    'dik yaka': ['dik yaka'],
    'balıkçı yaka': ['balıkçı yaka', 'boğazlı'],
    'yırtmaçlı': ['yırtmaçlı'],
    'asimetrik': ['asimetrik'],
    'pileli': ['pileli', 'pile'],
    'fırfırlı': ['fırfırlı', 'volanlı'],
    'yarasa kol': ['yarasa kol'],
    'taş işlemeli': ['taş işlemeli', 'taşlı'],
    'payetli': ['payetli'],
};

// Category detection & correction system
const CATEGORY_MAPPINGS = {
    'tişört': {
        aliases: ['tshirt', 't-shirt', 'tişört', 'tisort', 't shirt'],
        searchTerms: ['tişört', 't-shirt', 'tshirt'],
        indicators: ['yuvarlak yaka', 'bisiklet yaka', 'kısa kol', 'baskılı', 'basic', 'oversize tişört'],
        conflicts: ['düğmeli', 'gömlek yaka', 'fermuar']
    },
    'gömlek': {
        aliases: ['gömlek', 'gomlek', 'shirt'],
        searchTerms: ['gömlek', 'shirt'],
        indicators: ['düğmeli', 'gömlek yaka', 'manşet', 'kol düğmesi', 'gömlek kumaş'],
        conflicts: []
    },
    'bluz': {
        aliases: ['bluz', 'blouse'],
        searchTerms: ['bluz', 'kadın bluz'],
        indicators: ['dökümlü', 'şifon', 'v yaka', 'fırfır', 'volan', 'kadın'],
        conflicts: []
    },
    'tunik': {
        aliases: ['tunik', 'tunic'],
        searchTerms: ['tunik', 'uzun tunik'],
        indicators: ['uzun', 'kalça altı', 'diz üstü', 'tunik boy'],
        conflicts: []
    },
    'elbise': {
        aliases: ['elbise', 'dress'],
        searchTerms: ['elbise', 'kadın elbise'],
        indicators: ['diz altı', 'diz üstü', 'maxi', 'midi', 'mini', 'elbise'],
        conflicts: []
    },
    'pantolon': {
        aliases: ['pantolon', 'pants', 'trousers'],
        searchTerms: ['pantolon', 'kadın pantolon', 'erkek pantolon'],
        indicators: ['bel', 'paça', 'bacak', 'pantolon'],
        conflicts: []
    },
    'jean': {
        aliases: ['jean', 'kot', 'denim pantolon', 'kot pantolon', 'jeans'],
        searchTerms: ['jean', 'kot pantolon', 'denim'],
        indicators: ['denim', 'kot', 'jean', 'indigo'],
        conflicts: []
    },
    'ceket': {
        aliases: ['ceket', 'jacket', 'blazer'],
        searchTerms: ['ceket', 'kadın ceket', 'blazer'],
        indicators: ['astar', 'yaka', 'ceket', 'blazer', 'kaban'],
        conflicts: []
    },
    'hırka': {
        aliases: ['hırka', 'hirka', 'cardigan'],
        searchTerms: ['hırka', 'kadın hırka'],
        indicators: ['önü açık', 'düğmeli', 'triko', 'örgü', 'hırka'],
        conflicts: []
    },
    'yelek': {
        aliases: ['yelek', 'vest'],
        searchTerms: ['yelek', 'kadın yelek'],
        indicators: ['kolsuz', 'yelek', 'şişme yelek'],
        conflicts: []
    },
    'eşofman': {
        aliases: ['eşofman', 'esofman', 'jogger', 'sweatpant'],
        searchTerms: ['eşofman', 'eşofman takım', 'jogger'],
        indicators: ['eşofman', 'jogger', 'paçası lastikli', 'spor'],
        conflicts: []
    },
    'sweatshirt': {
        aliases: ['sweatshirt', 'sweat', 'sweetshirt'],
        searchTerms: ['sweatshirt', 'sweat'],
        indicators: ['sweat', 'kapüşon', 'polar', 'içi tüylü'],
        conflicts: []
    },
    'mont': {
        aliases: ['mont', 'kaban', 'coat', 'parka'],
        searchTerms: ['mont', 'kaban', 'kadın mont'],
        indicators: ['mont', 'kaban', 'şişme', 'kaz tüyü', 'su geçirmez'],
        conflicts: []
    },
    'etek': {
        aliases: ['etek', 'skirt'],
        searchTerms: ['etek', 'kadın etek'],
        indicators: ['etek', 'pileli', 'mini etek', 'midi etek'],
        conflicts: []
    },
    'şort': {
        aliases: ['şort', 'sort', 'shorts'],
        searchTerms: ['şort', 'kadın şort', 'erkek şort'],
        indicators: ['şort', 'kısa', 'diz üstü'],
        conflicts: []
    },
    'takım': {
        aliases: ['takım', 'set', 'kombin'],
        searchTerms: ['takım', 'ikili takım', 'kombin'],
        indicators: ['takım', 'set', 'üst alt', 'ikili'],
        conflicts: []
    }
};

// Market search term database - what customers actually search for
const MARKET_SEARCH_PATTERNS = {
    'büyük beden': {
        popular: ['büyük beden kadın', 'büyük beden elbise', 'büyük beden pantolon', 'battal beden', 'plus size'],
        volume: 'çok yüksek'
    },
    'esnek': {
        popular: ['esnek pantolon', 'esnek kumaş', 'streç pantolon', 'likralı pantolon'],
        volume: 'yüksek'
    },
    'pamuklu': {
        popular: ['pamuklu tişört', 'saf pamuk', '%100 pamuk tişört', 'organik pamuk'],
        volume: 'yüksek'
    },
    'yazlık': {
        popular: ['yazlık elbise', 'yazlık pantolon', 'yazlık gömlek', 'ince kumaş'],
        volume: 'mevsimsel yüksek'
    },
    'kışlık': {
        popular: ['kışlık mont', 'kışlık pantolon', 'polar', 'kalın kumaş'],
        volume: 'mevsimsel yüksek'
    }
};

// Ideal title length range
const TITLE_LENGTH = { min: 40, ideal_min: 50, ideal_max: 80, max: 120 };

// ===== Core Analysis Function =====
function analyzeProduct(product) {
    const name = (product.name || '').trim();
    const desc = (product.description || '').trim();
    const descLower = desc.toLowerCase();
    const nameLower = name.toLowerCase();
    const results = {
        name, description: desc, image: product.image, category: product.category,
        score: 0, issues: [], suggestions: [], missingKeywords: [],
        presentKeywords: [], materialIssues: [], categoryIssues: [],
        scoreBreakdown: {}, suggestedName: ''
    };

    if (!name) { results.score = 0; results.issues.push({ type: 'critical', text: 'Ürün adı boş' }); return results; }

    let lengthScore = 100, keywordScore = 100, materialScore = 100, categoryScore = 100, structureScore = 100;

    // 1. Title Length Analysis
    const len = name.length;
    if (len < TITLE_LENGTH.min) {
        lengthScore = Math.max(20, (len / TITLE_LENGTH.min) * 70);
        results.issues.push({ type: 'warning', text: `Başlık çok kısa (${len} karakter). İdeal: ${TITLE_LENGTH.ideal_min}-${TITLE_LENGTH.ideal_max} karakter.` });
        results.suggestions.push({ type: 'info', text: `Başlığı en az ${TITLE_LENGTH.ideal_min} karaktere çıkarın. Eksik anahtar kelimeleri eklemek bunu doğal olarak sağlayacaktır.` });
    } else if (len > TITLE_LENGTH.max) {
        lengthScore = Math.max(40, 100 - ((len - TITLE_LENGTH.max) * 2));
        results.issues.push({ type: 'warning', text: `Başlık çok uzun (${len} karakter). İdeal: ${TITLE_LENGTH.ideal_min}-${TITLE_LENGTH.ideal_max} karakter.` });
    } else if (len >= TITLE_LENGTH.ideal_min && len <= TITLE_LENGTH.ideal_max) {
        lengthScore = 100;
    } else {
        lengthScore = 80;
    }

    // 2. Material Analysis
    let materialMissCount = 0;
    for (const [material, customerTerms] of Object.entries(MATERIAL_MAPPINGS)) {
        if (descLower.includes(material)) {
            const hasAny = customerTerms.some(t => nameLower.includes(t.toLowerCase()));
            const hasMaterial = nameLower.includes(material);
            if (!hasAny && !hasMaterial) {
                materialMissCount++;
                results.materialIssues.push({
                    material, customerTerms,
                    text: `Açıklamada "${material}" var ama başlıkta müşteri dostu karşılığı (${customerTerms.join(', ')}) yok.`
                });
                results.missingKeywords.push(...customerTerms.slice(0, 2));
                results.suggestions.push({
                    type: 'critical',
                    text: `Açıklamada <strong>"${material}"</strong> tespit edildi. Müşteriler bunu <strong>"${customerTerms[0]}"</strong> olarak arar. Başlığa eklenmeli.`
                });
            } else {
                results.presentKeywords.push(material);
            }
        }
    }
    if (materialMissCount > 0) materialScore = Math.max(10, 100 - (materialMissCount * 30));

    // 3. Feature Keyword Analysis
    let featureMissCount = 0;
    for (const [feature, variants] of Object.entries(FEATURE_KEYWORDS)) {
        if (descLower.includes(feature)) {
            const found = variants.some(v => nameLower.includes(v.toLowerCase()));
            if (!found) {
                featureMissCount++;
                results.missingKeywords.push(feature);
                if (['büyük beden', 'battal', 'plus size'].includes(feature)) {
                    results.suggestions.push({
                        type: 'critical',
                        text: `Açıklamada <strong>"${feature}"</strong> geçiyor ama başlıkta yok. Bu, beden arayan müşteriler için kritik bir anahtar kelime.`
                    });
                } else {
                    results.suggestions.push({
                        type: 'warning',
                        text: `<strong>"${feature}"</strong> özelliği açıklamada var ama başlıkta geçmiyor. Eklenmesi arama görünürlüğünü artırabilir.`
                    });
                }
            } else {
                results.presentKeywords.push(feature);
            }
        }
    }
    if (featureMissCount > 0) keywordScore = Math.max(10, 100 - (featureMissCount * 15));

    // 4. Category Analysis - detect mismatches & suggest market terms
    const detectedCategories = [];
    for (const [cat, data] of Object.entries(CATEGORY_MAPPINGS)) {
        let score = 0;
        for (const indicator of data.indicators) {
            if (descLower.includes(indicator)) score += 2;
            if (nameLower.includes(indicator)) score += 1;
        }
        if (score > 0) detectedCategories.push({ category: cat, score, data });
    }
    detectedCategories.sort((a, b) => b.score - a.score);

    const nameCategory = Object.entries(CATEGORY_MAPPINGS).find(([cat, data]) =>
        data.aliases.some(a => nameLower.includes(a))
    );

    if (detectedCategories.length > 0 && nameCategory) {
        const topDetected = detectedCategories[0];
        const nameCat = nameCategory[0];
        if (topDetected.category !== nameCat && topDetected.score >= 4) {
            categoryScore = 50;
            results.categoryIssues.push({
                current: nameCat, suggested: topDetected.category,
                text: `Başlıkta "${nameCat}" yazıyor ama açıklama içeriği "${topDetected.category}" kategorisine daha uygun görünüyor.`
            });
            results.suggestions.push({
                type: 'critical',
                text: `Kategori uyumsuzluğu: Başlıkta <strong>"${nameCat}"</strong> yazıyor ama ürün açıklaması <strong>"${topDetected.category}"</strong> kategorisine daha yakın. Pazarda müşteriler bu ürünü <strong>"${topDetected.data.searchTerms[0]}"</strong> olarak arıyor olabilir.`
            });
        }
    }

    if (detectedCategories.length > 0 && !nameCategory) {
        const suggested = detectedCategories[0];
        results.suggestions.push({
            type: 'warning',
            text: `Başlıkta net bir kategori tespit edilemedi. Açıklamaya göre bu ürün <strong>"${suggested.category}"</strong> kategorisinde. Başlığa <strong>"${suggested.data.searchTerms[0]}"</strong> eklenmesi önerilir.`
        });
        categoryScore = 70;
    }

    // 5. Market Search Pattern Check
    for (const [term, data] of Object.entries(MARKET_SEARCH_PATTERNS)) {
        const relevantInDesc = descLower.includes(term) || results.missingKeywords.some(k => k.includes(term));
        if (relevantInDesc && !nameLower.includes(term)) {
            results.suggestions.push({
                type: 'info',
                text: `Pazar verisi: <strong>"${term}"</strong> aramaları ${data.volume} hacimde. Popüler aramalar: ${data.popular.slice(0, 3).join(', ')}. Başlıkta kullanılması düşünülmeli.`
            });
        }
    }

    // 6. Structure Analysis
    if (nameLower === name) { /* all lowercase - OK for some platforms */ }
    const words = name.split(/\s+/);
    if (words.length < 3) {
        structureScore = 60;
        results.suggestions.push({ type: 'warning', text: 'Başlık çok az kelime içeriyor. Daha açıklayıcı bir başlık SEO performansını artırır.' });
    }
    const hasColor = /(?:siyah|beyaz|kırmızı|mavi|yeşil|sarı|turuncu|mor|pembe|gri|lacivert|bej|kahverengi|bordo|haki|ekru|krem|lila|fuşya|turkuaz|indigo|antrasit)/i.test(nameLower);
    if (!hasColor && /(?:siyah|beyaz|kırmızı|mavi|yeşil|sarı|turuncu|mor|pembe|gri|lacivert|bej|kahverengi|bordo|haki|ekru|krem|lila|fuşya|turkuaz|indigo|antrasit)/i.test(descLower)) {
        structureScore = Math.min(structureScore, 80);
        const colorMatch = descLower.match(/(?:siyah|beyaz|kırmızı|mavi|yeşil|sarı|turuncu|mor|pembe|gri|lacivert|bej|kahverengi|bordo|haki|ekru|krem|lila|fuşya|turkuaz|indigo|antrasit)/i);
        if (colorMatch) {
            results.suggestions.push({ type: 'info', text: `Açıklamada "${colorMatch[0]}" renk bilgisi var ama başlıkta geçmiyor. Renk eklemek arama görünürlüğünü artırır.` });
            results.missingKeywords.push(colorMatch[0]);
        }
    }

    // Calculate overall score
    results.scoreBreakdown = {
        length: Math.round(lengthScore),
        keywords: Math.round(keywordScore),
        materials: Math.round(materialScore),
        category: Math.round(categoryScore),
        structure: Math.round(structureScore)
    };
    results.score = Math.round(
        (lengthScore * 0.10) + (keywordScore * 0.30) + (materialScore * 0.30) +
        (categoryScore * 0.15) + (structureScore * 0.15)
    );

    // Determine severity
    if (results.score >= 80) results.severity = 'good';
    else if (results.score >= 50) results.severity = 'warning';
    else results.severity = 'critical';

    // Generate suggested name
    results.suggestedName = generateSuggestedName(results, detectedCategories);

    // Remove duplicate missing keywords
    results.missingKeywords = [...new Set(results.missingKeywords)];
    results.presentKeywords = [...new Set(results.presentKeywords)];

    return results;
}

function generateSuggestedName(analysis, detectedCategories) {
    let base = analysis.name;
    const nameLower = base.toLowerCase();
    const additions = [];

    // Fix category if mismatched
    if (analysis.categoryIssues.length > 0) {
        const issue = analysis.categoryIssues[0];
        const currentCatData = CATEGORY_MAPPINGS[issue.current];
        if (currentCatData) {
            for (const alias of currentCatData.aliases) {
                if (nameLower.includes(alias)) {
                    const regex = new RegExp(alias, 'gi');
                    base = base.replace(regex, issue.suggested.charAt(0).toUpperCase() + issue.suggested.slice(1));
                    break;
                }
            }
        }
    }

    // Add top missing material terms (max 2)
    const addedMaterials = [];
    for (const issue of analysis.materialIssues.slice(0, 2)) {
        const term = issue.customerTerms[0];
        if (!nameLower.includes(term.toLowerCase()) && !addedMaterials.includes(term)) {
            additions.push(term.charAt(0).toUpperCase() + term.slice(1));
            addedMaterials.push(term);
        }
    }

    // Add critical missing feature keywords (max 2)
    const criticalFeatures = ['büyük beden', 'battal', 'plus size'];
    let addedFeatureCount = 0;
    for (const kw of analysis.missingKeywords) {
        if (addedFeatureCount >= 2) break;
        if (criticalFeatures.includes(kw) && !nameLower.includes(kw)) {
            additions.push(kw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
            addedFeatureCount++;
        }
    }

    if (additions.length > 0) {
        return base + ' ' + additions.join(' ');
    }
    return base;
}

// Generate overall stats
function generateOverallStats(results) {
    const totalProducts = results.length;
    const avgScore = Math.round(results.reduce((s, r) => s + r.score, 0) / totalProducts);
    const criticalCount = results.filter(r => r.severity === 'critical').length;
    const warningCount = results.filter(r => r.severity === 'warning').length;
    const goodCount = results.filter(r => r.severity === 'good').length;
    const allMissing = results.flatMap(r => r.missingKeywords);
    const missingFreq = {};
    allMissing.forEach(k => { missingFreq[k] = (missingFreq[k] || 0) + 1; });
    const topMissing = Object.entries(missingFreq).sort((a, b) => b[1] - a[1]).slice(0, 15);

    const totalMissing = allMissing.length;
    const totalMaterialIssues = results.reduce((s, r) => s + r.materialIssues.length, 0);
    const titleLengthIssues = results.filter(r =>
        r.issues.some(i => i.text.includes('kısa') || i.text.includes('uzun'))
    ).length;

    return { totalProducts, avgScore, criticalCount, warningCount, goodCount, topMissing, totalMissing, totalMaterialIssues, titleLengthIssues };
}
