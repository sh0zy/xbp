// データを保存・取得するための構造
let universities = [];
let selectedUniversityId = null;

// ページロード時にデータを読み込み
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    renderUniversities();
});

// ============ 志望校の管理 ============

function addUniversity() {
    const nameInput = document.getElementById('universityName');
    const scoreInput = document.getElementById('targetScore');

    const name = nameInput.value.trim();
    const score = parseInt(scoreInput.value);

    if (!name) {
        alert('大学名を入力してください');
        return;
    }

    if (!score || score < 0) {
        alert('有効な目標点数を入力してください');
        return;
    }

    const university = {
        id: Date.now(),
        name: name,
        targetScore: score,
        scores: []
    };

    universities.push(university);
    saveData();
    renderUniversities();

    nameInput.value = '';
    scoreInput.value = '';
}

function selectUniversity(id) {
    selectedUniversityId = id;
    renderUniversities();
    renderScoreInput();
    updateAnalysis();
}

function deleteUniversity(id) {
    if (confirm('この志望校を削除しますか？')) {
        universities = universities.filter(uni => uni.id !== id);
        if (selectedUniversityId === id) {
            selectedUniversityId = null;
        }
        saveData();
        renderUniversities();
        renderScoreInput();
        updateAnalysis();
    }
}

function renderUniversities() {
    const container = document.getElementById('universityList');
    container.innerHTML = '';

    if (universities.length === 0) {
        container.innerHTML = '<p class="hint">志望校を追加してください</p>';
        return;
    }

    universities.forEach(uni => {
        const card = document.createElement('div');
        card.className = `university-card ${selectedUniversityId === uni.id ? 'selected' : ''}`;

        const avgScore = uni.scores.length > 0
            ? Math.round(uni.scores.reduce((a, b) => a + b, 0) / uni.scores.length * 10) / 10
            : '-';

        card.innerHTML = `
            <h3>${uni.name}</h3>
            <p>目標点数</p>
            <div class="target-score">${uni.targetScore}</div>
            <p>受験回数: ${uni.scores.length}</p>
            ${uni.scores.length > 0 ? `<p>平均点: <strong>${avgScore}</strong></p>` : ''}
            <div class="btn-group">
                <button class="btn-select" onclick="selectUniversity(${uni.id})">
                    ${selectedUniversityId === uni.id ? '選択済み' : '選択'}
                </button>
                <button class="btn-delete" onclick="deleteUniversity(${uni.id})">削除</button>
            </div>
        `;

        container.appendChild(card);
    });
}

// ============ スコア入力の管理 ============

function renderScoreInput() {
    const container = document.getElementById('scoreInputArea');

    if (!selectedUniversityId) {
        container.innerHTML = '<p class="hint">↑ 先に志望校を追加して選択してください</p>';
        return;
    }

    const uni = universities.find(u => u.id === selectedUniversityId);

    let html = `
        <div class="score-input-form">
            <input type="text" id="examName" placeholder="試験名（例：2024年本試）">
            <input type="number" id="examScore" placeholder="得点" min="0" max="1000">
            <button onclick="addScore()">記録</button>
        </div>
    `;

    if (uni.scores.length > 0) {
        html += '<div class="score-list">';
        uni.scores.forEach((score, index) => {
            html += `
                <div class="score-item">
                    <div class="score-info">
                        <div>${score.name}</div>
                        <div class="score-date">${score.date}</div>
                    </div>
                    <div class="score-value">${score.value}点</div>
                    <button onclick="deleteScore(${index})">削除</button>
                </div>
            `;
        });
        html += '</div>';
    }

    container.innerHTML = html;
}

function addScore() {
    if (!selectedUniversityId) return;

    const nameInput = document.getElementById('examName');
    const scoreInput = document.getElementById('examScore');

    const name = nameInput.value.trim() || '過去問';
    const score = parseInt(scoreInput.value);

    if (!score || score < 0) {
        alert('有効な得点を入力してください');
        return;
    }

    const uni = universities.find(u => u.id === selectedUniversityId);
    uni.scores.push({
        name: name,
        value: score,
        date: new Date().toLocaleDateString('ja-JP')
    });

    saveData();
    renderScoreInput();
    updateAnalysis();

    nameInput.value = '';
    scoreInput.value = '';
}

function deleteScore(index) {
    if (!selectedUniversityId) return;

    const uni = universities.find(u => u.id === selectedUniversityId);
    uni.scores.splice(index, 1);

    saveData();
    renderScoreInput();
    updateAnalysis();
}

// ============ 分析の表示 ============

function updateAnalysis() {
    const container = document.getElementById('analysisResult');

    if (!selectedUniversityId) {
        container.innerHTML = '<p class="hint">志望校を選択してください</p>';
        return;
    }

    const uni = universities.find(u => u.id === selectedUniversityId);

    if (uni.scores.length === 0) {
        container.innerHTML = '<p class="hint">過去問の成績を記録すると分析が表示されます</p>';
        return;
    }

    const scores = uni.scores.map(s => s.value);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const gap = uni.targetScore - avgScore;
    const gapPercent = (avgScore / uni.targetScore) * 100;

    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);
    const trend = calculateTrend(scores);

    let html = `
        <div class="analysis-card">
            <h3>📊 ${uni.name} の分析</h3>

            <div class="stats-grid">
                <div class="stat-box target">
                    <div class="stat-label">目標点数</div>
                    <div class="stat-value">${uni.targetScore}</div>
                </div>
                <div class="stat-box average">
                    <div class="stat-label">平均得点</div>
                    <div class="stat-value">${Math.round(avgScore * 10) / 10}</div>
                </div>
                <div class="stat-box gap ${gap < 0 ? '' : 'warning'}">
                    <div class="stat-label">${gap < 0 ? '超過' : '不足'}</div>
                    <div class="stat-value">${Math.abs(Math.round(gap * 10) / 10)}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">進捗率</div>
                    <div class="stat-value">${Math.round(gapPercent)}%</div>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-box">
                    <div class="stat-label">最高得点</div>
                    <div class="stat-value">${maxScore}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">最低得点</div>
                    <div class="stat-value">${minScore}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">得点幅</div>
                    <div class="stat-value">${maxScore - minScore}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">トレンド</div>
                    <div class="stat-value">${trend}</div>
                </div>
            </div>

            <div class="progress-section">
                <div class="progress-label">
                    <span>目標までの進捗</span>
                    <span>${Math.min(Math.round(gapPercent), 100)}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill ${gapPercent < 100 ? 'warning' : ''}" style="width: ${Math.min(gapPercent, 100)}%">
                        ${Math.min(Math.round(gapPercent), 100) > 5 ? Math.min(Math.round(gapPercent), 100) + '%' : ''}
                    </div>
                </div>
            </div>

            <div style="margin-top: 20px; padding: 15px; background: #f0f1ff; border-radius: 8px;">
                <h4 style="color: #667eea; margin-bottom: 10px;">💡 分析</h4>
                ${getAnalysisMessage(avgScore, uni.targetScore, trend, scores)}
            </div>
        </div>
    `;

    // 複数の大学がある場合、比較を表示
    if (universities.length > 1) {
        html += '<div class="analysis-card">' + getComparisonAnalysis() + '</div>';
    }

    container.innerHTML = html;
}

function calculateTrend(scores) {
    if (scores.length < 2) return '−';

    const recent = scores.slice(-3);
    const earlier = scores.slice(0, Math.min(3, scores.length - 3));

    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;

    const diff = recentAvg - earlierAvg;

    if (Math.abs(diff) < 5) return '→ 安定';
    if (diff > 0) return '📈 向上中';
    return '📉 下降中';
}

function getAnalysisMessage(avgScore, targetScore, trend, scores) {
    const gap = targetScore - avgScore;
    const gapPercent = (avgScore / targetScore) * 100;

    let messages = [];

    // 状態の評価
    if (gap < 0) {
        messages.push('✅ 既に目標点数を達成しています！');
    } else if (gapPercent >= 90) {
        messages.push('🎯 目標に非常に接近しています。もう少しです！');
    } else if (gapPercent >= 75) {
        messages.push('💪 良好な進捗です。引き続き頑張ってください。');
    } else if (gapPercent >= 50) {
        messages.push('📚 中程度の進捗です。継続的な勉強が必要です。');
    } else {
        messages.push('⚠️ 目標まで距離があります。学習計画の見直しを検討してください。');
    }

    // トレンドの評価
    if (trend.includes('向上')) {
        messages.push('📈 成績が向上傾向にあります。この調子で頑張ってください！');
    } else if (trend.includes('下降')) {
        messages.push('📉 最近の成績が下がっています。勉強方法の改善をお勧めします。');
    }

    // 必要な点数の増加
    if (gap > 0) {
        const increasePerTest = Math.ceil(gap / 3);
        messages.push(`📌 あと3回の受験で目標達成するには、1回あたり${increasePerTest}点の向上が必要です。`);
    }

    return messages.map(msg => `<p>• ${msg}</p>`).join('');
}

function getComparisonAnalysis() {
    let html = '<h4 style="color: #667eea; margin-bottom: 10px;">📊 複数志望校の比較</h4>';

    // 平均点でランク付け
    const ranking = universities
        .map(uni => ({
            name: uni.name,
            target: uni.targetScore,
            avg: uni.scores.length > 0
                ? uni.scores.reduce((a, b) => a + b, 0) / uni.scores.length
                : 0,
            gap: uni.targetScore - (uni.scores.length > 0
                ? uni.scores.reduce((a, b) => a + b, 0) / uni.scores.length
                : uni.targetScore)
        }))
        .sort((a, b) => a.gap - b.gap);

    html += '<div style="margin-top: 10px;">';
    ranking.forEach((uni, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
        html += `
            <div style="padding: 8px 0; border-bottom: 1px solid #eee;">
                ${medal} <strong>${uni.name}</strong> - 
                不足点: ${Math.round(uni.gap * 10) / 10}点 
                (進捗: ${Math.round((uni.avg / uni.target) * 100) || 0}%)
            </div>
        `;
    });
    html += '</div>';

    return html;
}

// ============ localStorage への保存・読み込み ============

function saveData() {
    localStorage.setItem('universities', JSON.stringify(universities));
    localStorage.setItem('selectedUniversityId', selectedUniversityId);
}

function loadData() {
    const saved = localStorage.getItem('universities');
    if (saved) {
        universities = JSON.parse(saved);
    }

    const selected = localStorage.getItem('selectedUniversityId');
    if (selected) {
        selectedUniversityId = parseInt(selected);
    }
}
