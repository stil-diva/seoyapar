// ===== SEO Analysis Engine v3.0 =====
// All keyword data is fetched LIVE from Google Autocomplete at analysis time
// No fake static volumes - everything is real-time Google data

// ===== KEYWORD DATABASE =====

// Material keywords - what people ACTUALLY search
const MATERIAL_KEYWORDS = {
    'viskon': { searchTerms: ['viskon'] },
    'viskoz': { searchTerms: ['viskon'] },
    'keten': { searchTerms: ['keten'] },
    'linen': { searchTerms: ['keten'] },
    'pamuk': { searchTerms: ['pamuklu', '%100 pamuk'] },
    'pamuklu': { searchTerms: ['pamuklu'] },
    'cotton': { searchTerms: ['pamuklu'] },
    'elastan': { searchTerms: ['esnek', 'streç', 'likralı'] },
    'likra': { searchTerms: ['likralı', 'esnek', 'streç'] },
    'spandex': { searchTerms: ['esnek', 'streç'] },
    'polyester': { searchTerms: [] },  // Müşteri aramaz
    'denim': { searchTerms: ['denim', 'kot'] },
    'saten': { searchTerms: ['saten'] },
    'şifon': { searchTerms: ['şifon'] },
    'kadife': { searchTerms: ['kadife'] },
    'triko': { searchTerms: ['triko', 'örgü'] },
    'krep': { searchTerms: ['krep'] },
    'kaşmir': { searchTerms: ['kaşmir'] },
    'ipek': { searchTerms: ['ipek'] },
    'polar': { searchTerms: ['polar', 'içi tüylü'] },
    'fleece': { searchTerms: ['polar'] },
    'tül': { searchTerms: ['tül'] },
    'dantel': { searchTerms: ['dantelli', 'dantel'] },
    'neopren': { searchTerms: ['neopren', 'scuba'] },
    'scuba': { searchTerms: ['scuba'] },
    'astar': { searchTerms: ['astarlı'] },
    'astarlı': { searchTerms: ['astarlı'] }
};

// Feature keywords with priorities (volumes fetched live from Google)
const FEATURE_KEYWORDS = {
    'büyük beden': { searchTerms: ['büyük beden'], priority: 'critical' },
    'battal': { searchTerms: ['büyük beden', 'battal beden'], priority: 'critical' },
    'plus size': { searchTerms: ['büyük beden', 'plus size'], priority: 'critical' },
    'oversize': { searchTerms: ['oversize'], priority: 'high' },
    'slim fit': { searchTerms: ['slim fit'], priority: 'high' },
    'kapüşonlu': { searchTerms: ['kapüşonlu'], priority: 'high' },
    'yüksek bel': { searchTerms: ['yüksek bel'], priority: 'high' },
    'palazzo': { searchTerms: ['palazzo'], priority: 'high' },
    'ispanyol paça': { searchTerms: ['ispanyol paça'], priority: 'high' },
    'jogger': { searchTerms: ['jogger'], priority: 'high' },
    'beli lastikli': { searchTerms: ['beli lastikli'], priority: 'medium' },
    'fermuarlı': { searchTerms: ['fermuarlı'], priority: 'medium' },
    'düğmeli': { searchTerms: ['düğmeli'], priority: 'medium' },
    'cepli': { searchTerms: ['cepli'], priority: 'medium' },
    'boyfriend': { searchTerms: ['boyfriend'], priority: 'medium' },
    'mom fit': { searchTerms: ['mom fit', 'mom jean'], priority: 'medium' },
    'bol paça': { searchTerms: ['bol paça'], priority: 'medium' },
    'skinny': { searchTerms: ['skinny'], priority: 'medium' },
    'regular fit': { searchTerms: ['regular fit'], priority: 'low' },
    'v yaka': { searchTerms: ['v yaka'], priority: 'medium' },
    'bisiklet yaka': { searchTerms: ['bisiklet yaka'], priority: 'low' },
    'polo yaka': { searchTerms: ['polo yaka'], priority: 'medium' },
    'balıkçı yaka': { searchTerms: ['balıkçı yaka', 'boğazlı'], priority: 'medium' },
    'dik yaka': { searchTerms: ['dik yaka'], priority: 'low' },
    'uzun kol': { searchTerms: ['uzun kollu', 'uzun kol'], priority: 'high' },
    'uzun kollu': { searchTerms: ['uzun kollu'], priority: 'high' },
    'kısa kol': { searchTerms: ['kısa kollu', 'kısa kol'], priority: 'high' },
    'kısa kollu': { searchTerms: ['kısa kollu'], priority: 'high' },
    'kolsuz': { searchTerms: ['kolsuz'], priority: 'low' },
    'çizgili': { searchTerms: ['çizgili'], priority: 'medium' },
    'kareli': { searchTerms: ['kareli', 'ekose'], priority: 'medium' },
    'çiçekli': { searchTerms: ['çiçekli', 'çiçek desenli'], priority: 'medium' },
    'baskılı': { searchTerms: ['baskılı'], priority: 'medium' },
    'nakışlı': { searchTerms: ['nakışlı'], priority: 'low' },
    'yırtmaçlı': { searchTerms: ['yırtmaçlı'], priority: 'medium' },
    'pileli': { searchTerms: ['pileli'], priority: 'medium' },
    'fırfırlı': { searchTerms: ['fırfırlı', 'volanlı'], priority: 'low' },
    'yarasa kol': { searchTerms: ['yarasa kol'], priority: 'low' },
    'asimetrik': { searchTerms: ['asimetrik'], priority: 'low' },
    'taş işlemeli': { searchTerms: ['taşlı', 'taş işlemeli'], priority: 'low' },
    'payetli': { searchTerms: ['payetli'], priority: 'medium' },
    'su geçirmez': { searchTerms: ['su geçirmez'], priority: 'high' },
    'içi tüylü': { searchTerms: ['içi tüylü'], priority: 'medium' },
    'yazlık': { searchTerms: ['yazlık'], priority: 'high' },
    'kışlık': { searchTerms: ['kışlık'], priority: 'high' }
};

// Category detection with search volumes
const CATEGORY_MAPPINGS = {
    'tişört': {
        aliases: ['tshirt', 't-shirt', 'tişört', 'tisort', 't shirt'],
        searchTerms: ['tişört', 't-shirt'],
        indicators: ['yuvarlak yaka', 'bisiklet yaka', 'kısa kol', 'baskılı', 'basic', 'oversize tişört'],
        conflicts: ['düğmeli', 'gömlek yaka', 'fermuar']
    },
    'gömlek': {
        aliases: ['gömlek', 'gomlek', 'shirt'],
        searchTerms: ['gömlek'],
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
        searchTerms: ['tunik'],
        indicators: ['uzun', 'kalça altı', 'diz üstü', 'tunik boy'],
        conflicts: []
    },
    'elbise': {
        aliases: ['elbise', 'dress'],
        searchTerms: ['elbise'],
        indicators: ['diz altı', 'diz üstü', 'maxi', 'midi', 'mini', 'elbise'],
        conflicts: []
    },
    'pantolon': {
        aliases: ['pantolon', 'pants', 'trousers'],
        searchTerms: ['pantolon'],
        indicators: ['bel', 'paça', 'bacak', 'pantolon'],
        conflicts: []
    },
    'jean': {
        aliases: ['jean', 'kot', 'denim pantolon', 'kot pantolon', 'jeans'],
        searchTerms: ['kot pantolon', 'jean'],
        indicators: ['denim', 'kot', 'jean', 'indigo'],
        conflicts: []
    },
    'ceket': {
        aliases: ['ceket', 'jacket', 'blazer'],
        searchTerms: ['ceket', 'blazer'],
        indicators: ['astar', 'yaka', 'ceket', 'blazer', 'kaban'],
        conflicts: []
    },
    'hırka': {
        aliases: ['hırka', 'hirka', 'cardigan'],
        searchTerms: ['hırka'],
        indicators: ['önü açık', 'düğmeli', 'triko', 'örgü', 'hırka'],
        conflicts: []
    },
    'yelek': {
        aliases: ['yelek', 'vest'],
        searchTerms: ['yelek'],
        indicators: ['kolsuz', 'yelek', 'şişme yelek'],
        conflicts: []
    },
    'eşofman': {
        aliases: ['eşofman', 'esofman', 'jogger', 'sweatpant'],
        searchTerms: ['eşofman', 'eşofman takım'],
        indicators: ['eşofman', 'jogger', 'paçası lastikli', 'spor'],
        conflicts: []
    },
    'sweatshirt': {
        aliases: ['sweatshirt', 'sweat', 'sweetshirt'],
        searchTerms: ['sweatshirt'],
        indicators: ['sweat', 'kapüşon', 'polar', 'içi tüylü'],
        conflicts: []
    },
    'mont': {
        aliases: ['mont', 'kaban', 'coat', 'parka'],
        searchTerms: ['mont', 'kaban'],
        indicators: ['mont', 'kaban', 'şişme', 'kaz tüyü', 'su geçirmez'],
        conflicts: []
    },
    'etek': {
        aliases: ['etek', 'skirt'],
        searchTerms: ['etek'],
        indicators: ['etek', 'pileli', 'mini etek', 'midi etek'],
        conflicts: []
    },
    'şort': {
        aliases: ['şort', 'sort', 'shorts'],
        searchTerms: ['şort'],
        indicators: ['şort', 'kısa', 'diz üstü'],
        conflicts: []
    },
    'takım': {
        aliases: ['takım', 'set', 'kombin'],
        searchTerms: ['takım', 'ikili takım'],
        indicators: ['takım', 'set', 'üst alt', 'ikili'],
        conflicts: []
    },
    'kazak': {
        aliases: ['kazak', 'sweater'],
        searchTerms: ['kazak'],
        indicators: ['kazak', 'triko', 'örgü', 'yün'],
        conflicts: []
    }
};

// Color keywords with search relevance
const COLORS = ['siyah', 'beyaz', 'kırmızı', 'mavi', 'yeşil', 'sarı', 'turuncu', 'mor', 'pembe', 'gri', 'lacivert', 'bej', 'kahverengi', 'bordo', 'haki', 'ekru', 'krem', 'lila', 'fuşya', 'turkuaz', 'indigo', 'antrasit', 'nude', 'pudra', 'mint', 'hardal', 'kiremit', 'mürdüm', 'petrol'];

// Ideal title length range
const TITLE_LENGTH = { min: 30, ideal_min: 40, ideal_max: 75, max: 80 };

// ===== CORE ANALYSIS FUNCTION =====
function analyzeProduct(product) {
    const name = (product.name || '').trim();
    const desc = (product.description || '').trim();
    const descLower = desc.toLowerCase();
    const nameLower = name.toLowerCase();

    const results = {
        name, description: desc, image: product.image, category: product.category,
        score: 0, suggestions: [], missingKeywords: [], presentKeywords: [],
        materialIssues: [], categoryIssues: [],
        scoreBreakdown: {}, suggestedName: '', severity: 'good',
        // NEW: reach and volume data
        currentReach: 0,
        potentialReach: 0,
        missedVolume: 0,
        keywordDetails: []  // detailed per-keyword info with volumes
    };

    if (!name) {
        results.score = 0;
        results.suggestions.push({ type: 'critical', text: 'Ürün adı boş' });
        return results;
    }

    let lengthScore = 100, keywordScore = 100, materialScore = 100, categoryScore = 100, structureScore = 100;
    let currentVolumeTotal = 0;
    let missedVolumeTotal = 0;

    // 1. TITLE LENGTH ANALYSIS
    const len = name.length;
    if (len < TITLE_LENGTH.min) {
        lengthScore = Math.max(20, (len / TITLE_LENGTH.min) * 70);
        results.suggestions.push({
            type: 'warning',
            text: `Başlık çok kısa (${len} karakter). İdeal: ${TITLE_LENGTH.ideal_min}-${TITLE_LENGTH.ideal_max} karakter. Kısa başlıklar arama sonuçlarında dezavantajlıdır.`
        });
    } else if (len > TITLE_LENGTH.max) {
        lengthScore = Math.max(40, 100 - ((len - TITLE_LENGTH.max) * 2));
        results.suggestions.push({
            type: 'warning',
            text: `Başlık çok uzun (${len} karakter). Trendyol 80 karakterden sonra keser! Maksimum 80 karakter olmalı.`
        });
    } else if (len >= TITLE_LENGTH.ideal_min && len <= TITLE_LENGTH.ideal_max) {
        lengthScore = 100;
    } else {
        lengthScore = 85;
    }

    // 2. MATERIAL ANALYSIS (with real search volumes)
    let materialMissCount = 0;
    for (const [material, data] of Object.entries(MATERIAL_KEYWORDS)) {
        if (descLower.includes(material)) {
            // Skip materials with no search value (e.g., polyester)
            if (data.searchTerms.length === 0) {
                results.keywordDetails.push({
                    keyword: material, type: 'material', status: 'skip',
                    monthlyVolume: 0,
                    note: data.note
                });
                continue;
            }

            const hasAny = data.searchTerms.some(t => nameLower.includes(t.toLowerCase()));
            const hasMaterial = nameLower.includes(material);

            if (!hasAny && !hasMaterial) {
                materialMissCount++;
                const topTerm = data.searchTerms[0];
                results.materialIssues.push({
                    material, searchTerms: data.searchTerms,
                    monthlyVolume: 0,
                    text: `"${material}" açıklamada var, başlıkta "${topTerm}" olmalı`
                });
                results.missingKeywords.push(topTerm);
                missedVolumeTotal += 0;

                results.keywordDetails.push({
                    keyword: topTerm, type: 'material', status: 'missing',
                    monthlyVolume: 0,
                    source: material,
                    note: data.note
                });

                results.suggestions.push({
                    type: 'critical',
                    text: `Açıklamada <strong>"${material}"</strong> var. Müşteriler <strong>"${topTerm}"</strong> olarak arar.`
                });
            } else {
                const matchedTerm = hasMaterial ? material : data.searchTerms.find(t => nameLower.includes(t.toLowerCase()));
                results.presentKeywords.push(matchedTerm || material);
                currentVolumeTotal += 0;
                results.keywordDetails.push({
                    keyword: matchedTerm || material, type: 'material', status: 'present',
                    monthlyVolume: 0,
                    note: data.note
                });
            }
        }
    }
    if (materialMissCount > 0) materialScore = Math.max(10, 100 - (materialMissCount * 30));

    // 3. FEATURE KEYWORD ANALYSIS (with volumes & priority)
    let featureMissCount = 0;
    for (const [feature, data] of Object.entries(FEATURE_KEYWORDS)) {
        if (descLower.includes(feature)) {
            const found = data.searchTerms.some(v => nameLower.includes(v.toLowerCase()));
            if (!found && !nameLower.includes(feature)) {
                featureMissCount++;
                results.missingKeywords.push(data.searchTerms[0]);
                missedVolumeTotal += 0;

                results.keywordDetails.push({
                    keyword: data.searchTerms[0], type: 'feature', status: 'missing',
                    monthlyVolume: 0,
                    priority: data.priority
                });

                const priorityLabel = data.priority === 'critical' ? 'KRİTİK' : data.priority === 'high' ? 'YÜKSEK' : 'ORTA';
                const suggestionType = data.priority === 'critical' ? 'critical' : data.priority === 'high' ? 'critical' : 'warning';

                results.suggestions.push({
                    type: suggestionType,
                    text: `<strong>"${data.searchTerms[0]}"</strong> açıklamada var, başlıkta yok. <span class="priority-badge priority-${data.priority}">${priorityLabel}</span>`
                });
            } else {
                results.presentKeywords.push(feature);
                currentVolumeTotal += 0;
                results.keywordDetails.push({
                    keyword: feature, type: 'feature', status: 'present',
                    monthlyVolume: 0,
                    priority: data.priority
                });
            }
        }
    }
    if (featureMissCount > 0) keywordScore = Math.max(10, 100 - (featureMissCount * 12));

    // 4. CATEGORY ANALYSIS (context-aware - filters out kombin/styling mentions)
    const KOMBIN_CONTEXT_WORDS = [
        'kombin', 'kombine', 'kombinle', 'birlikte', 'altına', 'üstüne', 'üzerine',
        'yanına', 'ile giyin', 'ile giyeceğiniz', 'ile tamamla', 'giyebilirsiniz',
        'tercih edebilirsiniz', 'ile kullan', 'şıklığını', 'tamamlayın',
        'ile buluştur', 'ile eşleştir', 'sneaker', 'ayakkabı', 'çanta',
        'aksesuar', 'takı', 'stilini', 'tamamlar', 'gard[ıi]rob'
    ];
    const kombinContextRegex = new RegExp(
        `(?:${KOMBIN_CONTEXT_WORDS.join('|')})\\s*(?:\\w+\\s+){0,5}`,
        'gi'
    );

    // Find kombin/styling sections in description to exclude
    function isInKombinContext(keyword, text) {
        const lowerText = text.toLowerCase();
        const keywordIndex = lowerText.indexOf(keyword.toLowerCase());
        if (keywordIndex === -1) return false;

        // Check 120 chars before the keyword for kombin context words
        const contextBefore = lowerText.substring(Math.max(0, keywordIndex - 120), keywordIndex);
        // Check if there's a sentence boundary between context word and keyword
        const hasSentenceBreak = /[.!?\n]/.test(contextBefore.slice(-60));

        if (!hasSentenceBreak) {
            for (const ctx of KOMBIN_CONTEXT_WORDS) {
                if (contextBefore.includes(ctx)) return true;
            }
        }

        // Also check for paragraph tags suggesting a different section
        const beforeSection = lowerText.substring(Math.max(0, keywordIndex - 200), keywordIndex);
        if (beforeSection.includes('<p>') && (beforeSection.includes('kombin') || beforeSection.includes('stil'))) {
            return true;
        }

        return false;
    }

    const detectedCategories = [];
    for (const [cat, data] of Object.entries(CATEGORY_MAPPINGS)) {
        let score = 0;
        for (const indicator of data.indicators) {
            // Check if indicator appears in description but NOT in kombin context
            if (descLower.includes(indicator)) {
                if (!isInKombinContext(indicator, desc)) {
                    score += 2;  // Primary description mention
                } else {
                    score -= 1;  // Kombin context, actually subtract
                }
            }
            if (nameLower.includes(indicator)) score += 3; // Title mentions are very strong
        }
        if (score > 0) detectedCategories.push({ category: cat, score, data });
    }
    detectedCategories.sort((a, b) => b.score - a.score);

    const nameCategory = Object.entries(CATEGORY_MAPPINGS).find(([cat, data]) =>
        data.aliases.some(a => nameLower.includes(a))
    );

    // Only suggest category change if very confident (score >= 6 AND much higher than alternatives)
    if (detectedCategories.length > 0 && nameCategory) {
        const topDetected = detectedCategories[0];
        const nameCat = nameCategory[0];
        const nameCatEntry = detectedCategories.find(d => d.category === nameCat);
        const nameCatScore = nameCatEntry ? nameCatEntry.score : 0;

        // Only flag if: different category, high confidence, AND significantly higher score
        if (topDetected.category !== nameCat && topDetected.score >= 6 && topDetected.score > nameCatScore * 2) {
            categoryScore = 50;
            results.categoryIssues.push({
                current: nameCat, suggested: topDetected.category,
                monthlyVolume: 0,
                text: `Başlıkta "${nameCat}" var ama içerik "${topDetected.category}" kategorisine uygun`
            });
            results.suggestions.push({
                type: 'critical',
                text: `Kategori uyumsuzluğu: <strong>"${nameCat}"</strong> yerine <strong>"${topDetected.category}"</strong> daha doğru.`
            });
        }
    }

    if (detectedCategories.length > 0 && !nameCategory) {
        const suggested = detectedCategories[0];
        // Only suggest if high confidence
        if (suggested.score >= 4) {
            categoryScore = 70;
            results.suggestions.push({
                type: 'warning',
                text: `Başlıkta kategori yok. Açıklamaya göre <strong>"${suggested.data.searchTerms[0]}"</strong> eklenmeli.`
            });
        }
    }

    // Add category volume to current reach if present
    if (nameCategory) {
        // Category present in title
    }

    // 5. COLOR CHECK (with proper word boundaries to avoid "tasarım" → "sarı" false positives)
    const colorPattern = COLORS.map(c => `(?:^|[\\s,;.!?()\\[\\]/<>])${c}(?:$|[\\s,;.!?()\\[\\]/<>])`).join('|');
    const colorRegex = new RegExp(colorPattern, 'gi');
    const descColorMatches = descLower.match(colorRegex);
    const nameColorMatches = nameLower.match(colorRegex);
    const extractColor = (match) => match.trim().replace(/[^a-züöçşığ]/gi, '');
    const descColors = descColorMatches ? descColorMatches.map(extractColor).filter(Boolean) : null;
    const nameColors = nameColorMatches ? nameColorMatches.map(extractColor).filter(Boolean) : null;
    if (descColors && descColors.length > 0 && (!nameColors || nameColors.length === 0)) {
        structureScore = Math.min(structureScore, 85);
        const missingColor = descColors[0];
        results.suggestions.push({
            type: 'info',
            text: `Açıklamada <strong>"${missingColor}"</strong> renk var ama başlıkta yok. Renk eklemek tıklama oranını artırır.`
        });
    }

    // 6. STRUCTURE ANALYSIS
    const words = name.split(/\s+/);
    if (words.length < 3) {
        structureScore = 60;
        results.suggestions.push({
            type: 'warning',
            text: 'Başlık çok kısa. Trendyol ve Hepsiburada\'da en az 4-5 kelimelik başlıklar daha iyi sıralanır.'
        });
    }

    // Calculate scores
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

    // Severity
    if (results.score >= 80) results.severity = 'good';
    else if (results.score >= 50) results.severity = 'warning';
    else results.severity = 'critical';

    // Reach calculations
    results.currentReach = currentVolumeTotal;
    results.missedVolume = missedVolumeTotal;
    results.potentialReach = currentVolumeTotal + missedVolumeTotal;

    // Generate suggested name
    results.suggestedName = generateSuggestedName(results, detectedCategories);

    // Deduplicate
    results.missingKeywords = [...new Set(results.missingKeywords)];
    results.presentKeywords = [...new Set(results.presentKeywords)];

    return results;
}

// ===== SMART SUGGESTED NAME GENERATOR =====
// Proper Turkish e-commerce title order: [Beden] [Özellikler] [Renk] [Malzeme] [Kategori] [SKU]
function generateSuggestedName(analysis, detectedCategories) {
    const originalName = analysis.name;
    const nameLower = originalName.toLowerCase();
    const descLower = (analysis.description || '').toLowerCase();

    // 1. Extract SKU/product code (numbers, typically 4-8 digits, or codes like E11103, T169)
    // Check end of title first, then anywhere in title
    const skuMatchEnd = originalName.match(/\s+(\d{4,8})\s*$/);
    const skuMatchCode = originalName.match(/\s+([A-Z]?\d{4,8})\s*$/);
    const skuMatch = skuMatchEnd || skuMatchCode;
    const sku = skuMatch ? skuMatch[1] : '';
    let workingName = sku ? originalName.replace(new RegExp('\\s+' + sku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*$'), '').trim() : originalName;

    // 2. Detect and extract existing components from the title
    const SIZE_KEYWORDS = ['büyük beden', 'battal beden', 'battal', 'plus size', 'oversize', 'slim fit', 'regular fit', 'mom fit', 'boyfriend'];
    const ALL_COLORS = [...COLORS];

    // All known category names
    const allCategoryNames = [];
    for (const [cat, data] of Object.entries(CATEGORY_MAPPINGS)) {
        allCategoryNames.push(cat);
        data.aliases.forEach(a => { if (!allCategoryNames.includes(a)) allCategoryNames.push(a); });
    }

    // All known material search terms  
    const allMaterialTerms = [];
    for (const [mat, data] of Object.entries(MATERIAL_KEYWORDS)) {
        allMaterialTerms.push(mat);
        data.searchTerms.forEach(t => { if (!allMaterialTerms.includes(t)) allMaterialTerms.push(t); });
    }

    // All known feature terms
    const allFeatureTerms = Object.keys(FEATURE_KEYWORDS);

    // Parse existing title into components
    let sizeModifier = '';
    let category = '';
    let color = '';
    let materials = [];
    let features = [];
    let remainingWords = [];

    const wLower = workingName.toLowerCase();

    // Extract size modifier
    for (const sz of SIZE_KEYWORDS) {
        if (wLower.includes(sz)) {
            sizeModifier = sz;
            workingName = workingName.replace(new RegExp(sz.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '').trim();
            break;
        }
    }

    // Extract category (find the longest matching category)
    const sortedCats = allCategoryNames.sort((a, b) => b.length - a.length);
    for (const cat of sortedCats) {
        const catRegex = new RegExp(`\\b${cat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
        if (catRegex.test(workingName)) {
            category = cat;
            workingName = workingName.replace(catRegex, '').trim();
            break;
        }
    }

    // Extract colors
    for (const c of ALL_COLORS) {
        const cRegex = new RegExp(`(?:^|\\s)${c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:\\s|$)`, 'gi');
        if (cRegex.test(workingName)) {
            color = c;
            workingName = workingName.replace(new RegExp(`\\b${c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi'), '').trim();
            break; // Usually only one color
        }
    }

    // Extract materials
    const sortedMaterials = allMaterialTerms.sort((a, b) => b.length - a.length);
    for (const mat of sortedMaterials) {
        const matRegex = new RegExp(`\\b${mat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
        if (matRegex.test(workingName)) {
            materials.push(mat);
            workingName = workingName.replace(matRegex, '').trim();
        }
    }

    // Everything remaining is features/descriptors
    remainingWords = workingName.replace(/\s+/g, ' ').trim();

    // 3. Determine what to ADD from the analysis
    let addSize = '';
    let addMaterials = [];
    let addFeatures = [];

    // Fix category if mismatched
    if (analysis.categoryIssues.length > 0) {
        category = analysis.categoryIssues[0].suggested;
    }

    // If no category detected, try from analysis
    if (!category && detectedCategories.length > 0) {
        category = detectedCategories[0].category;
    }

    // Get missing keywords sorted by volume
    const sortedMissing = analysis.keywordDetails
        .filter(k => k.status === 'missing')
        .sort((a, b) => {
            const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
            return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        });

    for (const kw of sortedMissing) {
        const term = kw.keyword;
        if (SIZE_KEYWORDS.some(s => term.includes(s)) && !sizeModifier) {
            addSize = term;
        } else if (kw.type === 'material' && addMaterials.length < 2) {
            addMaterials.push(term);
        } else if (addFeatures.length < 2) {
            addFeatures.push(term);
        }
    }

    // 4. Reconstruct title in proper order (MAX 80 CHARS)
    const MAX_TITLE_LENGTH = 80;

    function buildTitle(featuresExtra, materialsExtra) {
        const parts = [];
        const finalSize = sizeModifier || addSize;
        if (finalSize) parts.push(titleCase(finalSize));

        // Features (new additions + existing)
        featuresExtra.forEach(f => parts.push(titleCase(f)));
        if (remainingWords) parts.push(remainingWords);

        // Color
        if (color) parts.push(titleCase(color));

        // Materials (existing + new additions)
        const allMats = [...new Set([...materials, ...materialsExtra])];
        allMats.forEach(m => parts.push(titleCase(m)));

        // Category
        if (category) parts.push(titleCase(category));

        // SKU (always kept)
        if (sku) parts.push(sku);

        return parts.join(' ').replace(/\s+/g, ' ').trim();
    }

    // Build full title first
    let result = buildTitle(addFeatures, addMaterials);

    // If over 80 chars, progressively drop lowest-priority additions
    if (result.length > MAX_TITLE_LENGTH) {
        // Try dropping added features one by one (from end = lowest priority)
        let trimFeatures = [...addFeatures];
        let trimMaterials = [...addMaterials];

        while (result.length > MAX_TITLE_LENGTH && trimFeatures.length > 0) {
            trimFeatures.pop();
            result = buildTitle(trimFeatures, trimMaterials);
        }
        while (result.length > MAX_TITLE_LENGTH && trimMaterials.length > 0) {
            trimMaterials.pop();
            result = buildTitle(trimFeatures, trimMaterials);
        }
    }

    // If nothing changed meaningfully, return original
    if (result.toLowerCase() === originalName.toLowerCase() || sortedMissing.length === 0) {
        return originalName;
    }

    return result;
}

function titleCase(str) {
    // Special abbreviations that should be all uppercase
    const UPPERCASE_WORDS = ['v', 'xl', 'xxl', 'xxxl', 'xs', 'sm', 'md', 'lg'];

    return str.split(' ').map(w => {
        if (w.startsWith('%')) return w; // %100 pamuk
        if (/^\d/.test(w)) return w; // numbers
        const wLower = w.toLowerCase();
        if (UPPERCASE_WORDS.includes(wLower)) return w.toUpperCase(); // V → V, XL → XL
        if (w.length <= 1) return w.toUpperCase(); // single char uppercase
        return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    }).join(' ');
}

// ===== OVERALL STATS =====
function generateOverallStats(results) {
    const totalProducts = results.length;
    const avgScore = Math.round(results.reduce((s, r) => s + r.score, 0) / totalProducts);
    const criticalCount = results.filter(r => r.severity === 'critical').length;
    const warningCount = results.filter(r => r.severity === 'warning').length;
    const goodCount = results.filter(r => r.severity === 'good').length;

    // Missing keywords frequency
    const allMissing = results.flatMap(r => r.missingKeywords);
    const missingFreq = {};
    allMissing.forEach(k => { missingFreq[k] = (missingFreq[k] || 0) + 1; });
    const topMissing = Object.entries(missingFreq).sort((a, b) => b[1] - a[1]).slice(0, 15);

    const totalMissing = allMissing.length;
    const totalMaterialIssues = results.reduce((s, r) => s + r.materialIssues.length, 0);
    const titleLengthIssues = results.filter(r =>
        r.suggestions.some(s => s.text.includes('kısa') || s.text.includes('uzun'))
    ).length;

    // Keyword counts
    const totalPresentKeywords = results.reduce((s, r) => s + r.presentKeywords.length, 0);
    const totalMissingKeywords = results.reduce((s, r) => s + r.missingKeywords.length, 0);

    // Top missed keywords sorted by frequency across products
    const missedKeywordCounts = {};
    results.forEach(r => {
        r.keywordDetails.filter(k => k.status === 'missing').forEach(k => {
            if (!missedKeywordCounts[k.keyword]) {
                missedKeywordCounts[k.keyword] = { count: 0 };
            }
            missedKeywordCounts[k.keyword].count++;
        });
    });
    const topMissedWithVolume = Object.entries(missedKeywordCounts)
        .map(([kw, d]) => ({ keyword: kw, count: d.count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 15);

    return {
        totalProducts, avgScore, criticalCount, warningCount, goodCount,
        topMissing, totalMissing, totalMaterialIssues, titleLengthIssues,
        totalPresentKeywords, totalMissingKeywords,
        topMissedWithVolume
    };
}

// ===== DATAFORSEO API =====
// Connects to Cloudflare Worker proxy for real search volumes
// Uses DataForSEO (dataforseo.com) as data source

// Config: Worker URL (set via Settings or localStorage)
let KEYWORD_API_URL = localStorage.getItem('seo_keyword_api_url') || '';
let _keywordApiAvailable = null; // null = unchecked, true/false = checked
let _keywordApiCredits = null; // remaining balance
let _keywordApiEnabled = localStorage.getItem('seo_keyword_api_enabled') !== 'false'; // default true

function setKeywordApiUrl(url) {
    KEYWORD_API_URL = url;
    localStorage.setItem('seo_keyword_api_url', url);
    _keywordApiAvailable = null;
    _keywordApiCredits = null;
}

function getKeywordApiUrl() {
    return KEYWORD_API_URL;
}

function getKeywordApiCredits() {
    return _keywordApiCredits;
}

function setKeywordApiEnabled(enabled) {
    _keywordApiEnabled = enabled;
    localStorage.setItem('seo_keyword_api_enabled', enabled ? 'true' : 'false');
    _keywordApiAvailable = null; // reset check
}

function isKeywordApiEnabled() {
    return _keywordApiEnabled;
}

// Check if the DataForSEO API is available
async function checkKeywordApi() {
    if (!_keywordApiEnabled) { _keywordApiAvailable = false; return false; }
    if (!KEYWORD_API_URL) { _keywordApiAvailable = false; return false; }
    try {
        const resp = await fetch(KEYWORD_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'health' })
        });
        const data = await resp.json();
        _keywordApiAvailable = data.status === 'ok' && data.hasCredentials;
        if (data.credits !== undefined && data.credits >= 0) {
            _keywordApiCredits = data.credits;
        }
        return _keywordApiAvailable;
    } catch (e) {
        console.warn('DataForSEO API health check failed:', e);
        _keywordApiAvailable = false;
        return false;
    }
}

// Fetch real search volumes from DataForSEO via proxy
async function fetchKeywordVolumes(keywords) {
    if (!KEYWORD_API_URL || !_keywordApiAvailable) return null;

    try {
        // Batch: max 1000 per request (DataForSEO limit)
        const batches = [];
        for (let i = 0; i < keywords.length; i += 1000) {
            batches.push(keywords.slice(i, i + 1000));
        }

        const allResults = {};
        for (const batch of batches) {
            const resp = await fetch(KEYWORD_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keywords: batch })
            });
            const data = await resp.json();
            if (data.success && data.data) {
                Object.assign(allResults, data.data);
            }
        }
        return allResults;
    } catch (e) {
        console.warn('DataForSEO volume fetch failed:', e);
        return null;
    }
}

// ===== GOOGLE AUTOCOMPLETE - REAL-TIME KEYWORD RESEARCH =====

// Cache to avoid duplicate requests
const _autocompleteCache = {};

// Query Google Autocomplete via JSONP (no CORS issues)
function googleAutocomplete(query) {
    if (_autocompleteCache[query]) return Promise.resolve(_autocompleteCache[query]);
    return new Promise((resolve) => {
        const cbName = '_ac_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
        const script = document.createElement('script');

        const timeout = setTimeout(() => {
            resolve([]);
            cleanup();
        }, 4000);

        function cleanup() {
            clearTimeout(timeout);
            delete window[cbName];
            if (script.parentNode) script.remove();
        }

        window[cbName] = function (data) {
            const suggestions = data[1] || [];
            _autocompleteCache[query] = suggestions;
            resolve(suggestions);
            cleanup();
        };

        script.src = `https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(query)}&hl=tr&gl=tr&callback=${cbName}`;
        script.onerror = () => { resolve([]); cleanup(); };
        document.head.appendChild(script);
    });
}

// Small delay utility
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

// Generate smart long-tail keyword combos from product attributes
function generateLongTailQueries(product, analysisResult) {
    const queries = [];
    const nameLower = (product.name || '').toLowerCase();
    const descLower = (product.description || '').toLowerCase();

    // Detect category
    let category = '';
    for (const [cat, data] of Object.entries(CATEGORY_MAPPINGS)) {
        if (data.aliases.some(a => nameLower.includes(a))) { category = cat; break; }
    }
    if (!category) {
        for (const [cat, data] of Object.entries(CATEGORY_MAPPINGS)) {
            if (data.indicators.some(ind => descLower.includes(ind))) { category = cat; break; }
        }
    }

    // Detect size modifier
    let sizeModifier = '';
    if (descLower.includes('büyük beden') || descLower.includes('battal') || nameLower.includes('büyük beden')) {
        sizeModifier = 'büyük beden';
    } else if (descLower.includes('plus size') || nameLower.includes('plus size')) {
        sizeModifier = 'büyük beden';
    }

    // Detect materials
    const materials = [];
    for (const [mat, data] of Object.entries(MATERIAL_KEYWORDS)) {
        if ((descLower.includes(mat) || nameLower.includes(mat)) && data.searchTerms.length > 0) {
            materials.push(data.searchTerms[0]);
        }
    }

    // Detect features from name and description
    const features = [];
    for (const [feat, data] of Object.entries(FEATURE_KEYWORDS)) {
        if (descLower.includes(feat) || nameLower.includes(feat)) {
            features.push(data.searchTerms[0]);
        }
    }

    // Detect gender
    let gender = '';
    if (descLower.includes('kadın') || nameLower.includes('kadın')) gender = 'kadın';
    else if (descLower.includes('erkek') || nameLower.includes('erkek')) gender = 'erkek';

    // IMPORTANT: Never search bare category alone (e.g., "kazak" returns "kazakistan")
    // Always qualify with at least gender, size, or "modelleri"
    if (category) {
        // Most specific → least specific (all qualified!)
        if (sizeModifier && materials.length > 0) {
            queries.push(`${sizeModifier} ${materials[0]} ${category}`);
        }
        if (sizeModifier && features.length > 0) {
            queries.push(`${sizeModifier} ${features[0]} ${category}`);
        }
        if (sizeModifier) {
            queries.push(`${sizeModifier} ${category}`);
        }
        if (materials.length > 0) {
            queries.push(`${gender || 'kadın'} ${materials[0]} ${category}`);
        }
        if (features.length > 0) {
            queries.push(`${gender || 'kadın'} ${features[0]} ${category}`);
        }
        if (gender) {
            queries.push(`${gender} ${category}`);
            queries.push(`${gender} ${category} modelleri`);
        } else {
            // No gender detected, use "kadın" as default for fashion
            queries.push(`kadın ${category}`);
            queries.push(`kadın ${category} modelleri`);
        }
        // Category + modelleri (safer than bare category)
        queries.push(`${category} modelleri`);
    }

    // Deduplicate and limit
    const unique = [...new Set(queries.map(q => q.trim().toLowerCase()))];
    return unique.slice(0, 6);
}

// Filter irrelevant autocomplete suggestions (e.g., "kazakistan" for "kazak")
const IRRELEVANT_WORDS = [
    'kazakistan', 'başkenti', 'nüfusu', 'bayrağı', 'para birimi', 'ingilizce',
    'hava durumu', 'nerede', 'haritası', 'cumhurbaşkanı', 'dili', 'tarihi',
    'vikipedi', 'sözlük', 'ne demek', 'çeviri', 'nasıl yazılır',
    'futbol', 'maç', 'film', 'dizi', 'şarkı', 'oyun'
];

function isRelevantSuggestion(suggestion, category, productGender) {
    const lower = suggestion.toLowerCase();
    if (IRRELEVANT_WORDS.some(w => lower.includes(w))) return false;

    // Gender filter
    if (productGender === 'kadın' && lower.includes('erkek')) return false;
    if (productGender === 'erkek' && (lower.includes('kadın') || lower.includes('bayan'))) return false;

    // Non-product queries
    const NON_PRODUCT = ['yapımı', 'yapılışı', 'tarifi', 'nasıl yapılır', 'dikimi', 'dikimine',
        'örgü deseni', 'örme', 'nasıl', 'nedir', 'nerede', 'ne demek', 'tablosu', 'farkı',
        'anne', 'çocuk', 'bebek', 'markaları', 'markası'];
    if (NON_PRODUCT.some(w => lower.includes(w))) return false;

    // Brands
    const BRANDS = ['zara', 'h&m', 'lcw', 'lc waikiki', 'koton', 'mango', 'defacto', 'boyner', 'trendyol', 'hepsiburada'];
    if (BRANDS.some(w => lower.includes(w))) return false;

    // Cross-category filter: elbise sorgusunda pantolon çıkmasın
    if (category) {
        const catEntry = CATEGORY_MAPPINGS[category];
        const ownNames = catEntry ? [category, ...catEntry.aliases] : [category];
        for (const [otherCat, otherData] of Object.entries(CATEGORY_MAPPINGS)) {
            if (ownNames.includes(otherCat)) continue;
            const otherNames = [otherCat, ...otherData.aliases];
            for (const nm of otherNames) {
                if (nm.length < 4 || ownNames.includes(nm)) continue;
                if (lower.includes(nm)) return false;
            }
        }
    }

    // Generic suffix filter
    if (category && lower.startsWith(category) && !lower.includes('model') && !lower.includes('kadın') &&
        !lower.includes('erkek') && !lower.includes('beden') && !lower.includes('giy') &&
        !lower.includes('kumaş') && !lower.includes('fiyat') && !lower.includes('indirim') &&
        !lower.includes('online') && !lower.includes('trend') && !lower.includes('stil') &&
        !lower.includes('kış') && !lower.includes('yaz') && !lower.includes('yazlık') &&
        !lower.includes('renk') && !lower.includes('triko') && !lower.includes('viskon') &&
        !lower.includes('pamuk') && !lower.includes('kapüşon') && !lower.includes('fermu') &&
        !lower.includes('düğme') && !lower.includes('uzun') && !lower.includes('kısa')) {
        const after = lower.replace(category, '').trim();
        if (after.length > 0 && after.split(' ').length <= 2) return false;
    }
    return true;
}

// Run long-tail keyword research for a single product
async function researchLongTailKeywords(product, analysisResult, progressCallback) {
    const queries = generateLongTailQueries(product, analysisResult);
    const longTailResults = [];

    // Detect category and gender for filtering
    const nameLower = (product.name || '').toLowerCase();
    const descLower = (product.description || '').toLowerCase();
    let category = '';
    for (const [cat, data] of Object.entries(CATEGORY_MAPPINGS)) {
        if (data.aliases.some(a => nameLower.includes(a))) { category = cat; break; }
    }

    // Detect gender
    let productGender = '';
    if (nameLower.includes('kadın') || descLower.includes('kadın') || nameLower.includes('bayan') || descLower.includes('bayan')) {
        productGender = 'kadın';
    } else if (nameLower.includes('erkek') || descLower.includes('erkek')) {
        productGender = 'erkek';
    }

    for (let i = 0; i < queries.length; i++) {
        const query = queries[i];
        try {
            const suggestions = await googleAutocomplete(query);
            // Filter with gender awareness
            const filtered = suggestions.filter(s => isRelevantSuggestion(s, category, productGender));
            if (filtered.length > 0) {
                longTailResults.push({
                    query,
                    suggestions: filtered.slice(0, 8),
                    covered: filtered.filter(s =>
                        s.split(' ').every(word =>
                            word.length < 3 || product.name.toLowerCase().includes(word)
                        )
                    ),
                    missing: filtered.filter(s =>
                        !s.split(' ').every(word =>
                            word.length < 3 || product.name.toLowerCase().includes(word)
                        )
                    )
                });
            }
        } catch (e) { /* skip on error */ }
        await delay(80); // Rate limiting
    }

    return longTailResults;
}

// Run long-tail research for ALL products (with progress callback)
async function researchAllProducts(products, analysisResults, progressCallback) {
    const total = analysisResults.length;

    // Step 1: Collect all unique keywords
    const allKeywordsToCheck = new Set();
    analysisResults.forEach(r => {
        r.keywordDetails.forEach(kd => {
            if (kd.keyword) allKeywordsToCheck.add(kd.keyword.toLowerCase());
        });
    });

    const keywordsArray = [...allKeywordsToCheck];
    const keywordPopularity = {};
    let dataSource = 'google_autocomplete';

    // Step 2: Try DataForSEO API first
    const apiAvailable = await checkKeywordApi();

    if (apiAvailable) {
        dataSource = 'dataforseo';
        try {
            const volumeData = await fetchKeywordVolumes(keywordsArray);
            if (volumeData) {
                for (const kw of keywordsArray) {
                    const vol = volumeData[kw] || {};
                    keywordPopularity[kw] = {
                        monthlyVolume: vol.avgMonthlySearches || 0,
                        competition: vol.competition || 'UNSPECIFIED',
                        competitionIndex: vol.competitionIndex || 0,
                        cpc: vol.cpc || 0,
                        lowTopOfPageBid: vol.lowTopOfPageBid || 0,
                        highTopOfPageBid: vol.highTopOfPageBid || 0,
                        isGooglePopular: (vol.avgMonthlySearches || 0) > 0,
                        trend: vol.monthlySearchVolumes || [],
                        dataSource: 'dataforseo'
                    };
                }
            }
        } catch (e) {
            console.warn('DataForSEO failed, falling back to Autocomplete:', e);
            dataSource = 'google_autocomplete';
        }
    }

    // Step 2b: Fallback to Google Autocomplete
    if (dataSource === 'google_autocomplete') {
        for (let i = 0; i < keywordsArray.length; i++) {
            if (progressCallback && progressCallback(0, 0)) break; // check cancel
            const kw = keywordsArray[i];
            try {
                const suggestions = await googleAutocomplete(kw);
                const rank = suggestions.findIndex(s => s.toLowerCase().includes(kw)) + 1;
                keywordPopularity[kw] = {
                    googleRank: rank > 0 ? rank : 0,
                    googleSuggestionCount: suggestions.length,
                    isGooglePopular: suggestions.length > 0,
                    googleSuggestions: suggestions.slice(0, 5),
                    dataSource: 'autocomplete'
                };
            } catch (e) {
                keywordPopularity[kw] = { googleRank: 0, googleSuggestionCount: 0, isGooglePopular: false, googleSuggestions: [], dataSource: 'autocomplete' };
            }
            await delay(50);
        }
    }

    // Step 3: Inject data into keyword details
    analysisResults.forEach(r => {
        r.keywordDataSource = dataSource;
        r.keywordDetails.forEach(kd => {
            const pop = keywordPopularity[kd.keyword?.toLowerCase()];
            if (pop) {
                Object.assign(kd, pop);
            }
        });
    });

    // Step 4: Long-tail research per product
    for (let i = 0; i < total; i++) {
        const cancelled = progressCallback ? progressCallback(i + 1, total) : false;
        if (cancelled) break;
        const longTail = await researchLongTailKeywords(products[i], analysisResults[i]);
        analysisResults[i].longTailKeywords = longTail;

        const allLongTailSuggestions = longTail.flatMap(lt => lt.suggestions);
        const uniqueSuggestions = [...new Set(allLongTailSuggestions)].slice(0, 5);
        if (uniqueSuggestions.length > 0) {
            analysisResults[i].googleSuggestions = uniqueSuggestions;
        }
    }

    // Step 5: Fetch volumes for long-tail suggestions via Keyword Planner API
    if (apiAvailable) {
        const allLongTailKws = new Set();
        analysisResults.forEach(r => {
            if (r.longTailKeywords) {
                r.longTailKeywords.forEach(lt => {
                    lt.suggestions.forEach(s => allLongTailKws.add(s.toLowerCase()));
                });
            }
        });

        const ltKwArray = [...allLongTailKws];
        if (ltKwArray.length > 0) {
            try {
                // Batch in groups of 50
                const ltVolumes = {};
                for (let b = 0; b < ltKwArray.length; b += 50) {
                    const batch = ltKwArray.slice(b, b + 50);
                    const volData = await fetchKeywordVolumes(batch);
                    if (volData) Object.assign(ltVolumes, volData);
                }

                // Inject into long-tail results
                analysisResults.forEach(r => {
                    r.longTailVolumes = {}; // Store for UI access
                    if (r.longTailKeywords) {
                        r.longTailKeywords.forEach(lt => {
                            lt.suggestions.forEach(s => {
                                const vol = ltVolumes[s.toLowerCase()] || {};
                                r.longTailVolumes[s.toLowerCase()] = {
                                    monthlyVolume: vol.avgMonthlySearches || 0,
                                    competition: vol.competition || 'UNSPECIFIED',
                                    competitionIndex: vol.competitionIndex || 0,
                                    cpcLow: (vol.lowTopOfPageBidMicros || 0) / 1000000,
                                    cpcHigh: (vol.highTopOfPageBidMicros || 0) / 1000000
                                };
                            });
                        });
                    }
                });
            } catch (e) {
                console.warn('Long-tail volume fetch failed:', e);
            }
        }
    }

    // ==========================================
    // PHASE 3: Market-Driven Keyword Discovery
    // Use Google Autocomplete (FREE) to find related keywords,
    // then get real volumes from DataForSEO ($0.01/batch)
    // ==========================================
    if (apiAvailable && KEYWORD_API_URL) {
        // Step 1: Determine category for each product
        const categoryQueries = new Set();
        for (let i = 0; i < total; i++) {
            let cat = '';
            for (const [c, data] of Object.entries(CATEGORY_MAPPINGS)) {
                if (data.aliases.some(a => (products[i].name || '').toLowerCase().includes(a))) {
                    cat = c; break;
                }
            }
            if (!cat) {
                for (const [c, data] of Object.entries(CATEGORY_MAPPINGS)) {
                    if (data.aliases.some(a => (products[i].description || '').toLowerCase().includes(a))) {
                        cat = c; break;
                    }
                }
            }
            analysisResults[i]._category = cat;
            if (cat) {
                categoryQueries.add(cat);
                const descLow = (products[i].description || '').toLowerCase();
                if (descLow.includes('büyük beden') || descLow.includes('battal')) {
                    categoryQueries.add('büyük beden ' + cat);
                }
                const gender = descLow.includes('kadın') ? 'kadın' : descLow.includes('erkek') ? 'erkek' : '';
                if (gender) categoryQueries.add(gender + ' ' + cat);
            }
        }

        // Step 2: Use Google Autocomplete (FREE) to discover related keywords
        const uniqueCatQueries = [...categoryQueries];
        const allDiscoveredKeywords = new Set();
        const autocompleteByCat = {};

        try {
            const allAcQueries = [];
            for (const cat of uniqueCatQueries) {
                allAcQueries.push(cat);
                const prefixes = ['en iyi', 'ucuz', 'online', 'kadın', 'erkek', 'büyük beden'];
                for (const p of prefixes) {
                    if (!cat.includes(p.split(' ')[0])) {
                        allAcQueries.push(`${p} ${cat}`);
                    }
                }
            }
            const uniqueAcQueries = [...new Set(allAcQueries)];
            const acResults = await batchAutocomplete(uniqueAcQueries, () => {});

            for (const cat of uniqueCatQueries) {
                autocompleteByCat[cat] = [];
            }
            for (const [query, suggestions] of Object.entries(acResults)) {
                for (const cat of uniqueCatQueries) {
                    if (query.includes(cat) || cat.includes(query.split(' ').pop())) {
                        if (!autocompleteByCat[cat]) autocompleteByCat[cat] = [];
                        autocompleteByCat[cat].push(...suggestions);
                    }
                }
                suggestions.forEach(s => allDiscoveredKeywords.add(s.toLowerCase()));
            }
        } catch (e) {
            console.warn('Autocomplete discovery phase failed:', e);
        }

        // Step 3: Get real search volumes for discovered keywords
        const discoveredArray = [...allDiscoveredKeywords].slice(0, 500);
        let discoveredVolumes = {};
        if (discoveredArray.length > 0) {
            try {
                discoveredVolumes = await fetchKeywordVolumes(discoveredArray) || {};
            } catch (e) {
                console.warn('Volume fetch for discovered keywords failed:', e);
            }
        }

        // Step 4: Distribute enriched keyword ideas to each product
        for (let i = 0; i < total; i++) {
            const cat = analysisResults[i]._category;
            if (!cat) continue;

            const nameLow = (products[i].name || '').toLowerCase();
            const suggestions = autocompleteByCat[cat] || [];
            const seen = new Set();
            const enrichedIdeas = [];

            for (const suggestion of suggestions) {
                const kw = suggestion.toLowerCase();
                if (seen.has(kw)) continue;
                seen.add(kw);

                const volData = discoveredVolumes[kw] || {};
                const words = kw.split(' ').filter(w => w.length >= 3);
                const inTitle = words.length > 0 && words.every(w => nameLow.includes(w));

                enrichedIdeas.push({
                    keyword: suggestion,
                    searchVolume: volData.avgMonthlySearches || 0,
                    competition: volData.competition || 'UNSPECIFIED',
                    competitionIndex: volData.competitionIndex || 0,
                    cpc: volData.cpc || 0,
                    inTitle,
                    relevance: kw.includes(cat) ? 'high' : 'medium'
                });
            }

            enrichedIdeas.sort((a, b) => {
                if (a.inTitle !== b.inTitle) return a.inTitle ? 1 : -1;
                return b.searchVolume - a.searchVolume;
            });

            analysisResults[i].relatedKeywords = enrichedIdeas.slice(0, 30);
            analysisResults[i].missingPopularKeywords = enrichedIdeas
                .filter(k => !k.inTitle && k.searchVolume > 0)
                .slice(0, 20);
        }
    }

    // ==========================================
    // PHASE 4: SERP Competitor Analysis
    // See who ranks for similar search queries
    // ==========================================
    if (apiAvailable && KEYWORD_API_URL) {
        const serpQueries = new Set();
        for (let i = 0; i < total; i++) {
            const cat = analysisResults[i]._category;
            if (cat) serpQueries.add(cat);
        }

        const serpResultsMap = {};
        const uniqueSerpQueries = [...serpQueries].slice(0, 5);

        try {
            for (const q of uniqueSerpQueries) {
                try {
                    const resp = await fetch(KEYWORD_API_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'serp', query: q })
                    });
                    const data = await resp.json();
                    if (data.success && data.data) {
                        serpResultsMap[q] = data.data;
                    }
                } catch (e) {
                    console.warn('SERP fetch failed for:', q, e);
                }
            }
        } catch (e) {
            console.warn('SERP phase failed:', e);
        }

        const competitorsByCategory = {};
        for (const [cat, serpData] of Object.entries(serpResultsMap)) {
            const stores = {};
            for (const result of (serpData.marketplaceResults || [])) {
                const storeName = extractStoreName(result.domain, result.url, result.title);
                if (!stores[storeName]) {
                    stores[storeName] = { name: storeName, domain: result.domain, count: 0, positions: [], titles: [] };
                }
                stores[storeName].count++;
                stores[storeName].positions.push(result.position);
                stores[storeName].titles.push(result.title);
            }
            competitorsByCategory[cat] = Object.values(stores)
                .sort((a, b) => a.positions[0] - b.positions[0])
                .slice(0, 10);
        }

        for (let i = 0; i < total; i++) {
            const cat = analysisResults[i]._category;
            if (cat && serpResultsMap[cat]) {
                analysisResults[i].serpResults = serpResultsMap[cat];
                analysisResults[i].competitors = competitorsByCategory[cat] || [];

                const competitorTitles = (serpResultsMap[cat].marketplaceResults || []).map(r => r.title.toLowerCase());
                const competitorKeywords = {};
                for (const title of competitorTitles) {
                    const words = title.split(/[\s,;.!?()\/\[\]]+/).filter(w => w.length >= 3);
                    for (const word of words) {
                        if (!competitorKeywords[word]) competitorKeywords[word] = 0;
                        competitorKeywords[word]++;
                    }
                }
                const userWords = new Set((products[i].name || '').toLowerCase().split(/[\s,;.!?()\/\[\]]+/));
                const missingFromCompetitors = Object.entries(competitorKeywords)
                    .filter(([word, count]) => count >= 2 && !userWords.has(word) && !isStopWord(word))
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 10)
                    .map(([word, count]) => ({ word, usedByCount: count, totalCompetitors: competitorTitles.length }));

                analysisResults[i].competitorKeywordGaps = missingFromCompetitors;
            }
            delete analysisResults[i]._category;
        }
    }

    return analysisResults;
}

// Helper: extract store name from marketplace URL/title
function extractStoreName(domain, url, title) {
    if (domain.includes('trendyol')) {
        const match = url.match(/\/sr\?mid=([^&]+)/) || url.match(/\/magaza\/([^?/]+)/);
        if (match) return match[1].replace(/-/g, ' ');
        const brandMatch = title.match(/^([^-–]+)/);
        if (brandMatch) return brandMatch[1].trim();
        return 'Trendyol Mağaza';
    }
    if (domain.includes('hepsiburada')) {
        const match = url.match(/\/magaza\/([^?/]+)/);
        if (match) return match[1].replace(/-/g, ' ');
        return 'Hepsiburada Mağaza';
    }
    if (domain.includes('n11')) return 'N11 Mağaza';
    return domain.replace(/^www\./, '').replace(/\.com\.tr$|\.com$/, '');
}

function isStopWord(word) {
    const stops = new Set([
        've', 'ile', 'için', 'bir', 'bu', 'da', 'de', 'den', 'dan', 'çok',
        'var', 'yok', 'olan', 'gibi', 'kadar', 'her', 'daha', 'çok', 'en',
        'tüm', 'tum', 'ise', 'veya', 'ya', 'hem', 'ama', 'fakat', 'sadece',
        'adet', 'stok', 'yeni', 'özel', 'indirim', 'fırsat', 'kampanya',
        'the', 'and', 'for', 'with', 'new', 'top', 'best'
    ]);
    return stops.has(word);
}
