class Game {
  constructor() {
    this.tile = 32;
    this.canvas = document.getElementById('map');
    this.ctx = this.canvas.getContext('2d');
    this.map = [
      '############################',
      '#..............E...........#',
      '#..####.....###......##....#',
      '#..#..#...........E..#....#',
      '#..#..####..............#.#',
      '#..#......#..#######....#.#',
      '#.....P....#..............#',
      '#..........#....E.........#',
      '############################'
    ];
    this.player = { x:6, y:6, hp:20, lv:1, exp:0, items:[] };
    this.maxHp = 20;
    this.xpToLevel = 10;
    this.logEl = document.getElementById('log');
    this.itemsEl = document.getElementById('items');
    this.hpEl = document.getElementById('hp');
    this.lvEl = document.getElementById('lv');
    this.questTitleEl = document.getElementById('questTitle');
    this.questProgressEl = document.getElementById('questProgress');
    this.battleEl = document.getElementById('battle');
    this.enemyHpEl = document.getElementById('enemyHp');
    this.init();
  }

  init() {
    window.addEventListener('keydown', e => this.onKey(e));
    document.getElementById('save')?.addEventListener('click', ()=>this.save());
    document.getElementById('load')?.addEventListener('click', ()=>this.load());
    // save/load slots
    document.querySelectorAll('.saveSlot').forEach(b=>b.addEventListener('click', e=>this.saveSlot(Number(e.currentTarget.dataset.slot))));
    document.querySelectorAll('.loadSlot').forEach(b=>b.addEventListener('click', e=>this.loadSlot(Number(e.currentTarget.dataset.slot))));
    // refresh slot timestamps on start
    this.refreshSlotTimes();
    document.getElementById('btnAttack').addEventListener('click', ()=>this.playerAttack());
    document.getElementById('btnUse').addEventListener('click', ()=>this.useItem());
    document.getElementById('btnRun').addEventListener('click', ()=>this.attemptRun());
    this.draw();
    this.log('ゲーム開始');
  }

  draw() {
    const ctx = this.ctx; const t = this.tile;
    ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    for (let y=0;y<this.map.length;y++){
      for (let x=0;x<this.map[y].length;x++){
        const c = this.map[y][x];
        if (c === '#') { ctx.fillStyle='#666'; ctx.fillRect(x*t,y*t,t,t); }
        else if (c === 'E') { ctx.fillStyle='#c33'; ctx.fillRect(x*t+4,y*t+4,t-8,t-8); }
        else { ctx.fillStyle='#223'; ctx.fillRect(x*t,y*t,t,t); }
      }
    }
    // player
    ctx.fillStyle = '#0f0';
    ctx.fillRect(this.player.x*t+6,this.player.y*t+6,t-12,t-12);
    this.updateHUD();
  }

  onKey(e){
    const key = e.key;
    const dir = {ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]}[key];
    if(!dir) return;
    const nx = this.player.x + dir[0];
    const ny = this.player.y + dir[1];
    if (this.isWalkable(nx,ny)){
      const tile = this.map[ny][nx];
      if (tile === 'E') { this.startBattle(nx,ny); }
      else { this.player.x = nx; this.player.y = ny; this.draw(); }
    } else {
      this.log('ここには行けない。');
    }
  }

  isWalkable(x,y){
    if (y<0||y>=this.map.length) return false;
    if (x<0||x>=this.map[y].length) return false;
    return this.map[y][x] !== '#';
  }

  startBattle(x,y){
    this.log('敵と遭遇！戦闘開始');
    this.inBattle = true;
    this.battlePos = {x,y};
    this.enemy = { hp: 8 + Math.floor(Math.random()*7) };
    this.enemyHpEl.textContent = this.enemy.hp;
    this.battleEl.classList.remove('hidden');
  }

  playerAttack(){
    if (!this.inBattle) return;
    const pAtk = 2 + Math.floor(Math.random()*4);
    this.enemy.hp -= pAtk;
    this.log(`あなたの攻撃：-${pAtk}（敵残り${Math.max(0,this.enemy.hp)}）`);
    this.enemyHpEl.textContent = Math.max(0,this.enemy.hp);
    if (this.enemy.hp <= 0){ this.onEnemyDefeated(); return; }
    this.enemyTurn();
  }

  enemyTurn(){
    const eAtk = 1 + Math.floor(Math.random()*4);
    this.player.hp -= eAtk;
    this.log(`敵の攻撃：-${eAtk}（あなたのHP ${Math.max(0,this.player.hp)}）`);
    if (this.player.hp <= 0){ this.player.hp = 0; this.endBattleWithDeath(); }
    this.updateHUD();
  }

  onEnemyDefeated(){
    this.log('敵を倒した！');
    this.player.exp += 5;
    if (Math.random()<0.1) { this.player.items.push('ポーション'); this.log('ポーションを手に入れた'); }
    // クエスト進行
    this.player.quest = this.player.quest || {kill:0};
    this.player.quest.kill += 1;
    this.questProgressEl.textContent = this.player.quest.kill;
    if (this.player.quest.kill >= 3){ this.log('クエスト達成！報酬を獲得'); this.player.items.push('報酬箱'); this.player.quest.kill = 0; }
    // マップ上の敵を消す
    const {x,y} = this.battlePos; this.setMapTile(x,y,'.');
    // 位置移動
    this.player.x = x; this.player.y = y;
    this.endBattle();
    this.checkLevelUp();
  }

  endBattle(){
    this.inBattle = false;
    this.enemy = null;
    this.battleEl.classList.add('hidden');
    this.draw();
  }

  endBattleWithDeath(){
    this.log('あなたは倒れた...ロードしてやり直してください');
    this.endBattle();
  }

  attemptRun(){
    if (!this.inBattle) return;
    if (Math.random() < 0.5){ this.log('逃げ切った！'); this.endBattle(); }
    else { this.log('逃げられなかった！'); this.enemyTurn(); }
  }

  useItem(){
    if (!this.inBattle) return;
    const idx = this.player.items.indexOf('ポーション');
    if (idx === -1){ this.log('使えるアイテムがない'); return; }
    this.player.items.splice(idx,1);
    this.player.hp += 8; if (this.player.hp > 999) this.player.hp = 999;
    this.log('ポーションを使用。HPが回復した');
    this.updateHUD();
    this.enemyTurn();
  }

  setMapTile(x,y,ch){
    const row = this.map[y].split(''); row[x]=ch; this.map[y]=row.join('');
  }

  checkLevelUp(){
    if (this.player.exp >= this.xpToLevel){ this.player.lv +=1; this.player.exp = 0; this.player.maxHp = (this.player.maxHp || this.maxHp) + 5; this.player.hp = Math.min(this.player.hp + 5, this.player.maxHp); this.log('レベルアップ！'); }
  }

  save(){
    const data = {player:this.player,map:this.map};
    localStorage.setItem('rpg_save', JSON.stringify(data));
    this.log('セーブしました');
  }

  load(){
    const raw = localStorage.getItem('rpg_save');
    if (!raw) { this.log('セーブが見つかりません'); return; }
    const data = JSON.parse(raw);
    this.player = data.player; this.map = data.map;
    this.log('ロードしました');
    this.draw();
  }

  saveSlot(n){
    const key = `rpg_save_${n}`;
    const now = new Date().toISOString();
    const data = {player:this.player,map:this.map, meta:{ savedAt: now }};
    localStorage.setItem(key, JSON.stringify(data));
    this.log(`セーブ${n}に保存しました`);
    this.setSlotTimeDisplay(n, now);
  }

  loadSlot(n){
    const key = `rpg_save_${n}`;
    const raw = localStorage.getItem(key);
    if (!raw) { this.log(`セーブ${n}が見つかりません`); return; }
    const data = JSON.parse(raw);
    this.player = data.player; this.map = data.map;
    this.log(`セーブ${n}をロードしました`);
    this.draw();
  }

  formatTime(iso){
    try { return new Date(iso).toLocaleString(); } catch(e){ return iso; }
  }

  setSlotTimeDisplay(n, iso){
    const el = document.getElementById(`slotTime${n}`);
    if (!el) return;
    el.textContent = this.formatTime(iso);
  }

  refreshSlotTimes(){
    for (let i=1;i<=3;i++){
      const key = `rpg_save_${i}`;
      const raw = localStorage.getItem(key);
      if (!raw) { this.setSlotTimeDisplay(i, '—'); continue; }
      try { const data = JSON.parse(raw); const t = data.meta?.savedAt || '—'; this.setSlotTimeDisplay(i, t); } catch(e){ this.setSlotTimeDisplay(i, '—'); }
    }
  }

  updateHUD(){
    this.hpEl.textContent = this.player.hp;
    this.lvEl.textContent = this.player.lv;
    this.itemsEl.innerHTML = '';
    for (const it of this.player.items){ const li=document.createElement('li'); li.textContent=it; this.itemsEl.appendChild(li); }
  }

  log(txt){
    const p = document.createElement('div'); p.textContent = txt; this.logEl.appendChild(p); this.logEl.scrollTop = this.logEl.scrollHeight;
  }
}

window.addEventListener('load', ()=>{ window.game = new Game(); });
