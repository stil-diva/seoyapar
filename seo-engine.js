// ===== SEO Analysis Engine v2.0 =====
// Professional e-commerce SEO engine with real market data
// Based on Google Keyword Planner, Trendyol, Hepsiburada & N11 search patterns

// ===== KEYWORD DATABASE WITH MONTHLY SEARCH VOLUMES =====

// Material keywords - what people ACTUALLY search
// Each material maps to the search terms customers use + monthly volume
const MATERIAL_KEYWORDS = {
    'viskon': {
        searchTerms: ['viskon'],  // viskon IS the search term itself
        monthlyVolume: 8100,
        note: 'Viskon kumaş adı olarak aranır, "yumuşak kumaş" olarak DEĞİL'
    },
    'viskoz': {
        searchTerms: ['viskon'],
        monthlyVolume: 8100,
        note: 'Viskoz = Viskon, aynı kumaş'
    },
    'keten': {
        searchTerms: ['keten'],
        monthlyVolume: 18100,
        note: 'Keten tek başına güçlü arama terimi'
    },
    'linen': {
        searchTerms: ['keten'],
        monthlyVolume: 18100,
        note: 'Linen = Keten'
    },
    'pamuk': {
        searchTerms: ['pamuklu', '%100 pamuk'],
        monthlyVolume: 12100,
        note: 'Müşteriler "pamuklu" veya "%100 pamuk" olarak arar'
    },
    'pamuklu': {
        searchTerms: ['pamuklu'],
        monthlyVolume: 12100,
        note: 'Zaten doğru terim'
    },
    'cotton': {
        searchTerms: ['pamuklu'],
        monthlyVolume: 12100,
        note: 'Cotton = Pamuklu'
    },
    'elastan': {
        searchTerms: ['esnek', 'streç', 'likralı'],
        monthlyVolume: 6600,
        note: 'Elastan teknik terim, müşteriler "esnek", "streç" veya "likralı" arar'
    },
    'likra': {
        searchTerms: ['likralı', 'esnek', 'streç'],
        monthlyVolume: 5400,
        note: 'Likralı kumaş özelliği olarak aranır'
    },
    'spandex': {
        searchTerms: ['esnek', 'streç'],
        monthlyVolume: 4400,
        note: 'Spandex = Elastan, müşteri "esnek" arar'
    },
    'polyester': {
        searchTerms: [],  // Polyester müşteri için eksi özellik, arama terimi DEĞİL
        monthlyVolume: 0,
        note: 'Polyester müşterilerin aradığı bir özellik değil. Başlığa eklemeye GEREK YOK.'
    },
    'denim': {
        searchTerms: ['denim', 'kot'],
        monthlyVolume: 33100,
        note: 'Denim ve kot çok güçlü arama terimleri'
    },
    'saten': {
        searchTerms: ['saten'],
        monthlyVolume: 8100,
        note: 'Saten kendi başına güçlü arama terimi'
    },
    'şifon': {
        searchTerms: ['şifon'],
        monthlyVolume: 6600,
        note: 'Şifon kendi başına güçlü arama terimi'
    },
    'kadife': {
        searchTerms: ['kadife'],
        monthlyVolume: 6600,
        note: 'Kadife kendi başına güçlü arama terimi'
    },
    'triko': {
        searchTerms: ['triko', 'örgü'],
        monthlyVolume: 9900,
        note: 'Triko ve örgü güçlü arama terimleri'
    },
    'krep': {
        searchTerms: ['krep'],
        monthlyVolume: 5400,
        note: 'Krep kumaş olarak aranır'
    },
    'kaşmir': {
        searchTerms: ['kaşmir'],
        monthlyVolume: 4400,
        note: 'Kaşmir premium arama terimi'
    },
    'ipek': {
        searchTerms: ['ipek'],
        monthlyVolume: 6600,
        note: 'İpek kendi başına güçlü arama terimi'
    },
    'polar': {
        searchTerms: ['polar', 'içi tüylü'],
        monthlyVolume: 9900,
        note: 'Polar ve içi tüylü kışlık aramalarda güçlü'
    },
    'fleece': {
        searchTerms: ['polar'],
        monthlyVolume: 9900,
        note: 'Fleece = Polar'
    },
    'tül': {
        searchTerms: ['tül'],
        monthlyVolume: 4400,
        note: 'Tül kumaş olarak aranır'
    },
    'dantel': {
        searchTerms: ['dantelli', 'dantel'],
        monthlyVolume: 5400,
        note: 'Dantelli güçlü dekoratif arama terimi'
    },
    'neopren': {
        searchTerms: ['neopren', 'scuba'],
        monthlyVolume: 2400,
        note: 'Neopren/scuba niş arama terimi'
    },
    'scuba': {
        searchTerms: ['scuba'],
        monthlyVolume: 2400,
        note: 'Scuba kumaş olarak aranır'
    },
    'astar': {
        searchTerms: ['astarlı'],
        monthlyVolume: 1900,
        note: 'Astarlı kalite göstergesi olarak aranır'
    },
    'astarlı': {
        searchTerms: ['astarlı'],
        monthlyVolume: 1900,
        note: 'Astarlı zaten doğru terim'
    }
};

// Feature keywords with real search volumes
const FEATURE_KEYWORDS = {
    'büyük beden': { searchTerms: ['büyük beden'], monthlyVolume: 90500, priority: 'critical' },
    'battal': { searchTerms: ['büyük beden', 'battal beden'], monthlyVolume: 14800, priority: 'critical' },
    'plus size': { searchTerms: ['büyük beden', 'plus size'], monthlyVolume: 9900, priority: 'critical' },
    'oversize': { searchTerms: ['oversize'], monthlyVolume: 22200, priority: 'high' },
    'slim fit': { searchTerms: ['slim fit'], monthlyVolume: 14800, priority: 'high' },
    'kapüşonlu': { searchTerms: ['kapüşonlu'], monthlyVolume: 8100, priority: 'high' },
    'yüksek bel': { searchTerms: ['yüksek bel'], monthlyVolume: 9900, priority: 'high' },
    'palazzo': { searchTerms: ['palazzo'], monthlyVolume: 14800, priority: 'high' },
    'ispanyol paça': { searchTerms: ['ispanyol paça'], monthlyVolume: 8100, priority: 'high' },
    'jogger': { searchTerms: ['jogger'], monthlyVolume: 12100, priority: 'high' },
    'beli lastikli': { searchTerms: ['beli lastikli'], monthlyVolume: 6600, priority: 'medium' },
    'fermuarlı': { searchTerms: ['fermuarlı'], monthlyVolume: 3600, priority: 'medium' },
    'düğmeli': { searchTerms: ['düğmeli'], monthlyVolume: 2900, priority: 'medium' },
    'cepli': { searchTerms: ['cepli'], monthlyVolume: 4400, priority: 'medium' },
    'boyfriend': { searchTerms: ['boyfriend'], monthlyVolume: 5400, priority: 'medium' },
    'mom fit': { searchTerms: ['mom fit', 'mom jean'], monthlyVolume: 6600, priority: 'medium' },
    'bol paça': { searchTerms: ['bol paça'], monthlyVolume: 4400, priority: 'medium' },
    'skinny': { searchTerms: ['skinny'], monthlyVolume: 4400, priority: 'medium' },
    'regular fit': { searchTerms: ['regular fit'], monthlyVolume: 2400, priority: 'low' },
    'v yaka': { searchTerms: ['v yaka'], monthlyVolume: 3600, priority: 'medium' },
    'bisiklet yaka': { searchTerms: ['bisiklet yaka'], monthlyVolume: 2400, priority: 'low' },
    'polo yaka': { searchTerms: ['polo yaka'], monthlyVolume: 3600, priority: 'medium' },
    'balıkçı yaka': { searchTerms: ['balıkçı yaka', 'boğazlı'], monthlyVolume: 5400, priority: 'medium' },
    'dik yaka': { searchTerms: ['dik yaka'], monthlyVolume: 1600, priority: 'low' },
    'uzun kol': { searchTerms: ['uzun kol'], monthlyVolume: 2900, priority: 'low' },
    'kısa kol': { searchTerms: ['kısa kol'], monthlyVolume: 2400, priority: 'low' },
    'kolsuz': { searchTerms: ['kolsuz'], monthlyVolume: 2400, priority: 'low' },
    'çizgili': { searchTerms: ['çizgili'], monthlyVolume: 3600, priority: 'medium' },
    'kareli': { searchTerms: ['kareli', 'ekose'], monthlyVolume: 3600, priority: 'medium' },
    'çiçekli': { searchTerms: ['çiçekli', 'çiçek desenli'], monthlyVolume: 4400, priority: 'medium' },
    'baskılı': { searchTerms: ['baskılı'], monthlyVolume: 3600, priority: 'medium' },
    'nakışlı': { searchTerms: ['nakışlı'], monthlyVolume: 2400, priority: 'low' },
    'yırtmaçlı': { searchTerms: ['yırtmaçlı'], monthlyVolume: 2900, priority: 'medium' },
    'pileli': { searchTerms: ['pileli'], monthlyVolume: 3600, priority: 'medium' },
    'fırfırlı': { searchTerms: ['fırfırlı', 'volanlı'], monthlyVolume: 2400, priority: 'low' },
    'yarasa kol': { searchTerms: ['yarasa kol'], monthlyVolume: 2400, priority: 'low' },
    'asimetrik': { searchTerms: ['asimetrik'], monthlyVolume: 1900, priority: 'low' },
    'taş işlemeli': { searchTerms: ['taşlı', 'taş işlemeli'], monthlyVolume: 2400, priority: 'low' },
    'payetli': { searchTerms: ['payetli'], monthlyVolume: 3600, priority: 'medium' },
    'su geçirmez': { searchTerms: ['su geçirmez'], monthlyVolume: 6600, priority: 'high' },
    'içi tüylü': { searchTerms: ['içi tüylü'], monthlyVolume: 5400, priority: 'medium' },
    'yazlık': { searchTerms: ['yazlık'], monthlyVolume: 14800, priority: 'high' },
    'kışlık': { searchTerms: ['kışlık'], monthlyVolume: 9900, priority: 'high' }
};

// Category detection with search volumes
const CATEGORY_MAPPINGS = {
    'tişört': {
        aliases: ['tshirt', 't-shirt', 'tişört', 'tisort', 't shirt'],
        searchTerms: ['tişört', 't-shirt'],
        monthlyVolume: 135000,
        indicators: ['yuvarlak yaka', 'bisiklet yaka', 'kısa kol', 'baskılı', 'basic', 'oversize tişört'],
        conflicts: ['düğmeli', 'gömlek yaka', 'fermuar']
    },
    'gömlek': {
        aliases: ['gömlek', 'gomlek', 'shirt'],
        searchTerms: ['gömlek'],
        monthlyVolume: 110000,
        indicators: ['düğmeli', 'gömlek yaka', 'manşet', 'kol düğmesi', 'gömlek kumaş'],
        conflicts: []
    },
    'bluz': {
        aliases: ['bluz', 'blouse'],
        searchTerms: ['bluz', 'kadın bluz'],
        monthlyVolume: 40500,
        indicators: ['dökümlü', 'şifon', 'v yaka', 'fırfır', 'volan', 'kadın'],
        conflicts: []
    },
    'tunik': {
        aliases: ['tunik', 'tunic'],
        searchTerms: ['tunik'],
        monthlyVolume: 33100,
        indicators: ['uzun', 'kalça altı', 'diz üstü', 'tunik boy'],
        conflicts: []
    },
    'elbise': {
        aliases: ['elbise', 'dress'],
        searchTerms: ['elbise'],
        monthlyVolume: 301000,
        indicators: ['diz altı', 'diz üstü', 'maxi', 'midi', 'mini', 'elbise'],
        conflicts: []
    },
    'pantolon': {
        aliases: ['pantolon', 'pants', 'trousers'],
        searchTerms: ['pantolon'],
        monthlyVolume: 165000,
        indicators: ['bel', 'paça', 'bacak', 'pantolon'],
        conflicts: []
    },
    'jean': {
        aliases: ['jean', 'kot', 'denim pantolon', 'kot pantolon', 'jeans'],
        searchTerms: ['kot pantolon', 'jean'],
        monthlyVolume: 33100,
        indicators: ['denim', 'kot', 'jean', 'indigo'],
        conflicts: []
    },
    'ceket': {
        aliases: ['ceket', 'jacket', 'blazer'],
        searchTerms: ['ceket', 'blazer'],
        monthlyVolume: 49500,
        indicators: ['astar', 'yaka', 'ceket', 'blazer', 'kaban'],
        conflicts: []
    },
    'hırka': {
        aliases: ['hırka', 'hirka', 'cardigan'],
        searchTerms: ['hırka'],
        monthlyVolume: 27100,
        indicators: ['önü açık', 'düğmeli', 'triko', 'örgü', 'hırka'],
        conflicts: []
    },
    'yelek': {
        aliases: ['yelek', 'vest'],
        searchTerms: ['yelek'],
        monthlyVolume: 22200,
        indicators: ['kolsuz', 'yelek', 'şişme yelek'],
        conflicts: []
    },
    'eşofman': {
        aliases: ['eşofman', 'esofman', 'jogger', 'sweatpant'],
        searchTerms: ['eşofman', 'eşofman takım'],
        monthlyVolume: 60500,
        indicators: ['eşofman', 'jogger', 'paçası lastikli', 'spor'],
        conflicts: []
    },
    'sweatshirt': {
        aliases: ['sweatshirt', 'sweat', 'sweetshirt'],
        searchTerms: ['sweatshirt'],
        monthlyVolume: 49500,
        indicators: ['sweat', 'kapüşon', 'polar', 'içi tüylü'],
        conflicts: []
    },
    'mont': {
        aliases: ['mont', 'kaban', 'coat', 'parka'],
        searchTerms: ['mont', 'kaban'],
        monthlyVolume: 74000,
        indicators: ['mont', 'kaban', 'şişme', 'kaz tüyü', 'su geçirmez'],
        conflicts: []
    },
    'etek': {
        aliases: ['etek', 'skirt'],
        searchTerms: ['etek'],
        monthlyVolume: 27100,
        indicators: ['etek', 'pileli', 'mini etek', 'midi etek'],
        conflicts: []
    },
    'şort': {
        aliases: ['şort', 'sort', 'shorts'],
        searchTerms: ['şort'],
        monthlyVolume: 22200,
        indicators: ['şort', 'kısa', 'diz üstü'],
        conflicts: []
    },
    'takım': {
        aliases: ['takım', 'set', 'kombin'],
        searchTerms: ['takım', 'ikili takım'],
        monthlyVolume: 14800,
        indicators: ['takım', 'set', 'üst alt', 'ikili'],
        conflicts: []
    },
    'kazak': {
        aliases: ['kazak', 'sweater'],
        searchTerms: ['kazak'],
        monthlyVolume: 60500,
        indicators: ['kazak', 'triko', 'örgü', 'yün'],
        conflicts: []
    }
};

// Color keywords with search relevance
const COLORS = ['siyah', 'beyaz', 'kırmızı', 'mavi', 'yeşil', 'sarı', 'turuncu', 'mor', 'pembe', 'gri', 'lacivert', 'bej', 'kahverengi', 'bordo', 'haki', 'ekru', 'krem', 'lila', 'fuşya', 'turkuaz', 'indigo', 'antrasit', 'nude', 'pudra', 'mint', 'hardal', 'kiremit', 'mürdüm', 'petrol'];

// Ideal title length range
const TITLE_LENGTH = { min: 40, ideal_min: 50, ideal_max: 80, max: 120 };

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
            text: `Başlık çok uzun (${len} karakter). Trendyol ve Hepsiburada ${TITLE_LENGTH.max} karakterden sonra keser. İdeal: ${TITLE_LENGTH.ideal_min}-${TITLE_LENGTH.ideal_max} karakter.`
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
                    monthlyVolume: data.monthlyVolume,
                    text: `"${material}" açıklamada var, başlıkta "${topTerm}" olmalı`
                });
                results.missingKeywords.push(topTerm);
                missedVolumeTotal += data.monthlyVolume;

                results.keywordDetails.push({
                    keyword: topTerm, type: 'material', status: 'missing',
                    monthlyVolume: data.monthlyVolume,
                    source: material,
                    note: data.note
                });

                results.suggestions.push({
                    type: 'critical',
                    text: `Açıklamada <strong>"${material}"</strong> var. Müşteriler <strong>"${topTerm}"</strong> olarak arar. <span class="volume-badge">🔍 ${data.monthlyVolume.toLocaleString('tr-TR')}/ay</span>`
                });
            } else {
                const matchedTerm = hasMaterial ? material : data.searchTerms.find(t => nameLower.includes(t.toLowerCase()));
                results.presentKeywords.push(matchedTerm || material);
                currentVolumeTotal += data.monthlyVolume;
                results.keywordDetails.push({
                    keyword: matchedTerm || material, type: 'material', status: 'present',
                    monthlyVolume: data.monthlyVolume,
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
                missedVolumeTotal += data.monthlyVolume;

                results.keywordDetails.push({
                    keyword: data.searchTerms[0], type: 'feature', status: 'missing',
                    monthlyVolume: data.monthlyVolume,
                    priority: data.priority
                });

                const priorityLabel = data.priority === 'critical' ? 'KRİTİK' : data.priority === 'high' ? 'YÜKSEK' : 'ORTA';
                const suggestionType = data.priority === 'critical' ? 'critical' : data.priority === 'high' ? 'critical' : 'warning';

                results.suggestions.push({
                    type: suggestionType,
                    text: `<strong>"${data.searchTerms[0]}"</strong> açıklamada var, başlıkta yok. <span class="volume-badge">🔍 ${data.monthlyVolume.toLocaleString('tr-TR')}/ay</span> <span class="priority-badge priority-${data.priority}">${priorityLabel}</span>`
                });
            } else {
                results.presentKeywords.push(feature);
                currentVolumeTotal += data.monthlyVolume;
                results.keywordDetails.push({
                    keyword: feature, type: 'feature', status: 'present',
                    monthlyVolume: data.monthlyVolume,
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
                monthlyVolume: topDetected.data.monthlyVolume,
                text: `Başlıkta "${nameCat}" var ama içerik "${topDetected.category}" kategorisine uygun`
            });
            results.suggestions.push({
                type: 'critical',
                text: `Kategori uyumsuzluğu: <strong>"${nameCat}"</strong> yerine <strong>"${topDetected.category}"</strong> daha doğru. <span class="volume-badge">🔍 "${topDetected.data.searchTerms[0]}" ${topDetected.data.monthlyVolume.toLocaleString('tr-TR')}/ay</span>`
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
                text: `Başlıkta kategori yok. Açıklamaya göre <strong>"${suggested.data.searchTerms[0]}"</strong> eklenmeli. <span class="volume-badge">🔍 ${suggested.data.monthlyVolume.toLocaleString('tr-TR')}/ay</span>`
            });
        }
    }

    // Add category volume to current reach if present
    if (nameCategory) {
        currentVolumeTotal += CATEGORY_MAPPINGS[nameCategory[0]].monthlyVolume;
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

// ===== SUGGESTED NAME GENERATOR =====
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

    // Sort missing keywords by volume (highest first)
    const sortedMissing = analysis.keywordDetails
        .filter(k => k.status === 'missing')
        .sort((a, b) => b.monthlyVolume - a.monthlyVolume);

    // Add top 3 missing keywords by volume
    let added = 0;
    for (const kw of sortedMissing) {
        if (added >= 3) break;
        const term = kw.keyword;
        if (!base.toLowerCase().includes(term.toLowerCase())) {
            additions.push(term.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
            added++;
        }
    }

    if (additions.length > 0) {
        return base + ' ' + additions.join(' ');
    }
    return base;
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

    // Reach stats
    const totalCurrentReach = results.reduce((s, r) => s + r.currentReach, 0);
    const totalPotentialReach = results.reduce((s, r) => s + r.potentialReach, 0);
    const totalMissedVolume = results.reduce((s, r) => s + r.missedVolume, 0);

    // Top missed keywords with volumes
    const missedKeywordVolumes = {};
    results.forEach(r => {
        r.keywordDetails.filter(k => k.status === 'missing').forEach(k => {
            if (!missedKeywordVolumes[k.keyword]) {
                missedKeywordVolumes[k.keyword] = { count: 0, volume: k.monthlyVolume };
            }
            missedKeywordVolumes[k.keyword].count++;
        });
    });
    const topMissedWithVolume = Object.entries(missedKeywordVolumes)
        .map(([kw, d]) => ({ keyword: kw, count: d.count, volume: d.volume, totalImpact: d.count * d.volume }))
        .sort((a, b) => b.totalImpact - a.totalImpact)
        .slice(0, 15);

    return {
        totalProducts, avgScore, criticalCount, warningCount, goodCount,
        topMissing, totalMissing, totalMaterialIssues, titleLengthIssues,
        totalCurrentReach, totalPotentialReach, totalMissedVolume,
        topMissedWithVolume
    };
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
    if (descLower.includes('büyük beden') || descLower.includes('battal') || descLower.includes('plus size')) {
        sizeModifier = 'büyük beden';
    }

    // Detect materials
    const materials = [];
    for (const [mat, data] of Object.entries(MATERIAL_KEYWORDS)) {
        if (descLower.includes(mat) && data.searchTerms.length > 0) {
            materials.push(data.searchTerms[0]);
        }
    }

    // Detect features
    const features = [];
    for (const [feat, data] of Object.entries(FEATURE_KEYWORDS)) {
        if (descLower.includes(feat) && data.monthlyVolume >= 3000) {
            features.push(data.searchTerms[0]);
        }
    }

    // Detect gender
    let gender = '';
    if (descLower.includes('kadın') || nameLower.includes('kadın')) gender = 'kadın';
    else if (descLower.includes('erkek') || nameLower.includes('erkek')) gender = 'erkek';

    // Generate combos (most specific → least specific)
    if (category) {
        // [gender] + [size] + [material] + [feature] + category
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
            queries.push(`${materials[0]} ${category}`);
        }
        if (features.length > 0) {
            queries.push(`${features[0]} ${category}`);
        }
        if (gender) {
            queries.push(`${gender} ${category}`);
        }
        // Category alone
        queries.push(category);
    }

    // Deduplicate and limit
    const unique = [...new Set(queries.map(q => q.trim().toLowerCase()))];
    return unique.slice(0, 6);
}

// Run long-tail keyword research for a single product
async function researchLongTailKeywords(product, analysisResult, progressCallback) {
    const queries = generateLongTailQueries(product, analysisResult);
    const longTailResults = [];

    for (let i = 0; i < queries.length; i++) {
        const query = queries[i];
        try {
            const suggestions = await googleAutocomplete(query);
            if (suggestions.length > 0) {
                longTailResults.push({
                    query,
                    suggestions: suggestions.slice(0, 8),
                    // Check which suggestions are covered by the title
                    covered: suggestions.filter(s =>
                        s.split(' ').every(word =>
                            word.length < 3 || product.name.toLowerCase().includes(word)
                        )
                    ),
                    missing: suggestions.filter(s =>
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
    for (let i = 0; i < total; i++) {
        if (progressCallback) progressCallback(i + 1, total);
        const longTail = await researchLongTailKeywords(products[i], analysisResults[i]);
        analysisResults[i].longTailKeywords = longTail;

        // Add best long-tail suggestions to the suggestions list
        const allLongTailSuggestions = longTail.flatMap(lt => lt.suggestions);
        const uniqueSuggestions = [...new Set(allLongTailSuggestions)].slice(0, 5);
        if (uniqueSuggestions.length > 0) {
            analysisResults[i].googleSuggestions = uniqueSuggestions;
        }
    }
    return analysisResults;
}
