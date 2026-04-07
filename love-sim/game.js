document.addEventListener('DOMContentLoaded', ()=>{
  // --- データ ---
  const characters = {
    aiko: { id:'aiko', name:'相良愛子', color:'#ff88b8', expressions:{ neutral:'assets/aiko_neutral.svg', happy:'assets/aiko_happy.svg', angry:'assets/aiko_angry.svg', sad:'assets/aiko_sad.svg' } },
    ren:  { id:'ren',  name:'佐藤蓮',   color:'#88b3ff', expressions:{ neutral:'assets/ren_neutral.svg', happy:'assets/ren_happy.svg', angry:'assets/ren_angry.svg', sad:'assets/ren_sad.svg' } }
  };

  const scenes = [
    { id:0, char:'aiko', text:'放課後、廊下で偶然会った愛子。話しかける？',
      choices:[
        { text:'笑顔で話しかける', next:1, affect:{aiko:+10} },
        { text:'挨拶だけして離れる', next:2, affect:{aiko:+3} }
      ]},

    { id:1, char:'aiko', text:'会話が弾み、愛子は共通の趣味の話題で目を輝かせた。どちらから深掘りする？',
      choices:[
        { text:'自分の好きな話を詳しく話す', next:3, affect:{aiko:+8}, expr:{aiko:'happy'} },
        { text:'相手の話をたくさん聞く', next:4, affect:{aiko:+6}, expr:{aiko:'neutral'} }
      ]},

    { id:2, char:'ren', text:'帰り道、偶然蓮と一緒になる。少し話をする？',
      choices:[
        { text:'話しかける', next:5, affect:{ren:+7} },
        { text:'気まずく立ち去る', next:6, affect:{ren:-3} }
      ]},

    { id:3, char:'aiko', text:'情熱的に語ったあなたに、愛子は感心してもっと知りたいと言った。誘いをどうする？',
      choices:[
        { text:'今度一緒に行こうかと誘う', next:7, affect:{aiko:+12}, expr:{aiko:'happy'} },
        { text:'軽く受け流す', next:6, affect:{aiko:-4}, expr:{aiko:'sad'} }
      ]},

    { id:4, char:'aiko', text:'相手の話を聞く姿勢に愛子は信頼を感じる。連絡先を交換しようか？',
      choices:[
        { text:'連絡先を交換する', next:7, affect:{aiko:+10} },
        { text:'まだタイミングが...', next:6, affect:{aiko:-2} }
      ]},

    { id:5, char:'ren', text:'蓮と話していると、趣味の話で意気投合した。次はどうする？',
      choices:[
        { text:'一緒に帰る約束をする', next:7, affect:{ren:+12}, expr:{ren:'happy'} },
        { text:'軽く別れる', next:6, affect:{ren:+2}, expr:{ren:'neutral'} }
      ]},

    { id:6, char:null, text:'その日は何事もなく過ぎていった。',
      choices:[
        { text:'続ける', next:0 }
      ]},

    { id:7, char:null, text:'時間が経ち、好感度や行動によって関係が進展する。エンディングを確認しますか？',
      choices:[
        { text:'エンディングを確認する', next:'ending' },
        { text:'もう少し続ける', next:0 }
      ]}
  ];

  // --- state ---
  const state = {
    scene:0,
    affection:{ aiko:0, ren:0 },
    expr: { aiko:'neutral', ren:'neutral' }
  };

  // --- DOM ---
  const sceneText = document.getElementById('sceneText');
  const choicesDiv = document.getElementById('choices');
  const portrait = document.getElementById('portrait');
  const charName = document.getElementById('charName');
  const affectionBar = document.getElementById('affection');
  const affectionVal = document.getElementById('affectionVal');
  const saveBtn = document.getElementById('saveBtn');
  const loadBtn = document.getElementById('loadBtn');
  const resetBtn = document.getElementById('resetBtn');
  const slotSelect = document.getElementById('slotSelect');
  const saveSlotBtn = document.getElementById('saveSlotBtn');
  const loadSlotBtn = document.getElementById('loadSlotBtn');
  const portraitImg = document.getElementById('portraitImg');

  // --- helper ---
  function setPortrait(charId){
    if(!charId){ portraitImg.classList.remove('visible'); charName.textContent='---'; updateAff(0); return; }
    const ch = characters[charId];
    const expr = state.expr[charId] || 'neutral';
    portraitImg.src = ch.expressions[expr];
    portraitImg.alt = ch.name + ' ' + expr;
    charName.textContent = ch.name;
    updateAff(state.affection[charId] || 0);
    // fade in
    requestAnimationFrame(()=> portraitImg.classList.add('visible'));
  }

  function updateAff(val){ affectionBar.value = Math.max(0,Math.min(100,val)); affectionVal.textContent = Math.round(val); }

  function saveGame(){ localStorage.setItem('love-sim-save', JSON.stringify(state)); alert('セーブしました'); }
  function loadGame(){ const raw = localStorage.getItem('love-sim-save'); if(!raw){ alert('セーブデータがありません'); return } try{ const s = JSON.parse(raw); state.scene = s.scene; state.affection = s.affection; render(); alert('ロードしました'); }catch(e){alert('ロード失敗');} }
  function resetGame(){ if(!confirm('本当にリセットしますか？')) return; state.scene=0; state.affection={aiko:0,ren:0}; localStorage.removeItem('love-sim-save'); render(); }

  // --- engine ---
  function applyAffect(aff){ if(!aff) return; for(const k in aff){ if(!(k in state.affection)) state.affection[k]=0; state.affection[k]+=aff[k]; state.affection[k]=Math.max(-50,Math.min(100,state.affection[k])); }}

  function choose(choice){ // handle next
    if(choice.affect) applyAffect(choice.affect);
    // handle expression changes attached to choice
    if(choice.expr){ for(const k in choice.expr){ state.expr[k] = choice.expr[k]; }}
    if(choice.next === 'ending'){ showEnding(); return; }
    state.scene = choice.next;
    render();
  }

  function showEnding(){
    const a = state.affection.aiko; const r = state.affection.ren; let text = '';
    // multiple endings logic using affection and recent expressions
    if(a >= 80) {
      text = `完全なハッピーエンド：愛子はあなたに深く惹かれ、二人は真剣に付き合い始めた。（好感度 ${a}）`;
    } else if(r >= 80) {
      text = `完全なハッピーエンド：蓮はあなたに深く惹かれ、二人は新しい関係へ。（好感度 ${r}）`;
    } else if(a >= 50 && a > r) {
      text = `好調ルート：愛子と関係が良好、恋の芽生えが見える。（愛子:${a}）`;
    } else if(r >= 50 && r > a) {
      text = `好調ルート：蓮と親密になった。今後に期待。（蓮:${r}）`;
    } else if(a <= 0 && r <= 0) {
      text = `バッドエンド：誰とも距離が縮まらなかった。日常に戻る。`;
    } else {
      // nuanced endings based on expression
      const ae = state.expr.aiko; const re = state.expr.ren;
      if(ae === 'sad' || re === 'sad') text = `悲しみのエンディング：どこか心に影が残ったまま。愛子:${a} 蓮:${r}`;
      else if(ae === 'angry' || re === 'angry') text = `波乱のエンディング：誤解やすれ違いが残った。愛子:${a} 蓮:${r}`;
      else text = `日常のエンディング：友情や淡い恋。これからに期待。愛子:${a} 蓮:${r}`;
    }
    sceneText.textContent = text;
    choicesDiv.innerHTML = '';
    const btn = document.createElement('button'); btn.textContent='タイトルへ戻る'; btn.className='choice-btn'; btn.addEventListener('click', ()=>{ state.scene=0; render(); }); choicesDiv.appendChild(btn);
    setPortrait(null);
  }

  // --- render ---
  // typing effect
  let typingTimer = null;
  function typeText(targetEl, text, cb){
    targetEl.classList.add('caret');
    targetEl.textContent = '';
    let i = 0;
    clearInterval(typingTimer);
    typingTimer = setInterval(()=>{
      targetEl.textContent += text.charAt(i);
      i++;
      if(i >= text.length){ clearInterval(typingTimer); targetEl.classList.remove('caret'); if(cb) cb(); }
    }, 18);
  }

  function render(){
    const sc = scenes.find(s=>s.id===state.scene);
    if(!sc){ sceneText.textContent='シーンが見つかりません'; return; }
    // portrait
    setPortrait(sc.char);
    // background subtle zoom
    const bg = document.querySelector('.scene-bg');
    if(bg) { bg.style.transform = `scale(${1 + (Math.random()*0.02)})`; }
    // text with typing
    typeText(sceneText, sc.text, ()=>{
      // after typing show choices with stagger
      choicesDiv.innerHTML = '';
      sc.choices.forEach((ch, idx)=>{
        const b = document.createElement('button'); b.className='choice-btn'; b.textContent = ch.text; b.addEventListener('click', ()=>{ choose(ch); });
        choicesDiv.appendChild(b);
        setTimeout(()=> b.classList.add('show'), 80 * idx + 100);
      });
    });
  }

  // --- save/load slots ---
  function saveSlot(slot){
    const key = `love-sim-save-slot-${slot}`;
    localStorage.setItem(key, JSON.stringify(state));
    alert(`スロット ${slot} にセーブしました`);
  }
  function loadSlot(slot){
    const key = `love-sim-save-slot-${slot}`;
    const raw = localStorage.getItem(key);
    if(!raw){ alert('そのスロットにセーブがありません'); return; }
    try{ const s = JSON.parse(raw); state.scene = s.scene; state.affection = s.affection; state.expr = s.expr || {aiko:'neutral', ren:'neutral'}; render(); alert(`スロット ${slot} をロードしました`); }catch(e){ alert('ロード失敗'); }
  }

  // --- bind ---
  saveBtn && saveBtn.addEventListener('click', ()=>{ saveSlot(1); });
  loadBtn && loadBtn.addEventListener('click', ()=>{ loadSlot(1); });
  resetBtn.addEventListener('click', resetGame);
  saveSlotBtn.addEventListener('click', ()=> saveSlot(slotSelect.value));
  loadSlotBtn.addEventListener('click', ()=> loadSlot(slotSelect.value));

  // start
  render();
});