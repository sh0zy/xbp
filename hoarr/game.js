// ゲーム状態
let gameState = {
    hp: 100,
    maxHp: 100,
    currentRoom: 'entrance',
    visitedRooms: [],
    hasGoldenKey: false,
    hasRedDoor: false,
    hasExit: false,
    fearLevel: 0,
    isSacred: false
};

// ストーリー内容
const rooms = {
    entrance: {
        name: '玄関',
        description: 'あなたは古い館の玄関に立っている。周りは真っ暗で、冷たい風が吹いている。前方には廊下が見える。',
        ghost: false,
        choices: [
            { text: '右手の部屋を探索する', next: 'livingRoom', danger: 10 },
            { text: '廊下をまっすぐ進む', next: 'hallway', danger: 15 },
            { text: '左手の部屋を見てみる', next: 'kitchen', danger: 5 }
        ]
    },
    livingRoom: {
        name: '居間',
        description: '大きな暖炉と古いソファが見える。壁には無数の肖像画が飾られており、目があなたを追い続けているようだ...',
        ghost: true,
        ghostChance: 0.7,
        choices: [
            { text: '縁起の良い十字架を手に取る', next: 'hallway', danger: 0, special: 'sacred' },
            { text: 'キャンドルを取る', next: 'hallway', danger: 10 },
            { text: '引き返す', next: 'entrance', danger: 5 }
        ]
    },
    hallway: {
        name: '廊下',
        description: '長い廊下が暗がりに消えている。時々何かが動く音が聞こえる。前方に赤い扉と青い扉が見える。',
        ghost: false,
        choices: [
            { text: '赤い扉を開ける', next: 'redDoor', danger: 30 },
            { text: '青い扉を開ける', next: 'blueDoor', danger: 20 },
            { text: '廊下の奥へ進む', next: 'basement', danger: 25 }
        ]
    },
    kitchen: {
        name: 'キッチン',
        description: '古い調理器具が散らばっている。冷蔵庫から不気味な音が聞こえる。テーブルの上に金色の鍵が輝いている。',
        ghost: false,
        choices: [
            { text: '金色の鍵を取る', next: 'hallway', danger: 5, special: 'goldenKey' },
            { text: 'すぐに出ていく', next: 'entrance', danger: 10 },
            { text: '冷蔵庫を開けてみる', next: 'fridgeRoom', danger: 40 }
        ]
    },
    blueDoor: {
        name: '青い部屋',
        description: '青い光に満たされた不思議な部屋。壁には奇妙な記号が書かれている。',
        ghost: true,
        ghostChance: 0.5,
        choices: [
            { text: '謎の光に近づく', next: 'lightRoom', danger: 35 },
            { text: '引き返す', next: 'hallway', danger: 15 },
            { text: '記号を調べる', next: 'symbolRoom', danger: 25 }
        ]
    },
    redDoor: {
        name: '赤い部屋',
        description: '赤く照らされた部屋。中央に鏡があり、あなたの姿が映っている。',
        ghost: true,
        ghostChance: 0.8,
        choices: [
            { text: '鏡を見つめる', next: 'mirrorRoom', danger: 50 },
            { text: '鏡を壊す', next: 'hallway', danger: 40 },
            { text: '素早く引き返す', next: 'hallway', danger: 10 }
        ]
    },
    basement: {
        name: '地下室',
        description: '地下室は湿った臭いで満ちている。天井からは水が滴り落ちている。',
        ghost: true,
        ghostChance: 0.6,
        choices: [
            { text: '暗い奥へ進む', next: 'secretRoom', danger: 45 },
            { text: '石の扉を調べる', next: 'stoneDoor', danger: 20 },
            { text: '上に戻る', next: 'hallway', danger: 5 }
        ]
    },
    fridgeRoom: {
        name: '冷蔵庫内部',
        description: '冷蔵庫の中は想像を絶する光景だった...。思わず悲鳴を上げてしまう。',
        ghost: true,
        ghostChance: 1.0,
        choices: [
            { text: '逃げる', next: 'kitchen', danger: 30 },
            { text: 'もっと深く...', next: 'nightmare', danger: 100 },
            { text: '這って脱出する', next: 'entrance', danger: 50 }
        ]
    },
    mirrorRoom: {
        name: '鏡の世界',
        description: '鏡の中から、別のあなたが出てきた...いや、それはあなたではない。',
        ghost: true,
        ghostChance: 0.95,
        choices: [
            { text: 'その存在に立ち向かう', next: 'confrontation', danger: 60 },
            { text: '逃げ出す', next: 'hallway', danger: 40 },
            { text: '十字架を使う', next: 'escape', danger: 5, needSacred: true }
        ]
    },
    lightRoom: {
        name: '光の部屋',
        description: '光は想像以上に強い。目が焼けそうだ...。',
        ghost: true,
        ghostChance: 0.7,
        choices: [
            { text: '目を開いたまま進む', next: 'revelation', danger: 35 },
            { text: '目をつぶる', next: 'hallway', danger: 15 },
            { text: '後ろに下がる', next: 'blueDoor', danger: 5 }
        ]
    },
    symbolRoom: {
        name: '記号の書斎',
        description: '壁に書かれた記号は次々と色が変わる。それはまるで何かを呼んでいるようだ...',
        ghost: true,
        ghostChance: 0.6,
        choices: [
            { text: '記号を触れてみる', next: 'gameOver', danger: 100 },
            { text: '逃げ出す', next: 'blueDoor', danger: 20 },
            { text: '冷静に観察する', next: 'hallway', danger: 0 }
        ]
    },
    stoneDoor: {
        name: '石の扉',
        description: '重い石の扉。金色の鍵穴がある。あなたは金色の鍵を持っているだろうか？',
        ghost: false,
        choices: [
            { text: '金色の鍵を使う', next: 'goldKey', danger: 0, needGoldenKey: true },
            { text: '力ずくで開ける', next: 'basement', danger: 20 },
            { text: '戻る', next: 'basement', danger: 0 }
        ]
    },
    secretRoom: {
        name: '秘密の部屋',
        description: '古い本や遺物で満ちた部屋。その中央には輝く宝物が...',
        ghost: false,
        choices: [
            { text: '宝物を手に取る', next: 'goldKey', danger: 10 },
            { text: '本を読む', next: 'knowledge', danger: 5 },
            { text: 'すぐに出る', next: 'basement', danger: 5 }
        ]
    },
    goldKey: {
        name: '金の扉',
        description: 'ついに出口が見つかった！金の扉が開き、外の光が見える。',
        ghost: false,
        ending: 'good',
        choices: [
            { text: '脱出する！', next: 'exit', danger: 0 }
        ]
    },
    knowledge: {
        name: '知識',
        description: 'あなたは館の秘密を學んだ。全てが明確になった...。出口に向かおう。',
        ghost: false,
        ending: 'good',
        choices: [
            { text: '脱出する', next: 'exit', danger: 0 }
        ]
    },
    revelation: {
        name: '啓示',
        description: 'あまりの光に目が開かずにいた。しかし、その時...あなたは館の真実を知った。',
        ghost: false,
        ending: 'good',
        choices: [
            { text: '脱出する', next: 'exit', danger: 0 }
        ]
    },
    confrontation: {
        name: '対峙',
        description: 'その存在とあなたが対峙した時、奇跡が起きた...！',
        ghost: true,
        ghostChance: 0.9,
        choices: [
            { text: '戦う', next: 'nightmare', danger: 80 },
            { text: '十字架を使う', next: 'escape', danger: 5, needSacred: true },
            { text: '逃げ出す', next: 'hallway', danger: 50 }
        ]
    },
    escape: {
        name: '光り輝く脱出',
        description: '十字架の光が館全体を照らした。その光に導かれて...',
        ghost: false,
        ending: 'good',
        choices: [
            { text: '館から抜け出す', next: 'exit', danger: 0 }
        ]
    },
    nightmare: {
        name: '悪夢',
        description: 'あなたの意識は夢と現実の境目に落ちていった...',
        ghost: true,
        ghostChance: 1.0,
        ending: 'bad',
        choices: [
            { text: '目が覚めない...', next: 'gameOver', danger: 100 }
        ]
    },
    exit: {
        name: '脱出成功',
        description: 'あなたは館から脱出した！明け方の光が顔に当たる。生き残ったんだ...',
        ghost: false,
        ending: 'good',
        choices: []
    },
    gameOver: {
        name: 'ゲームオーバー',
        description: 'あなたの意識は消えていった...',
        ghost: true,
        ghostChance: 1.0,
        ending: 'bad',
        choices: []
    }
};

// ゲーム開始
function startGame() {
    gameState = {
        hp: 100,
        maxHp: 100,
        currentRoom: 'entrance',
        visitedRooms: [],
        hasGoldenKey: false,
        hasRedDoor: false,
        hasExit: false,
        fearLevel: 0,
        isSacred: false
    };

    showScreen('gameScreen');
    displayRoom('entrance');
}

// スクリーン切り替え
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// 部屋を表示
function displayRoom(roomId) {
    gameState.currentRoom = roomId;
    gameState.visitedRooms.push(roomId);

    const room = rooms[roomId];

    document.getElementById('storyTitle').textContent = room.name;
    document.getElementById('storyText').textContent = room.description;
    document.getElementById('currentRoom').textContent = room.name;

    // 幽霊演出
    const ghostArea = document.getElementById('ghostArea');
    ghostArea.innerHTML = '';

    if (room.ghost && Math.random() < (room.ghostChance || 0.5)) {
        const ghost = document.createElement('div');
        ghost.className = 'ghost';
        ghost.textContent = '👻';
        ghostArea.appendChild(ghost);

        setTimeout(() => {
            ghost.classList.add('scare');
        }, 500);

        // HPダメージ
        const damage = Math.floor(Math.random() * 20) + 10;
        takeDamage(damage);
    }

    // 選択肢を表示
    const choiceButtons = [
        document.getElementById('choice1'),
        document.getElementById('choice2'),
        document.getElementById('choice3')
    ];

    choiceButtons.forEach((btn, index) => {
        if (index < room.choices.length) {
            const choice = room.choices[index];
            btn.textContent = choice.text;
            btn.style.display = 'block';
        } else {
            btn.style.display = 'none';
        }
    });

    // エンディング処理
    if (room.ending === 'good' && roomId === 'exit') {
        setTimeout(() => {
            showClear();
        }, 2000);
    } else if (room.ending === 'bad') {
        setTimeout(() => {
            showGameOver('館に呑み込まれてしまった...');
        }, 2000);
    }
}

// 選択処理
function makeChoice(choiceIndex) {
    const room = rooms[gameState.currentRoom];
    const choice = room.choices[choiceIndex];

    if (!choice) return;

    // 必要なアイテムチェック
    if (choice.needGoldenKey && !gameState.hasGoldenKey) {
        takeDamage(50);
        alert('鍵が必要だ！');
        return;
    }

    if (choice.needSacred && !gameState.isSacred) {
        takeDamage(30);
        alert('何か聖なるものが必要だ...');
        return;
    }

    // 特殊アイテム取得
    if (choice.special === 'goldenKey') {
        gameState.hasGoldenKey = true;
    }
    if (choice.special === 'sacred') {
        gameState.isSacred = true;
    }

    // ダメージ処理
    if (choice.danger > 0) {
        const actualDamage = Math.floor(choice.danger * (0.8 + Math.random() * 0.4));
        takeDamage(actualDamage);
    }

    // 次の部屋を表示
    if (choice.next === 'gameOver' || gameState.hp <= 0) {
        showGameOver('恐怖に耐えきれなかった...');
    } else {
        displayRoom(choice.next);
    }
}

// ダメージ処理
function takeDamage(amount) {
    gameState.hp -= amount;
    if (gameState.hp < 0) gameState.hp = 0;

    updateHealthBar();

    if (gameState.hp <= 0) {
        showGameOver('心が折れてしまった...');
    }
}

// ヘルスバー更新
function updateHealthBar() {
    const healthPercent = (gameState.hp / gameState.maxHp) * 100;
    document.getElementById('healthFill').style.width = healthPercent + '%';
    document.getElementById('hpValue').textContent = gameState.hp;
}

// ゲームオーバー表示
function showGameOver(message) {
    document.getElementById('gameOverTitle').textContent = '館に封じ込められた';
    document.getElementById('gameOverMessage').textContent = message;
    showScreen('gameOverScreen');
}

// クリア表示
function showClear() {
    const message = `あなたの最終HP: ${gameState.hp}\n\n訪れた場所: ${gameState.visitedRooms.length}個\n十字架を手に入れた: ${gameState.isSacred ? 'はい' : 'いいえ'}\n\n無事に館から脱出できました。`;
    document.getElementById('clearMessage').textContent = message;
    showScreen('clearScreen');
}

// タイトル画面に戻る
function backToTitle() {
    gameState = {
        hp: 100,
        maxHp: 100,
        currentRoom: 'entrance',
        visitedRooms: [],
        hasGoldenKey: false,
        hasRedDoor: false,
        hasExit: false,
        fearLevel: 0,
        isSacred: false
    };
    showScreen('titleScreen');
}

// 初期状態の表示
window.addEventListener('DOMContentLoaded', () => {
    showScreen('titleScreen');
});
