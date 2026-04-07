// フォーム入力の監視
const inputs = document.querySelectorAll('input, textarea');
inputs.forEach(input => {
    input.addEventListener('change', generateApp);
    input.addEventListener('keyup', () => {
        if (input.id === 'appName' || input.id === 'customTitle' || input.id === 'customText' || input.id === 'customButton') {
            generateApp();
        }
    });
});

// 生成されたアプリのコード
let generatedCode = '';

// アプリ生成関数
function generateApp() {
    const appName = document.getElementById('appName').value || 'My App';
    const appDescription = document.getElementById('appDescription').value || '';
    const appColor = document.getElementById('appColor').value || '#3498db';
    
    const features = {
        counter: document.getElementById('featureCounter').checked,
        timer: document.getElementById('featureTimer').checked,
        calc: document.getElementById('featureCalc').checked,
        notePad: document.getElementById('featureNotePad').checked,
        quiz: document.getElementById('featureQuiz').checked,
        todo: document.getElementById('featureTodo').checked
    };

    const custom = {
        title: document.getElementById('customTitle').value || appName,
        text: document.getElementById('customText').value || appDescription,
        button: document.getElementById('customButton').value || 'Button'
    };

    // HTMLコード生成
    generatedCode = generateHTML(appName, appColor, features, custom);

    // プレビュー表示
    const preview = document.getElementById('preview');
    const doc = preview.contentDocument || preview.contentWindow.document;
    doc.open();
    doc.write(generatedCode);
    doc.close();
}

// HTML生成関数
function generateHTML(appName, appColor, features, custom) {
    let html = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(appName)}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, ${appColor}22 0%, ${appColor}11 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
        }

        header {
            text-align: center;
            margin-bottom: 30px;
        }

        header h1 {
            color: ${appColor};
            font-size: 2.5em;
            margin-bottom: 10px;
            text-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        header p {
            color: #666;
            font-size: 1em;
        }

        .panel {
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
        }

        .panel h2 {
            color: ${appColor};
            margin-bottom: 20px;
            font-size: 1.5em;
        }

        .content {
            color: #333;
            line-height: 1.6;
            white-space: pre-wrap;
            word-wrap: break-word;
            margin-bottom: 20px;
        }

        .feature-section {
            margin: 20px 0;
            padding: 15px;
            background: ${appColor}11;
            border-left: 4px solid ${appColor};
            border-radius: 5px;
        }

        .feature-section h3 {
            color: ${appColor};
            margin-bottom: 10px;
        }

        button {
            background: linear-gradient(135deg, ${appColor} 0%, ${adjustColor(appColor, -20)} 100%);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 6px;
            font-size: 1em;
            cursor: pointer;
            transition: all 0.3s;
            width: 100%;
            margin-bottom: 10px;
            font-weight: 600;
        }

        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        button:active {
            transform: translateY(0);
        }

        .input-group {
            margin-bottom: 15px;
        }

        input, textarea {
            width: 100%;
            padding: 10px;
            border: 2px solid #e0e0e0;
            border-radius: 5px;
            font-family: inherit;
            transition: border-color 0.3s;
        }

        input:focus, textarea:focus {
            outline: none;
            border-color: ${appColor};
        }

        textarea {
            min-height: 100px;
            resize: vertical;
        }

        .result {
            background: ${appColor}22;
            border: 2px solid ${appColor};
            border-radius: 5px;
            padding: 15px;
            margin-top: 10px;
            color: #333;
            font-size: 1.1em;
            font-weight: bold;
        }

        .note {
            background: #fff9c4;
            border-left: 4px solid #fbc02d;
            padding: 15px;
            border-radius: 5px;
            margin: 10px 0;
        }

        .todo-item {
            display: flex;
            align-items: center;
            padding: 10px;
            background: #f5f5f5;
            border-radius: 5px;
            margin: 5px 0;
        }

        .todo-item input {
            margin-right: 10px;
            width: auto;
        }

        .timer-display {
            font-size: 3em;
            text-align: center;
            color: ${appColor};
            font-weight: bold;
            margin: 20px 0;
            font-family: 'Courier New', monospace;
        }

        .timer-controls {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }

        .timer-controls button {
            margin-bottom: 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>${escapeHtml(appName)}</h1>
            <p>${escapeHtml(custom.title)}</p>
        </header>

        <div class="panel">`;

    // カスタムテキスト表示
    if (custom.text) {
        html += `<p class="content">${escapeHtml(custom.text)}</p>`;
    }

    // 機能セクション
    if (features.counter) {
        html += `
        <div class="feature-section">
            <h3>🔢 カウンター</h3>
            <div style="text-align: center;">
                <div class="result" id="counter">0</div>
                <button onclick="document.getElementById('counter').textContent = parseInt(document.getElementById('counter').textContent) + 1">カウント +</button>
                <button onclick="document.getElementById('counter').textContent = parseInt(document.getElementById('counter').textContent) - 1">- 減らす</button>
                <button onclick="document.getElementById('counter').textContent = 0">🔄 リセット</button>
            </div>
        </div>`;
    }

    if (features.timer) {
        html += `
        <div class="feature-section">
            <h3>⏱️ タイマー</h3>
            <div class="timer-display" id="timerDisplay">00:00</div>
            <div class="input-group">
                <input type="number" id="timerInput" placeholder="秒数を入力" min="1" value="60">
            </div>
            <div class="timer-controls">
                <button onclick="startTimer()">▶ 開始</button>
                <button onclick="stopTimer()">⏸ 停止</button>
                <button onclick="resetTimer()">🔄 リセット</button>
            </div>
        </div>
        <script>
            let timerInterval;
            let timerTime = 0;
            
            function startTimer() {
                let seconds = parseInt(document.getElementById('timerInput').value) || 60;
                timerTime = seconds;
                clearInterval(timerInterval);
                
                timerInterval = setInterval(() => {
                    timerTime--;
                    let mins = Math.floor(timerTime / 60);
                    let secs = timerTime % 60;
                    document.getElementById('timerDisplay').textContent = 
                        String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
                    
                    if (timerTime <= 0) {
                        clearInterval(timerInterval);
                        alert('時間です！');
                    }
                }, 1000);
            }
            
            function stopTimer() {
                clearInterval(timerInterval);
            }
            
            function resetTimer() {
                clearInterval(timerInterval);
                document.getElementById('timerDisplay').textContent = '00:00';
            }
        </script>`;
    }

    if (features.calc) {
        html += `
        <div class="feature-section">
            <h3>🧮 計算機</h3>
            <div class="input-group">
                <input type="number" id="num1" placeholder="数値1">
            </div>
            <div class="input-group">
                <input type="number" id="num2" placeholder="数値2">
            </div>
            <button onclick="calc('+')">➕ 足し算</button>
            <button onclick="calc('-')">➖ 引き算</button>
            <button onclick="calc('*')">✖️ 掛け算</button>
            <button onclick="calc('/')">➗ 割り算</button>
            <div class="result" id="calcResult">結果</div>
        </div>
        <script>
            function calc(op) {
                const num1 = parseFloat(document.getElementById('num1').value) || 0;
                const num2 = parseFloat(document.getElementById('num2').value) || 0;
                let result;
                
                switch(op) {
                    case '+': result = num1 + num2; break;
                    case '-': result = num1 - num2; break;
                    case '*': result = num1 * num2; break;
                    case '/': result = num2 !== 0 ? num1 / num2 : 'エラー'; break;
                }
                
                document.getElementById('calcResult').textContent = result;
            }
        </script>`;
    }

    if (features.notePad) {
        html += `
        <div class="feature-section">
            <h3>📝 メモ帳</h3>
            <div class="input-group">
                <textarea id="noteArea" placeholder="メモを入力..."></textarea>
            </div>
            <button onclick="saveNote()">💾 保存</button>
            <button onclick="clearNote()">🗑️ クリア</button>
            <div class="note" id="noteDisplay">保存されたメモはここに表示されます</div>
        </div>
        <script>
            function saveNote() {
                const text = document.getElementById('noteArea').value;
                localStorage.setItem('note', text);
                document.getElementById('noteDisplay').textContent = text || 'empty';
            }
            
            function clearNote() {
                document.getElementById('noteArea').value = '';
                document.getElementById('noteDisplay').textContent = 'cleared';
            }
            
            window.addEventListener('load', () => {
                const saved = localStorage.getItem('note');
                if (saved) {
                    document.getElementById('noteArea').value = saved;
                    document.getElementById('noteDisplay').textContent = saved;
                }
            });
        </script>`;
    }

    if (features.quiz) {
        html += `
        <div class="feature-section">
            <h3>❓ クイズ</h3>
            <div class="input-group">
                <textarea id="question" placeholder="質問を入力..."></textarea>
            </div>
            <div class="input-group">
                <input type="text" id="answer" placeholder="答え">
            </div>
            <button onclick="checkAnswer()">✅ 確認</button>
            <div class="result" id="quizResult">結果</div>
        </div>
        <script>
            function checkAnswer() {
                const answer = document.getElementById('answer').value.toLowerCase().trim();
                const correct = 'yes';
                
                if (answer === correct) {
                    document.getElementById('quizResult').textContent = '🎉 正解！';
                } else {
                    document.getElementById('quizResult').textContent = '❌ 不正解';
                }
            }
        </script>`;
    }

    if (features.todo) {
        html += `
        <div class="feature-section">
            <h3>✅ TODOリスト</h3>
            <div class="input-group">
                <input type="text" id="todoInput" placeholder="タスクを入力...">
            </div>
            <button onclick="addTodo()">➕ 追加</button>
            <div id="todoList" style="margin-top: 15px;"></div>
        </div>
        <script>
            function addTodo() {
                const input = document.getElementById('todoInput').value;
                if (!input) return;
                
                const list = document.getElementById('todoList');
                const item = document.createElement('div');
                item.className = 'todo-item';
                item.innerHTML = '<input type="checkbox"> <span>' + input + '</span>';
                list.appendChild(item);
                
                document.getElementById('todoInput').value = '';
            }
        </script>`;
    }

    html += `
            <div style="margin-top: 20px;">
                <button onclick="alert('${escapeHtml(custom.button)}')">${escapeHtml(custom.button)}</button>
            </div>
        </div>
    </div>
</body>
</html>`;

    return html;
}

// HTML エスケープ関数
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// 色調整関数（ダークシェード作成）
function adjustColor(color, amount) {
    const usePound = color[0] === "#";
    const col = usePound ? color.slice(1) : color;
    const num = parseInt(col, 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return (usePound ? "#" : "") + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
}

// コードダウンロード
function downloadCode() {
    if (!generatedCode) {
        alert('先にアプリを生成してください');
        return;
    }

    const appName = document.getElementById('appName').value || 'app';
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(generatedCode));
    element.setAttribute('download', `${appName}.html`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// 新しいタブでプレビューを開く
function openPreviewInNewTab() {
    if (!generatedCode) {
        alert('先にアプリを生成してください');
        return;
    }

    const newWindow = window.open();
    newWindow.document.write(generatedCode);
    newWindow.document.close();
}

// フォームリセット
function resetForm() {
    document.getElementById('appName').value = 'マイアプリ';
    document.getElementById('appDescription').value = '便利なツールです';
    document.getElementById('appColor').value = '#3498db';
    document.getElementById('customTitle').value = '';
    document.getElementById('customText').value = '';
    document.getElementById('customButton').value = 'Button';
    
    document.getElementById('featureCounter').checked = true;
    document.getElementById('featureTimer').checked = false;
    document.getElementById('featureCalc').checked = false;
    document.getElementById('featureNotePad').checked = false;
    document.getElementById('featureQuiz').checked = false;
    document.getElementById('featureTodo').checked = false;

    generateApp();
}

// 初期化
window.addEventListener('load', () => {
    generateApp();
});
