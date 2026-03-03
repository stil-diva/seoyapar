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
    const selects = ['colName', 'colDescription', 'colImage', 'colCategory'];
    const optionalSelects = ['colImage', 'colCategory'];
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

    headers.forEach((h, i) => {
        const hl = h.toLowerCase();
        if (nameKeywords.some(k => hl.includes(k))) $('colName').value = i;
        if (descKeywords.some(k => hl.includes(k))) $('colDescription').value = i;
        if (imgKeywords.some(k => hl.includes(k))) $('colImage').value = i;
        if (catKeywords.some(k => hl.includes(k))) $('colCategory').value = i;
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

    loadingOverlay.style.display = 'flex';

    setTimeout(() => {
        const products = rawData.map(row => ({
            name: String(row[nameCol] || '').trim(),
            description: String(row[descCol] || '').trim(),
            image: imgCol >= 0 ? String(row[imgCol] || '').trim() : '',
            category: catCol >= 0 ? String(row[catCol] || '').trim() : ''
        })).filter(p => p.name);

        analysisResults = products.map(p => analyzeProduct(p));
        const stats = generateOverallStats(analysisResults);

        loadingOverlay.style.display = 'none';
        mappingSection.style.display = 'none';
        resultsSection.style.display = 'block';
        headerStats.style.display = 'flex';

        renderResults(stats);
    }, 800);
}

// ===== Render Results =====
function renderResults(stats) {
    // Header stats
    $('totalProducts').textContent = stats.totalProducts;
    $('avgScore').textContent = stats.avgScore;
    $('criticalCount').textContent = stats.criticalCount;

    // Subtitle
    $('resultsSubtitle').textContent = `${stats.totalProducts} ürün analiz edildi`;

    // Overall score ring
    const pct = stats.avgScore / 100;
    const circumference = 2 * Math.PI * 54;
    const offset = circumference * (1 - pct);
    const circle = $('scoreCircle');
    circle.style.strokeDashoffset = offset;
    circle.style.stroke = stats.avgScore >= 80 ? '#10b981' : stats.avgScore >= 50 ? '#f59e0b' : '#ef4444';
    $('overallScore').textContent = stats.avgScore;

    // Summary cards
    $('missingKeywordsCount').textContent = stats.totalMissing;
    $('materialMismatchCount').textContent = stats.totalMaterialIssues;
    $('titleLengthIssues').textContent = stats.titleLengthIssues;

    // Top missing keywords cloud
    const cloud = $('keywordsCloud');
    cloud.innerHTML = '';
    stats.topMissing.forEach(([keyword, count]) => {
        const tag = document.createElement('div');
        const cls = count >= 5 ? 'critical-tag' : count >= 3 ? 'warning-tag' : 'info-tag';
        tag.className = `keyword-tag ${cls}`;
        tag.innerHTML = `${keyword} <span class="keyword-count">${count}</span>`;
        cloud.appendChild(tag);
    });
    $('topKeywordsSection').style.display = stats.topMissing.length > 0 ? 'block' : 'none';

    // Product cards
    renderProductCards(analysisResults);

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            const filtered = filter === 'all' ? analysisResults : analysisResults.filter(r => r.severity === filter);
            renderProductCards(filtered);
        });
    });
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

    // Keywords
    const kwHtml = r.presentKeywords.map(k =>
        `<span class="keyword-pill present">✓ ${k}</span>`
    ).concat(r.missingKeywords.map(k =>
        `<span class="keyword-pill missing">✗ ${k}</span>`
    )).join('');

    // Highlighted description
    let descHtml = escapeHtml(r.description);
    const allKw = [...Object.keys(MATERIAL_MAPPINGS), ...Object.keys(FEATURE_KEYWORDS)];
    allKw.forEach(kw => {
        const regex = new RegExp(`(${escapeRegex(kw)})`, 'gi');
        descHtml = descHtml.replace(regex, '<span class="desc-highlight">$1</span>');
    });

    // Suggested name
    let suggestedNameHtml = '';
    if (r.suggestedName !== r.name) {
        let display = escapeHtml(r.suggestedName);
        // Highlight the additions
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

    mc.innerHTML = `
        <div class="modal-header">
            ${imgHtml}
            <div class="modal-title-area">
                <div class="modal-product-name">${r.name}</div>
                ${r.category ? `<span class="modal-category">${r.category}</span>` : ''}
            </div>
        </div>
        <div class="modal-score-section">
            <div class="modal-score-ring">
                <svg viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="6"/>
                    <circle cx="40" cy="40" r="36" fill="none" stroke-width="6" stroke-linecap="round"
                        stroke="${scClass === 'good' ? '#10b981' : scClass === 'warning' ? '#f59e0b' : '#ef4444'}"
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
        ${kwHtml ? `
        <div class="modal-section">
            <div class="modal-section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
                Anahtar Kelime Durumu
            </div>
            <div class="keywords-found">${kwHtml}</div>
        </div>` : ''}
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
    const exportData = analysisResults.map(r => ({
        'Ürün Adı': r.name,
        'SEO Skoru': r.score,
        'Durum': r.severity === 'critical' ? 'Kritik' : r.severity === 'warning' ? 'Uyarı' : 'İyi',
        'Eksik Anahtar Kelimeler': r.missingKeywords.join(', '),
        'Malzeme Sorunları': r.materialIssues.map(m => m.text).join(' | '),
        'Kategori Sorunu': r.categoryIssues.map(c => c.text).join(' | '),
        'Önerilen Ad': r.suggestedName !== r.name ? r.suggestedName : '',
        'Öneri Sayısı': r.suggestions.length
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SEO Analiz Raporu');
    XLSX.writeFile(wb, 'seo_analiz_raporu.xlsx');
});

// ===== New Analysis =====
$('newAnalysis').addEventListener('click', () => {
    resultsSection.style.display = 'none';
    headerStats.style.display = 'none';
    uploadSection.style.display = 'block';
    fileInput.value = '';
    rawData = [];
    headers = [];
    analysisResults = [];
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
