// ===== DOM Elements =====
const $ = id => document.getElementById(id);
const uploadSection = $('uploadSection');
const mappingSection = $('mappingSection');
const resultsSection = $('resultsSection');
const uploadZone = $('uploadZone');
const fileInput = $('fileInput');
const headerStats = $('headerStats');
const loadingOverlay = $('loadingOverlay');
const modalOverlay = $('modalOverlay');

let rawData = [];
let headers = [];
let analysisResults = [];
let _cancelAnalysis = false;

// ===== API Settings Modal =====
const apiModal = $('apiSettingsModal');

function updateToggleUI(enabled) {
    const knob = $('apiToggleKnob');
    const label = $('apiToggleLabel');
    const track = knob.previousElementSibling;
    if (enabled) {
        knob.style.left = '22px';
        track.style.background = 'var(--accent-green)';
        label.textContent = 'DataForSEO Aktif';
        label.style.color = 'var(--accent-green)';
    } else {
        knob.style.left = '2px';
        track.style.background = 'var(--border)';
        label.textContent = 'DataForSEO Kapalı';
        label.style.color = 'var(--text-muted)';
    }
}

$('apiSettingsBtn').addEventListener('click', () => {
    $('apiUrlInput').value = getKeywordApiUrl();
    $('apiToggle').checked = isKeywordApiEnabled();
    updateToggleUI(isKeywordApiEnabled());
    apiModal.style.display = 'flex';
    $('apiStatus').style.display = 'none';
});
$('closeApiSettings').addEventListener('click', () => { apiModal.style.display = 'none'; });
apiModal.addEventListener('click', e => { if (e.target === apiModal) apiModal.style.display = 'none'; });

$('apiToggle').addEventListener('change', function() {
    updateToggleUI(this.checked);
});

$('testApiBtn').addEventListener('click', async () => {
    const url = $('apiUrlInput').value.trim();
    const statusEl = $('apiStatus');
    if (!url) {
        statusEl.style.display = 'block';
        statusEl.style.background = 'rgba(239,68,68,0.15)';
        statusEl.style.color = '#ef4444';
        statusEl.textContent = '❌ URL giriniz';
        return;
    }
    statusEl.style.display = 'block';
    statusEl.style.background = 'rgba(232,116,12,0.15)';
    statusEl.style.color = 'var(--accent-yellow)';
    statusEl.textContent = '⏳ Test ediliyor...';

    try {
        const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'health' })
        });
        const data = await resp.json();
        if (data.status === 'ok' && data.hasCredentials) {
            const creditInfo = data.credits !== undefined && data.credits >= 0 ? ` (Bakiye: $${Number(data.credits).toFixed(2)})` : '';
            statusEl.style.background = 'rgba(16,185,129,0.15)';
            statusEl.style.color = '#10b981';
            statusEl.textContent = `✅ Bağlantı başarılı! DataForSEO hazır.${creditInfo}`;
        } else if (data.status === 'ok') {
            statusEl.style.background = 'rgba(232,116,12,0.15)';
            statusEl.style.color = 'var(--accent-yellow)';
            statusEl.textContent = '⚠️ Worker çalışıyor ama API credentials eksik.';
        } else {
            throw new Error('Bad response');
        }
    } catch (e) {
        statusEl.style.background = 'rgba(239,68,68,0.15)';
        statusEl.style.color = '#ef4444';
        statusEl.textContent = '❌ Bağlantı başarısız: ' + e.message;
    }
});

$('saveApiBtn').addEventListener('click', () => {
    const url = $('apiUrlInput').value.trim();
    const enabled = $('apiToggle').checked;
    setKeywordApiUrl(url);
    setKeywordApiEnabled(enabled);
    const statusEl = $('apiStatus');
    statusEl.style.display = 'block';
    statusEl.style.background = 'rgba(16,185,129,0.15)';
    statusEl.style.color = '#10b981';
    if (url && enabled) {
        statusEl.textContent = '💾 Kaydedildi! DataForSEO aktif — sonraki analizde kullanılacak.';
    } else if (url && !enabled) {
        statusEl.textContent = '💾 Kaydedildi! DataForSEO kapalı — ücretsiz mod aktif.';
    } else {
        statusEl.textContent = '💾 Kaydedildi! Ücretsiz Google Autocomplete modu aktif.';
    }
    setTimeout(() => { apiModal.style.display = 'none'; }, 1500);
});

// ===== File Upload Handling =====
uploadZone.addEventListener('click', () => fileInput.click());
uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
uploadZone.addEventListener('drop', e => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
});
fileInput.addEventListener('change', e => { if (e.target.files.length) handleFile(e.target.files[0]); });

function handleFile(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'xls', 'csv'].includes(ext)) {
        alert('Lütfen .xlsx, .xls veya .csv dosyası yükleyin.');
        return;
    }
    const reader = new FileReader();
    reader.onload = e => {
        try {
            const wb = XLSX.read(e.target.result, { type: 'array' });
            const ws = wb.Sheets[wb.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(ws, { header: 1 });
            if (json.length < 2) { alert('Excel dosyası boş veya sadece başlık satırı içeriyor.'); return; }
            headers = json[0].map(h => String(h || '').trim());
            rawData = json.slice(1).filter(row => row.some(cell => cell != null && String(cell).trim() !== ''));
            showMapping();
        } catch (err) {
            alert('Dosya okunurken hata oluştu: ' + err.message);
        }
    };
    reader.readAsArrayBuffer(file);
}

// ===== Column Mapping =====
function showMapping() {
    uploadSection.style.display = 'none';
    mappingSection.style.display = 'block';
    resultsSection.style.display = 'none';

    // Build preview table
    const previewRows = rawData.slice(0, 5);
    let tableHtml = '<table><thead><tr>';
    headers.forEach((h, i) => { tableHtml += `<th>${h || 'Sütun ' + (i + 1)}</th>`; });
    tableHtml += '</tr></thead><tbody>';
    previewRows.forEach(row => {
        tableHtml += '<tr>';
        headers.forEach((_, i) => {
            const val = row[i] != null ? String(row[i]).substring(0, 80) : '';
            tableHtml += `<td title="${String(row[i] || '')}">${val}</td>`;
        });
        tableHtml += '</tr>';
    });
    tableHtml += '</tbody></table>';
    $('mappingPreview').innerHTML = tableHtml;

    // Populate selects
    const selects = ['colName', 'colDescription', 'colImage', 'colCategory', 'colStock', 'colBrand'];
    const optionalSelects = ['colImage', 'colCategory', 'colStock', 'colBrand'];
    selects.forEach(selId => {
        const sel = $(selId);
        sel.innerHTML = '';
        if (optionalSelects.includes(selId)) {
            sel.innerHTML = '<option value="-1">-- Yok / Seçme --</option>';
        }
        headers.forEach((h, i) => {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = h || `Sütun ${i + 1}`;
            sel.appendChild(opt);
        });
    });

    // Auto-detect columns
    autoDetectColumns();
}

function autoDetectColumns() {
    const nameKeywords = ['ürün adı', 'ürün ad', 'product name', 'başlık', 'title', 'ad', 'isim', 'ürün_adı'];
    const descKeywords = ['açıklama', 'description', 'ürün açıklama', 'detay', 'içerik', 'product description', 'özellik'];
    const imgKeywords = ['görsel', 'resim', 'image', 'foto', 'url', 'img', 'picture', 'media'];
    const catKeywords = ['kategori', 'category', 'tür', 'tip', 'type', 'grup'];
    const stockKeywords = ['stok', 'stock', 'miktar', 'adet', 'envanter', 'inventory', 'quantity'];
    const brandKeywords = ['marka', 'brand', 'üretici', 'manufacturer'];

    headers.forEach((h, i) => {
        const hl = h.toLowerCase();
        if (nameKeywords.some(k => hl.includes(k))) $('colName').value = i;
        if (descKeywords.some(k => hl.includes(k))) $('colDescription').value = i;
        if (imgKeywords.some(k => hl.includes(k))) $('colImage').value = i;
        if (catKeywords.some(k => hl.includes(k))) $('colCategory').value = i;
        if (stockKeywords.some(k => hl.includes(k))) $('colStock').value = i;
        if (brandKeywords.some(k => hl.includes(k))) $('colBrand').value = i;
    });
}

$('backToUpload').addEventListener('click', () => {
    mappingSection.style.display = 'none';
    uploadSection.style.display = 'block';
    fileInput.value = '';
});

$('startAnalysis').addEventListener('click', runAnalysis);

// ===== Run Analysis =====
function runAnalysis() {
    const nameCol = parseInt($('colName').value);
    const descCol = parseInt($('colDescription').value);
    const imgCol = parseInt($('colImage').value);
    const catCol = parseInt($('colCategory').value);

    if (nameCol < 0 || descCol < 0) {
        alert('Lütfen Ürün Adı ve Ürün Açıklaması sütunlarını seçin.');
        return;
    }

    // SEO tips to rotate during loading
    const seoTips = [
        'Anahtar kelimeler başlığın başına yakın olmalı — Google ilk kelimelere daha çok önem verir.',
        'Trendyol\'da 80 karakterden uzun başlıklar kesilir. İdeal aralık: 50-80 karakter.',
        'Uzun kuyruklu anahtar kelimeler (3+ kelime) daha az rekabet, daha yüksek dönüşüm sağlar.',
        'Malzeme bilgisi (viskon, keten, pamuklu) başlıkta olmalı — müşteriler kumaş tipine göre arar.',
        '"Büyük beden" anahtar kelimesi aylık 90.500 aranıyor. Eğer ürününüz büyük bedense mutlaka ekleyin.',
        'Renk bilgisi başlıkta olmalı — "siyah elbise" araması "elbise" aramasından 3x daha yüksek dönüşüm sağlar.',
        'Google Autocomplete, gerçek kullanıcıların ne yazdığını gösterir — en güvenilir veri kaynağıdır.',
        'Hepsiburada\'da kategori kelimesi başlıkta yoksa ürün ilgili kategoride listelenmeyebilir.',
        'Ürün başlığında gereksiz kodlar (285057, SKU) kullanmayın — müşteri aramaz, karakter israfıdır.',
        '"Esnek pantolon" aylık 4.400, "streç pantolon" aylık 4.400 aranıyor — ikisi de değerli kelimeler.',
    ];

    loadingOverlay.style.display = 'flex';
    const elTitle = $('loadingTitle');
    const elStatus = $('loadingStatus');
    const elFill = $('loadingProgressFill');
    const elPercent = $('loadingPercent');
    const elElapsed = $('loadingElapsed');
    const elTip = document.getElementById('loadingTip');
    const step1 = $('step1'), step2 = $('step2'), step3 = $('step3');

    // Timer
    const startTime = Date.now();
    const timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const mins = Math.floor(elapsed / 60);
        const secs = elapsed % 60;
        elElapsed.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    }, 1000);

    // Tip rotation
    let tipIndex = 0;
    const tipInterval = setInterval(() => {
        tipIndex = (tipIndex + 1) % seoTips.length;
        const tipText = elTip.querySelector('.tip-text');
        elTip.style.animation = 'none';
        tipText.textContent = seoTips[tipIndex];
        requestAnimationFrame(() => { elTip.style.animation = 'tip-fade 0.5s ease'; });
    }, 6000);

    function setProgress(pct) {
        elFill.style.width = pct + '%';
        elPercent.textContent = Math.round(pct) + '%';
    }

    // Stock & Brand columns
    const stockCol = parseInt($('colStock').value);
    const brandCol = parseInt($('colBrand').value);

    // Cancel button handler
    _cancelAnalysis = false;
    const cancelBtn = $('cancelAnalysisBtn');
    cancelBtn.onclick = () => { _cancelAnalysis = true; };

    setTimeout(async () => {
        const products = rawData.map(row => ({
            name: String(row[nameCol] || '').trim(),
            description: String(row[descCol] || '').trim(),
            image: imgCol >= 0 ? String(row[imgCol] || '').trim() : '',
            category: catCol >= 0 ? String(row[catCol] || '').trim() : '',
            stock: stockCol >= 0 ? String(row[stockCol] || '').trim() : '',
            brand: brandCol >= 0 ? String(row[brandCol] || '').trim() : ''
        })).filter(p => p.name);

        // Step 1: Basic SEO analysis (10% of progress)
        step1.classList.add('active');
        elTitle.textContent = 'SEO Analizi Çalışıyor';
        elStatus.textContent = `${products.length} ürün analiz ediliyor...`;
        setProgress(5);

        await new Promise(r => setTimeout(r, 100)); // Let UI render
        analysisResults = products.map((p, i) => {
            const result = analyzeProduct(p);
            result.stock = p.stock;
            result.brand = p.brand;
            return result;
        });
        setProgress(15);
        step1.classList.remove('active');
        step1.classList.add('done');

        let wasCancelled = false;

        // Step 2: Google Autocomplete long-tail keyword research (15% → 85%)
        if (!_cancelAnalysis) {
            step2.classList.add('active');
            elTitle.textContent = 'Google Araştırması';
            elStatus.textContent = 'Uzun kuyruklu anahtar kelimeler araştırılıyor...';
            try {
                await researchAllProducts(products, analysisResults, (current, total) => {
                    const pct = 15 + (current / total) * 70;
                    setProgress(pct);
                    elStatus.textContent = `Google arama verileri: ${current}/${total} ürün`;
                    return _cancelAnalysis; // return true to signal cancellation
                });
            } catch (e) {
                console.warn('Google Autocomplete araması başarısız:', e);
            }
            step2.classList.remove('active');
            step2.classList.add('done');
        }

        if (_cancelAnalysis) {
            wasCancelled = true;
            _cancelAnalysis = false;
        }

        // Step 3: Report generation
        step3.classList.add('active');
        elTitle.textContent = wasCancelled ? 'Durduruldu — Kısmi Rapor' : 'Rapor Hazırlanıyor';
        elStatus.textContent = wasCancelled ? 'Mevcut sonuçlar derleniyor...' : 'Sonuçlar derleniyor...';
        setProgress(90);
        const stats = generateOverallStats(analysisResults);
        setProgress(100);
        elStatus.textContent = wasCancelled ? 'Kısmi rapor hazır!' : 'Tamamlandı!';

        clearInterval(timerInterval);
        clearInterval(tipInterval);

        await new Promise(r => setTimeout(r, 400));

        loadingOverlay.style.display = 'none';
        // Reset loading UI
        step1.className = 'loading-step active'; step2.className = 'loading-step'; step3.className = 'loading-step';
        setProgress(0);

        mappingSection.style.display = 'none';
        resultsSection.style.display = 'block';
        headerStats.style.display = 'flex';

        renderResults(stats);
    }, 300);
}

// ===== Render Results =====
function renderResults(stats) {
    $('totalProducts').textContent = stats.totalProducts;
    $('avgScore').textContent = stats.avgScore;
    $('criticalCount').textContent = stats.criticalCount;
    $('resultsSubtitle').textContent = `${stats.totalProducts} ürün analiz edildi`;

    // Score ring
    const pct = stats.avgScore / 100;
    const circumference = 2 * Math.PI * 54;
    const circle = $('scoreCircle');
    circle.style.strokeDashoffset = circumference * (1 - pct);
    circle.style.stroke = stats.avgScore >= 80 ? 'var(--accent-green)' : stats.avgScore >= 50 ? 'var(--accent-yellow)' : 'var(--accent-red)';
    $('overallScore').textContent = stats.avgScore;

    $('missingKeywordsCount').textContent = stats.totalMissing;
    $('materialMismatchCount').textContent = stats.totalMaterialIssues;
    $('titleLengthIssues').textContent = stats.titleLengthIssues;

    // Reach comparison
    const dashboard = $('summaryDashboard');
    let reachEl = document.getElementById('reachComparison');
    if (!reachEl) { reachEl = document.createElement('div'); reachEl.id = 'reachComparison'; dashboard.after(reachEl); }
    reachEl.innerHTML = `<div class="reach-comparison">
        <div class="reach-card"><div class="reach-icon">📊</div><div class="reach-number">${stats.totalPresentKeywords || 0}</div><div class="reach-label">Başlıkta Mevcut Kelime</div></div>
        <div class="reach-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="28" height="28"><path d="M5 12h14M12 5l7 7-7 7"/></svg></div>
        <div class="reach-card potential"><div class="reach-icon">🚀</div><div class="reach-number">${(stats.totalPresentKeywords || 0) + (stats.totalMissingKeywords || 0)}</div><div class="reach-label">Potansiyel Kelime</div></div>
        <div class="reach-card missed"><div class="reach-icon">⚡</div><div class="reach-number" style="color:var(--accent-yellow)">+${stats.totalMissingKeywords || 0}</div><div class="reach-label">Eksik Anahtar Kelime</div></div>
    </div>`;

    // Keywords cloud with volumes
    const cloud = $('keywordsCloud');
    cloud.innerHTML = '';
    const kwData = stats.topMissedWithVolume || [];
    if (kwData.length > 0) {
        kwData.forEach(item => {
            const tag = document.createElement('div');
            const cls = item.count >= 10 ? 'critical-tag' : item.count >= 5 ? 'warning-tag' : 'info-tag';
            tag.className = `keyword-tag ${cls}`;
            tag.innerHTML = `${item.keyword} <span class="keyword-count">×${item.count} üründe</span>`;
            cloud.appendChild(tag);
        });
    }
    $('topKeywordsSection').style.display = kwData.length > 0 ? 'block' : 'none';

    // Bulk edit
    renderBulkEdit();
    renderProductCards(analysisResults);

    // Show stock filters if stock data exists
    const hasStock = analysisResults.some(r => r.stock && r.stock.trim() !== '');
    $('stockFilters').style.display = hasStock ? 'flex' : 'none';

    // Populate brand filter
    const hasBrand = analysisResults.some(r => r.brand && r.brand.trim() !== '');
    const brandWrap = $('brandFilterWrap');
    const brandSel = $('brandFilter');
    if (hasBrand) {
        brandWrap.style.display = 'flex';
        const brands = [...new Set(analysisResults.map(r => r.brand).filter(Boolean))].sort();
        brandSel.innerHTML = '<option value="all">🏷️ Tüm Markalar</option>';
        brands.forEach(b => {
            const count = analysisResults.filter(r => r.brand === b).length;
            brandSel.innerHTML += `<option value="${b}">${b} (${count})</option>`;
        });
    } else {
        brandWrap.style.display = 'none';
    }

    // Centralized filter function
    function applyFilters() {
        let filtered = [...analysisResults];
        // Severity
        const activeFilter = document.querySelector('.filter-btn[data-filter].active');
        if (activeFilter && activeFilter.dataset.filter !== 'all') {
            filtered = filtered.filter(r => r.severity === activeFilter.dataset.filter);
        }
        // Stock
        const activeStock = document.querySelector('.filter-btn[data-stock].active');
        if (activeStock) {
            const isInStock = (s) => {
                if (!s) return false;
                const sl = s.toLowerCase().trim();
                if (sl === '0' || sl === '' || sl === 'yok' || sl === 'hayır' || sl === 'no' || sl === 'false') return false;
                const num = parseFloat(sl);
                if (!isNaN(num) && num <= 0) return false;
                return true;
            };
            filtered = filtered.filter(r =>
                activeStock.dataset.stock === 'instock' ? isInStock(r.stock) : !isInStock(r.stock)
            );
        }
        // Brand
        const brandVal = brandSel.value;
        if (brandVal !== 'all') {
            filtered = filtered.filter(r => r.brand === brandVal);
        }
        renderProductCards(filtered);
    }

    // Severity filter
    document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn[data-filter]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.filter-btn[data-stock]').forEach(b => b.classList.remove('active'));
            applyFilters();
        });
    });

    // Stock filter
    document.querySelectorAll('.filter-btn[data-stock]').forEach(btn => {
        btn.addEventListener('click', () => {
            const wasActive = btn.classList.contains('active');
            document.querySelectorAll('.filter-btn[data-stock]').forEach(b => b.classList.remove('active'));
            if (!wasActive) btn.classList.add('active');
            applyFilters();
        });
    });

    // Brand filter
    brandSel.addEventListener('change', () => applyFilters());
}

function renderBulkEdit() {
    const needsEdit = analysisResults.filter(r => r.suggestedName !== r.name);
    if (needsEdit.length === 0) return;
    let bulkEl = document.getElementById('bulkEditSection');
    if (!bulkEl) { bulkEl = document.createElement('div'); bulkEl.id = 'bulkEditSection'; const topKw = $('topKeywordsSection'); topKw.after(bulkEl); }
    bulkEl.className = 'top-keywords-section';
    bulkEl.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;flex-wrap:wrap;gap:8px">
            <h3>✏️ Toplu Düzenleme <span style="opacity:0.6;font-size:0.8em">(${needsEdit.length} ürün)</span></h3>
            <div style="display:flex;gap:8px">
                <button class="btn btn-secondary btn-sm" onclick="document.getElementById('bulkList').style.display=document.getElementById('bulkList').style.display==='none'?'block':'none'">Göster/Gizle</button>
                <button class="btn btn-primary btn-sm" onclick="exportBulkEdit()">📥 Düzeltmeleri İndir</button>
            </div>
        </div>
        <div id="bulkList" style="display:none;max-height:400px;overflow-y:auto">
            ${needsEdit.map(r => `<div style="display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center;padding:10px;border:1px solid var(--border);border-radius:var(--radius-sm);margin-bottom:6px;background:var(--bg-primary)">
                <span class="mini-score ${r.score >= 80 ? 'score-good' : r.score >= 50 ? 'score-warning' : 'score-critical'}" style="width:36px;height:36px;font-size:0.8rem">${r.score}</span>
                <div style="min-width:0">
                    <div style="font-size:0.75rem;color:var(--text-muted);text-decoration:line-through;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(r.name)}</div>
                    <input style="width:100%;padding:4px 8px;border:1px solid var(--border);border-radius:4px;background:var(--bg-card);color:var(--text-primary);font-size:0.85rem;font-family:inherit" value="${escapeHtml(r.suggestedName)}" data-idx="${analysisResults.indexOf(r)}" onchange="analysisResults[this.dataset.idx].suggestedName=this.value" />
                </div>
                <span style="font-size:0.7rem;color:var(--accent-yellow);white-space:nowrap">${r.missingKeywords.length} eksik</span>
            </div>`).join('')}
        </div>`;
}

function renderProductCards(results) {
    const grid = $('productsGrid');
    grid.innerHTML = '';
    results.forEach((r, i) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.animationDelay = `${Math.min(i * 0.05, 1)}s`;

        const scClass = r.score >= 80 ? 'score-good' : r.score >= 50 ? 'score-warning' : 'score-critical';

        // Image
        let imgHtml;
        if (r.image && (r.image.startsWith('http') || r.image.startsWith('//'))) {
            imgHtml = `<img class="product-card-image" src="${r.image}" alt="${r.name}" onerror="this.outerHTML='<div class=\\'product-card-image no-image\\'><svg viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'1.5\\'><path d=\\'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z\\'/></svg></div>'">`;
        } else {
            imgHtml = `<div class="product-card-image no-image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>`;
        }

        // Issues badges (max 3)
        const topIssues = r.suggestions.slice(0, 3);
        let badgesHtml = topIssues.map(s => {
            const cls = s.type === 'critical' ? 'critical' : s.type === 'warning' ? 'warning' : 'good';
            const icon = s.type === 'critical' ? '⚠️' : s.type === 'warning' ? '💡' : 'ℹ️';
            const shortText = s.text.replace(/<[^>]*>/g, '').substring(0, 50) + (s.text.length > 50 ? '...' : '');
            return `<span class="issue-badge ${cls}">${icon} ${shortText}</span>`;
        }).join('');

        if (r.suggestions.length === 0) {
            badgesHtml = '<span class="issue-badge good">✅ Sorun bulunamadı</span>';
        }

        card.innerHTML = `
            ${imgHtml}
            <div class="product-card-info">
                <div class="product-card-name" title="${r.name}">${r.name}</div>
                ${r.category ? `<span class="modal-category">${r.category}</span>` : ''}
                <div class="product-card-issues">${badgesHtml}</div>
            </div>
            <div class="product-card-score">
                <div class="mini-score ${scClass}">${r.score}</div>
                <span class="mini-score-label">SEO Skor</span>
            </div>
        `;
        card.addEventListener('click', () => showProductModal(r));
        grid.appendChild(card);
    });
}

// ===== Product Modal =====
function showProductModal(r) {
    const mc = $('modalContent');
    const scClass = r.score >= 80 ? 'good' : r.score >= 50 ? 'warning' : 'critical';

    // Image
    let imgHtml;
    if (r.image && (r.image.startsWith('http') || r.image.startsWith('//'))) {
        imgHtml = `<img class="modal-image" src="${r.image}" alt="${r.name}" onerror="this.className='modal-image no-image'; this.innerHTML='<svg viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'1.5\\'><path d=\\'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z\\'/></svg>'">`;
    } else {
        imgHtml = `<div class="modal-image no-image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>`;
    }

    // Score bars
    const bd = r.scoreBreakdown;
    const bars = [
        { label: 'Başlık Uzunluğu', val: bd.length },
        { label: 'Anahtar Kelimeler', val: bd.keywords },
        { label: 'Malzeme Eşleşme', val: bd.materials },
        { label: 'Kategori Uyumu', val: bd.category },
        { label: 'Yapısal Kalite', val: bd.structure }
    ];
    const barsHtml = bars.map(b => {
        const cls = b.val >= 80 ? 'good' : b.val >= 50 ? 'warning' : 'critical';
        return `<div class="score-bar-item">
            <span class="score-bar-label">${b.label}</span>
            <div class="score-bar-track"><div class="score-bar-fill ${cls}" style="width: ${b.val}%"></div></div>
            <span class="score-bar-value">${b.val}</span>
        </div>`;
    }).join('');

    // Suggestions
    const suggestionsHtml = r.suggestions.map(s => {
        const cls = s.type === 'critical' ? 'critical' : s.type === 'warning' ? 'warning' : 'info';
        const icon = s.type === 'critical' ? '🔴' : s.type === 'warning' ? '🟡' : '🔵';
        return `<div class="suggestion-item">
            <div class="suggestion-icon ${cls}">${icon}</div>
            <div class="suggestion-text">${s.text}</div>
        </div>`;
    }).join('');

    // ===== KEYWORD DETAILS WITH VOLUMES =====
    const hasApiData = r.keywordDataSource === 'google_keyword_planner';
    const keywordDetails = r.keywordDetails || [];

    function formatVolume(vol) {
        if (!vol || vol === 0) return '—';
        if (vol >= 10000) return (vol / 1000).toFixed(0) + 'K';
        if (vol >= 1000) return (vol / 1000).toFixed(1) + 'K';
        return vol.toLocaleString('tr-TR');
    }

    function competitionBadge(comp, compIndex) {
        if (!comp || comp === 'UNSPECIFIED') return '<span class="comp-badge comp-unknown">—</span>';
        const labels = { LOW: 'Düşük', MEDIUM: 'Orta', HIGH: 'Yüksek' };
        const cls = comp === 'LOW' ? 'comp-low' : comp === 'MEDIUM' ? 'comp-medium' : 'comp-high';
        return `<span class="comp-badge ${cls}">${labels[comp] || comp}</span>`;
    }

    function popularityIndicator(kd) {
        // If we have API data, use monthly volume
        if (kd.monthlyVolume && kd.monthlyVolume > 0) {
            return `<span class="vol-badge">${formatVolume(kd.monthlyVolume)}/ay</span>`;
        }
        // If we have autocomplete data, show popularity from Google Suggest
        if (kd.isGooglePopular) {
            if (kd.googleRank && kd.googleRank > 0) {
                return `<span class="vol-badge vol-suggest">🔥 #${kd.googleRank} Google</span>`;
            }
            return `<span class="vol-badge vol-suggest">✓ Google'da popüler</span>`;
        }
        return '<span class="vol-badge vol-none">Veri yok</span>';
    }

    // Build keyword analysis table
    let kwDetailsHtml = '';
    const missingKws = keywordDetails.filter(k => k.status === 'missing');
    const presentKws = keywordDetails.filter(k => k.status === 'present');
    const skipKws = keywordDetails.filter(k => k.status === 'skip');

    if (missingKws.length > 0) {
        kwDetailsHtml += `<div class="kw-group kw-group-missing">
            <div class="kw-group-title">❌ Eksik Anahtar Kelimeler <span class="kw-group-count">${missingKws.length}</span></div>
            <div class="kw-table">
                ${missingKws.map(kd => `<div class="kw-row kw-missing">
                    <div class="kw-name">
                        <strong>${kd.keyword}</strong>
                        ${kd.source ? `<span class="kw-source">← ${kd.source}</span>` : ''}
                        ${kd.note ? `<span class="kw-note">${kd.note}</span>` : ''}
                    </div>
                    <div class="kw-meta">
                        ${popularityIndicator(kd)}
                        ${hasApiData ? competitionBadge(kd.competition, kd.competitionIndex) : ''}
                        ${kd.cpcHigh ? `<span class="cpc-badge">₺${kd.cpcHigh.toFixed(2)} CPC</span>` : ''}
                    </div>
                </div>`).join('')}
            </div>
        </div>`;
    }

    if (presentKws.length > 0) {
        kwDetailsHtml += `<div class="kw-group kw-group-present">
            <div class="kw-group-title">✅ Mevcut Anahtar Kelimeler <span class="kw-group-count">${presentKws.length}</span></div>
            <div class="kw-table">
                ${presentKws.map(kd => `<div class="kw-row kw-present">
                    <div class="kw-name"><strong>${kd.keyword}</strong></div>
                    <div class="kw-meta">
                        ${popularityIndicator(kd)}
                        ${hasApiData ? competitionBadge(kd.competition, kd.competitionIndex) : ''}
                    </div>
                </div>`).join('')}
            </div>
        </div>`;
    }

    // ===== LONG TAIL KEYWORDS (with volume data) =====
    const ltVolumes = r.longTailVolumes || {};

    function ltVolumeBadge(text) {
        const vol = ltVolumes[text.toLowerCase()];
        if (vol && vol.monthlyVolume > 0) {
            return `<span class="vol-badge">${formatVolume(vol.monthlyVolume)}/ay</span>`;
        }
        return '';
    }

    function ltCompBadge(text) {
        const vol = ltVolumes[text.toLowerCase()];
        if (vol && vol.competition && vol.competition !== 'UNSPECIFIED') {
            return competitionBadge(vol.competition, vol.competitionIndex);
        }
        return '';
    }

    function ltCpcBadge(text) {
        const vol = ltVolumes[text.toLowerCase()];
        if (vol && vol.cpcHigh > 0) {
            return `<span class="cpc-badge">₺${vol.cpcHigh.toFixed(2)}</span>`;
        }
        return '';
    }

    let longTailHtml = '';
    if (r.longTailKeywords && r.longTailKeywords.length > 0) {
        // Track position within each query group for popularity estimation
        const allSuggestions = [];
        r.longTailKeywords.forEach(lt => {
            lt.suggestions.forEach((s, idx) => {
                allSuggestions.push({ text: s, query: lt.query, rank: idx + 1 });
            });
        });
        const seen = new Set();
        const uniqueSuggestions = allSuggestions.filter(s => {
            if (seen.has(s.text.toLowerCase())) return false;
            seen.add(s.text.toLowerCase());
            return true;
        });

        const nameLow = r.name.toLowerCase();
        const covered = uniqueSuggestions.filter(s =>
            s.text.toLowerCase().split(' ').filter(w => w.length >= 3).every(w => nameLow.includes(w))
        );
        const notCovered = uniqueSuggestions.filter(s =>
            !s.text.toLowerCase().split(' ').filter(w => w.length >= 3).every(w => nameLow.includes(w))
        );

        const hasVolumeData = Object.values(ltVolumes).some(v => v.monthlyVolume > 0);

        function popularityLabel(s) {
            const vol = ltVolumes[s.text.toLowerCase()];
            if (vol && vol.monthlyVolume > 0) {
                return `<span class="vol-badge">${formatVolume(vol.monthlyVolume)}/ay</span>`;
            }
            // Use autocomplete position as popularity proxy
            if (s.rank <= 3) return '<span class="vol-badge vol-hot">🔥 Çok Popüler</span>';
            if (s.rank <= 6) return '<span class="vol-badge vol-suggest">⚡ Popüler</span>';
            return '<span class="vol-badge vol-none">📊 Aranan</span>';
        }

        longTailHtml = `<div class="modal-section">
            <div class="modal-section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                🔍 Google'da Aranan İlgili Kelimeler
                <span style="font-size:0.75rem;color:var(--text-muted);font-weight:400"> (${uniqueSuggestions.length} sonuç)</span>
            </div>
            ${hasVolumeData ? `<div style="font-size:0.7rem;color:var(--text-muted);margin-bottom:0.75rem;padding:6px 10px;background:var(--bg-elevated);border-radius:6px">📊 Arama hacmi, rekabet ve CPC verileri Google Keyword Planner'dan alınmıştır.</div>` : `<div style="font-size:0.7rem;color:var(--text-muted);margin-bottom:0.75rem;padding:6px 10px;background:var(--bg-elevated);border-radius:6px">📊 Popülerlik Google Autocomplete sıralamasına göre tahmin edilmiştir. Gerçek arama hacimleri için Basic Access gereklidir.</div>`}
            ${notCovered.length > 0 ? `
            <div class="kw-group kw-group-missing" style="margin-bottom:1rem">
                <div class="kw-group-title">💡 Başlığınızda Olmayan Popüler Aramalar <span class="kw-group-count">${notCovered.length}</span></div>
                <div class="kw-table">
                    ${notCovered.slice(0, 15).map(s => `<div class="kw-row kw-missing">
                        <div class="kw-name"><strong>${s.text}</strong></div>
                        <div class="kw-meta">
                            ${popularityLabel(s)}
                            ${ltCompBadge(s.text)}
                            ${ltCpcBadge(s.text)}
                        </div>
                    </div>`).join('')}
                </div>
            </div>` : ''}
            ${covered.length > 0 ? `
            <div class="kw-group kw-group-present">
                <div class="kw-group-title">✅ Başlığınızla Eşleşen Aramalar <span class="kw-group-count">${covered.length}</span></div>
                <div class="kw-table">
                    ${covered.slice(0, 8).map(s => `<div class="kw-row kw-present">
                        <div class="kw-name"><strong>${s.text}</strong></div>
                        <div class="kw-meta">
                            ${popularityLabel(s)}
                            ${ltCompBadge(s.text)}
                        </div>
                    </div>`).join('')}
                </div>
            </div>` : ''}
        </div>`;
    }

    // ===== VISIBILITY IMPACT SECTION =====
    let impactHtml = '';
    if (r.suggestedName !== r.name || (r.missingKeywords && r.missingKeywords.length > 0)) {
        const missingCount = r.missingKeywords ? r.missingKeywords.length : 0;
        const totalVolume = (r.keywordDetails || [])
            .filter(k => k.status === 'missing' && k.monthlyVolume > 0)
            .reduce((sum, k) => sum + k.monthlyVolume, 0);

        const ltMissedVolume = Object.values(ltVolumes)
            .filter(v => v.monthlyVolume > 0)
            .reduce((sum, v) => sum + v.monthlyVolume, 0);

        const currentScore = r.score;
        const estimatedNewScore = Math.min(100, currentScore + (missingCount * 5));

        impactHtml = `<div class="modal-section">
            <div class="modal-section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                📈 Önerilen Değişikliklerin Tahmini Etkisi
            </div>
            <div class="impact-grid">
                <div class="impact-card">
                    <div class="impact-label">Mevcut SEO Skoru</div>
                    <div class="impact-value" style="color:${currentScore >= 80 ? 'var(--accent-green)' : currentScore >= 50 ? 'var(--accent-yellow)' : 'var(--accent-red)'}">${currentScore}</div>
                </div>
                <div class="impact-arrow">→</div>
                <div class="impact-card impact-card-new">
                    <div class="impact-label">Tahmini Yeni Skor</div>
                    <div class="impact-value" style="color:var(--accent-green)">${estimatedNewScore}</div>
                </div>
                <div class="impact-card">
                    <div class="impact-label">Eksik Anahtar Kelime</div>
                    <div class="impact-value" style="color:var(--accent-red)">${missingCount}</div>
                </div>
                ${totalVolume > 0 ? `<div class="impact-card">
                    <div class="impact-label">Kaçırılan Aylık Arama</div>
                    <div class="impact-value" style="color:var(--accent-yellow)">${formatVolume(totalVolume)}</div>
                </div>` : ''}
            </div>
            <div class="impact-tips">
                ${r.suggestedName !== r.name ? `<div class="impact-tip">✅ <strong>Önerilen başlığı kullanın</strong> — Eksik anahtar kelimeler eklenmiş, ${missingCount} yeni arama terimi yakalanacak</div>` : ''}
                ${missingCount > 0 ? `<div class="impact-tip">📌 <strong>Eksik kelimeleri ekleyin</strong> — Bu kelimeler açıklamanızda var ama başlıkta yok. Başlığa eklemek arama sonuçlarında görünürlüğü artırır.</div>` : ''}
                ${totalVolume > 0 ? `<div class="impact-tip">🔍 <strong>Aylık ${formatVolume(totalVolume)} arama</strong> — Eksik anahtar kelimeler için toplam aylık arama hacmi. Bu aramalarda şu an görünmüyorsunuz.</div>` : ''}
            </div>
        </div>`;
    }

    // Highlighted description
    let descHtml = escapeHtml(r.description);
    const allKw = [...Object.keys(MATERIAL_KEYWORDS), ...Object.keys(FEATURE_KEYWORDS)];
    allKw.forEach(kw => {
        const regex = new RegExp(`(${escapeRegex(kw)})`, 'gi');
        descHtml = descHtml.replace(regex, '<span class="desc-highlight">$1</span>');
    });

    // Suggested name
    let suggestedNameHtml = '';
    if (r.suggestedName !== r.name) {
        let display = escapeHtml(r.suggestedName);
        const original = escapeHtml(r.name);
        if (display.startsWith(original)) {
            const added = display.slice(original.length);
            display = original + `<span class="highlight">${added}</span>`;
        }
        suggestedNameHtml = `
            <div class="suggested-name">
                <button class="copy-btn" onclick="copyText(this, '${r.suggestedName.replace(/'/g, "\\'")}')">📋 Kopyala</button>
                <div class="suggested-name-label">Önerilen Ürün Adı</div>
                <div class="suggested-name-text">${display}</div>
            </div>`;
    }

    // Data source badge
    const dataSourceBadge = hasApiData
        ? '<span class="data-source-badge api">📊 DataForSEO (Google Keyword Planner)</span>'
        : '<span class="data-source-badge suggest">🔍 Google Autocomplete</span>';

    mc.innerHTML = `
        <div class="modal-header">
            ${imgHtml}
            <div class="modal-title-area">
                <div class="modal-product-name">${r.name}</div>
                ${r.category ? `<span class="modal-category">${r.category}</span>` : ''}
                ${dataSourceBadge}
            </div>
        </div>
        <div class="modal-score-section">
            <div class="modal-score-ring">
                <svg viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="36" fill="none" stroke="var(--border)" stroke-width="6"/>
                    <circle cx="40" cy="40" r="36" fill="none" stroke-width="6" stroke-linecap="round"
                        stroke="${scClass === 'good' ? 'var(--accent-green)' : scClass === 'warning' ? 'var(--accent-yellow)' : 'var(--accent-red)'}"
                        stroke-dasharray="${2 * Math.PI * 36}"
                        stroke-dashoffset="${2 * Math.PI * 36 * (1 - r.score / 100)}"
                        transform="rotate(-90 40 40)"/>
                </svg>
                <div class="modal-score-value">${r.score}</div>
            </div>
            <div class="modal-score-details">
                <div class="modal-score-bars">${barsHtml}</div>
            </div>
        </div>
        ${suggestedNameHtml}
        ${r.suggestions.length > 0 ? `
        <div class="modal-section">
            <div class="modal-section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                İyileştirme Önerileri (${r.suggestions.length})
            </div>
            <div class="suggestion-list">${suggestionsHtml}</div>
        </div>` : ''}
        ${kwDetailsHtml ? `
        <div class="modal-section">
            <div class="modal-section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
                📊 Anahtar Kelime Analizi
            </div>
            ${kwDetailsHtml}
        </div>` : ''}
        ${longTailHtml}
        ${r.competitors && r.competitors.length > 0 ? `
        <div class="modal-section">
            <div class="modal-section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2m22-4l-5 5 5 5M9 7a4 4 0 100-8 4 4 0 000 8z"/></svg>
                🏢 Rakip Analizi — "${r.serpResults?.query || ''}" aramasında üst sıradakiler
            </div>
            <div style="border:1px solid var(--border);border-radius:var(--radius-sm);overflow:hidden">
                <div style="display:grid;grid-template-columns:auto 1fr auto;gap:0;background:var(--bg-primary);font-size:0.7rem;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;padding:8px 12px;border-bottom:1px solid var(--border)">
                    <span style="min-width:30px">Sıra</span>
                    <span>Mağaza / Marka</span>
                    <span style="text-align:right">Platform</span>
                </div>
                ${r.competitors.slice(0, 8).map(c => {
                    const platformIcon = c.domain.includes('trendyol') ? '🟠' : c.domain.includes('hepsiburada') ? '🟣' : c.domain.includes('n11') ? '🔵' : '🌐';
                    return `<div style="display:grid;grid-template-columns:auto 1fr auto;gap:8px;padding:8px 12px;border-bottom:1px solid var(--border);font-size:0.8rem;align-items:center">
                        <span style="min-width:30px;font-weight:700;color:var(--accent-yellow)">#${c.positions[0]}</span>
                        <div style="min-width:0">
                            <div style="font-weight:500;color:var(--text-primary)">${escapeHtml(c.name)}</div>
                            <div style="font-size:0.7rem;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(c.titles[0] || '')}</div>
                        </div>
                        <span style="font-size:0.75rem">${platformIcon} ${c.domain.split('.')[0]}</span>
                    </div>`;
                }).join('')}
            </div>
        </div>` : ''}
        ${r.competitorKeywordGaps && r.competitorKeywordGaps.length > 0 ? `
        <div class="modal-section">
            <div class="modal-section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                ⚡ Rakiplerin Kullandığı Eksik Kelimeler
            </div>
            <p style="font-size:0.75rem;color:var(--text-muted);margin:0 0 8px 0">Rakiplerinizin başlıklarında sık geçen ama sizin başlığınızda olmayan kelimeler</p>
            <div style="display:flex;flex-wrap:wrap;gap:6px">
                ${r.competitorKeywordGaps.map(g =>
                    `<span class="keyword-pill missing" style="font-size:0.78rem">✗ ${g.word} <span style="opacity:0.6;font-size:0.7rem">(${g.usedByCount}/${g.totalCompetitors} rakipte)</span></span>`
                ).join('')}
            </div>
        </div>` : ''}
        ${r.missingPopularKeywords && r.missingPopularKeywords.length > 0 ? `
        <div class="modal-section">
            <div class="modal-section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                🔍 Pazar Araştırması — Kaçırılan Fırsatlar
            </div>
            <p style="font-size:0.75rem;color:var(--text-muted);margin:0 0 8px 0">Google'da aranan ama başlığınızda olmayan anahtar kelimeler (hacim verili)</p>
            <div style="border:1px solid var(--border);border-radius:var(--radius-sm);overflow:hidden">
                <div style="display:grid;grid-template-columns:1fr auto auto auto;gap:0;background:var(--bg-primary);font-size:0.7rem;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;padding:8px 12px;border-bottom:1px solid var(--border)">
                    <span>Anahtar Kelime</span>
                    <span style="text-align:right;min-width:70px">Arama Hacmi</span>
                    <span style="text-align:center;min-width:65px">Rekabet</span>
                    <span style="text-align:right;min-width:45px">CPC</span>
                </div>
                ${r.missingPopularKeywords.slice(0, 15).map(k => {
                    const vol = k.searchVolume || 0;
                    const volText = vol >= 1000 ? (vol / 1000).toFixed(1).replace(/\.0$/, '') + 'K' : vol;
                    const comp = k.competition || 'UNSPECIFIED';
                    const compClass = comp === 'HIGH' ? 'critical' : comp === 'MEDIUM' ? 'warning' : comp === 'LOW' ? 'good' : '';
                    const compText = comp === 'HIGH' ? 'YÜKSEK' : comp === 'MEDIUM' ? 'ORTA' : comp === 'LOW' ? 'DÜŞÜK' : '-';
                    const cpcText = k.cpc ? '₺' + k.cpc.toFixed(2) : '-';
                    return `<div style="display:grid;grid-template-columns:1fr auto auto auto;gap:0;padding:8px 12px;border-bottom:1px solid var(--border);font-size:0.82rem;align-items:center">
                        <span style="color:var(--text-primary);font-weight:500">${k.keyword}</span>
                        <span style="text-align:right;min-width:70px"><span style="background:var(--accent-yellow);color:#000;padding:2px 8px;border-radius:10px;font-size:0.72rem;font-weight:600">${volText}/ay</span></span>
                        <span style="text-align:center;min-width:65px"><span class="issue-badge ${compClass}" style="font-size:0.68rem;padding:2px 6px;margin:0">${compText}</span></span>
                        <span style="text-align:right;min-width:45px;font-size:0.75rem;color:var(--text-muted)">${cpcText}</span>
                    </div>`;
                }).join('')}
            </div>
        </div>` : ''}
        ${impactHtml}
        <div class="modal-section">
            <div class="modal-section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                Ürün Açıklaması
            </div>
            <div class="description-preview">${descHtml || '<em>Açıklama yok</em>'}</div>
        </div>
    `;

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ===== Modal Close =====
$('modalClose').addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== Export Results =====
$('exportResults').addEventListener('click', () => {
    const stripHtml = str => str.replace(/<[^>]*>/g, '');

    // Main report sheet
    const exportData = analysisResults.map((r, i) => ({
        '#': i + 1,
        'Mevcut Ürün Adı': r.name,
        '➜ Önerilen Ürün Adı': r.suggestedName !== r.name ? r.suggestedName : '✓ Değişiklik Gerekmez',
        'SEO Skoru': r.score,
        'Durum': r.severity === 'critical' ? '🔴 Kritik' : r.severity === 'warning' ? '🟡 İyileştirmeli' : '🟢 İyi',
        'Başlık Uzunluk Skoru': r.scoreBreakdown.length,
        'Anahtar Kelime Skoru': r.scoreBreakdown.keywords,
        'Malzeme Eşleşme Skoru': r.scoreBreakdown.materials,
        'Kategori Uyum Skoru': r.scoreBreakdown.category,
        'Yapısal Kalite Skoru': r.scoreBreakdown.structure,
        'Eksik Anahtar Kelimeler': r.missingKeywords.join(', ') || 'Yok',
        'Mevcut Anahtar Kelimeler': r.presentKeywords.join(', ') || 'Yok',
        'Kategori Sorunu': r.categoryIssues.length > 0 ? r.categoryIssues.map(c => c.text).join('; ') : 'Yok',
        'Malzeme Uyumsuzlukları': r.materialIssues.length > 0 ? r.materialIssues.map(m => `${m.material} → ${m.searchTerms[0]}`).join(', ') : 'Yok',
        'Tüm Öneriler': r.suggestions.map((s, j) => `${j + 1}. ${stripHtml(s.text)}`).join('\n') || 'Öneri yok',
        'Kategori': r.category || '',
        'Ürün Açıklaması': r.description
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    // Set column widths
    ws['!cols'] = [
        { wch: 4 }, { wch: 40 }, { wch: 50 }, { wch: 10 }, { wch: 14 },
        { wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 14 },
        { wch: 30 }, { wch: 25 }, { wch: 35 }, { wch: 30 }, { wch: 60 },
        { wch: 15 }, { wch: 60 }
    ];

    // Quick-copy sheet (just old name → new name)
    const quickData = analysisResults
        .filter(r => r.suggestedName !== r.name)
        .map(r => ({
            'Mevcut Ürün Adı': r.name,
            'Önerilen Ürün Adı': r.suggestedName,
            'SEO Skoru': r.score,
            'Eksik Kelimeler': r.missingKeywords.join(', ')
        }));
    const wsQuick = XLSX.utils.json_to_sheet(quickData.length ? quickData : [{ 'Bilgi': 'Tüm ürün adları uygun durumda!' }]);
    wsQuick['!cols'] = [{ wch: 40 }, { wch: 50 }, { wch: 10 }, { wch: 40 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Detaylı Rapor');
    XLSX.utils.book_append_sheet(wb, wsQuick, 'Hızlı Düzenleme');
    XLSX.writeFile(wb, 'seo_analiz_raporu.xlsx');
});

// ===== Bulk Edit Export =====
function exportBulkEdit() {
    const data = analysisResults
        .filter(r => r.suggestedName !== r.name)
        .map(r => ({
            'Mevcut Ürün Adı': r.name,
            'Düzeltilmiş Ürün Adı': r.suggestedName,
            'SEO Skoru': r.score,
            'Eksik Kelime Sayısı': r.missingKeywords.length,
            'Eksik Kelimeler': r.missingKeywords.join(', ')
        }));
    if (data.length === 0) return alert('Düzeltme gereken ürün yok!');
    const ws = XLSX.utils.json_to_sheet(data);
    ws['!cols'] = [{ wch: 45 }, { wch: 55 }, { wch: 10 }, { wch: 16 }, { wch: 40 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Düzeltmeler');
    XLSX.writeFile(wb, 'seo_duzeltmeler.xlsx');
}

// ===== New Analysis =====
$('newAnalysis').addEventListener('click', () => {
    resultsSection.style.display = 'none';
    headerStats.style.display = 'none';
    uploadSection.style.display = 'block';
    fileInput.value = '';
    rawData = [];
    headers = [];
    analysisResults = [];
    // Clean up dynamically added sections
    const reachEl = document.getElementById('reachComparison');
    if (reachEl) reachEl.remove();
    const bulkEl = document.getElementById('bulkEditSection');
    if (bulkEl) bulkEl.remove();
});

// ===== Utility Functions =====
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function copyText(btn, text) {
    navigator.clipboard.writeText(text).then(() => {
        btn.textContent = '✅ Kopyalandı!';
        setTimeout(() => { btn.textContent = '📋 Kopyala'; }, 2000);
    });
}
