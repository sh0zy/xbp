import type { DialogueData } from './types';

export const dialogues: Record<string, DialogueData> = {
  opening: {
    id: 'opening',
    lines: [
      { speakerId: 'minato', expression: 'worried', mode: 'phone', text: 'まだ大学？終電なくなるぞ' },
      { speakerId: 'player', expression: 'neutral', text: 'レポートのデータだけ取ってすぐ帰る。' },
      { speakerId: 'player', expression: 'worried', text: '門、開いてる。警備員もいない。' },
      { speakerId: 'absentee', expression: 'hidden', mode: 'anomaly', important: true, text: '……まだ、出席していない。' },
    ],
  },
  gate_notice: {
    id: 'gate_notice',
    lines: [
      { speakerId: 'player', expression: 'worried', text: '掲示板の文字、下だけ手書きだ。誰がこんな時間に。' },
    ],
  },
  enter_campus: {
    id: 'enter_campus',
    lines: [
      { speakerId: 'player', expression: 'neutral', text: '1号館のPC室に向かおう。データを取ったらすぐ帰る。' },
    ],
  },
  lecture_blackboard: {
    id: 'lecture_blackboard',
    lines: [
      { speakerId: 'player', expression: 'shocked', text: '誰もいないのに、出席確認音が鳴った。' },
      { speakerId: 'absentee', expression: 'hidden', mode: 'anomaly', important: true, text: '本日の欠席者……1名。' },
    ],
  },
  pc_unlocked: {
    id: 'pc_unlocked',
    lines: [
      { speakerId: 'player', expression: 'worried', text: 'ログインできた。でも、未送信メールの送信者が僕になっている。' },
      { speakerId: 'yu', expression: 'hidden', mode: 'record', text: '見たなら、言って。' },
    ],
  },
  chase_intro: {
    id: 'chase_intro',
    lines: [
      { speakerId: 'player', expression: 'scared', text: '廊下の奥に、人影がいる。さっきまで、誰もいなかった。' },
      { speakerId: 'absentee', expression: 'glitched', mode: 'anomaly', important: true, text: '出席……確認……' },
    ],
  },
  ch1_clear: {
    id: 'ch1_clear',
    lines: [
      { speakerId: 'minato', expression: 'worried', mode: 'phone', text: '今、電話した？声が二重に聞こえた' },
      { speakerId: 'player', expression: 'silent', text: '僕は電話なんてしていない。' },
    ],
  },
  library_entry: {
    id: 'library_entry',
    lines: [
      { speakerId: 'player', expression: 'worried', text: '図書館の時計だけが動いている。どの針も、23:58に戻ろうとしているみたいだ。' },
    ],
  },
  b23_found: {
    id: 'b23_found',
    lines: [
      { speakerId: 'librarian', expression: 'worried', mode: 'record', text: 'B-23。あの棚は閉館後にだけ番号が増えます。' },
      { speakerId: 'player', expression: 'shocked', text: '本の背表紙が、僕の名前を読もうとしている。' },
    ],
  },
  clock_opened: {
    id: 'clock_opened',
    lines: [
      { speakerId: 'player', expression: 'worried', text: '返却ポストが開いた。中から鍵と、冷たい空気が出てくる。' },
      { speakerId: 'absentee', expression: 'hidden', mode: 'anomaly', text: '返して。席を。名前を。' },
    ],
  },
  hide_event: {
    id: 'hide_event',
    lines: [
      { speakerId: 'player', expression: 'scared', text: '書架の間で足音が反響している。走ったら、近づいてくる。' },
      { speakerId: 'librarian', expression: 'scared', mode: 'record', text: '光のある机の下に隠れて。息を短く。記録は音を拾う。' },
    ],
  },
  ch2_clear: {
    id: 'ch2_clear',
    lines: [
      { speakerId: 'minato', expression: 'glitched', mode: 'phone', text: '地下へ行くな。いや、行かないと██が戻らない' },
      { speakerId: 'player', expression: 'worried', text: 'ミナトのメッセージじゃない。けど、送信元はミナトだ。' },
    ],
  },
  affairs_entry: {
    id: 'affairs_entry',
    lines: [
      { speakerId: 'clerk', expression: 'silent', text: '学生課は閉まっています。閉まっています。閉まっています。' },
      { speakerId: 'player', expression: 'worried', text: '同じ声が、蛍光灯のちらつきに合わせて繰り返される。' },
    ],
  },
  camera_sorted: {
    id: 'camera_sorted',
    lines: [
      { speakerId: 'player', expression: 'shocked', text: '映像がつながった。僕は屋上前で、あの人を見ていた。' },
      { speakerId: 'yu', expression: 'silent', mode: 'record', important: true, text: '見ていたなら、覚えているはずだ。' },
    ],
  },
  safe_opened: {
    id: 'safe_opened',
    lines: [
      { speakerId: 'clerk', expression: 'hidden', text: '保管庫は出席者だけに開きます。あなたは、どちらですか。' },
      { speakerId: 'player', expression: 'silent', text: '答えられない。' },
    ],
  },
  stealth_warning: {
    id: 'stealth_warning',
    lines: [
      { speakerId: 'player', expression: 'worried', text: '職員用廊下に影が巡回している。走る音を立てない方がいい。' },
    ],
  },
  ch3_clear: {
    id: 'ch3_clear',
    lines: [
      { speakerId: 'minato', expression: 'glitched', mode: 'phone', text: '同じゼミだったろ。お前、覚えてるだろ' },
      { speakerId: 'player', expression: 'scared', text: 'その言い方は、ミナトじゃない。' },
    ],
  },
  basement_entry: {
    id: 'basement_entry',
    lines: [
      { speakerId: 'player', expression: 'worried', text: '地下は停電している。懐中電灯の光だけが、壁に古い掲示物を浮かせている。' },
    ],
  },
  breaker_on: {
    id: 'breaker_on',
    lines: [
      { speakerId: 'player', expression: 'shocked', text: '電気が戻った瞬間、掲示板の写真が全部こちらを向いた。' },
    ],
  },
  photo_restored: {
    id: 'photo_restored',
    lines: [
      { speakerId: 'yu', expression: 'restored', mode: 'record', important: true, text: '榊ユウ。それが、消された名前。' },
      { speakerId: 'player', expression: 'silent', text: '知っている名前だ。知っていたはずの名前だ。' },
    ],
  },
  big_chase: {
    id: 'big_chase',
    lines: [
      { speakerId: 'absentee', expression: 'glitched', mode: 'anomaly', important: true, text: '覚えて。覚えて。覚えて。' },
      { speakerId: 'player', expression: 'scared', text: '非常階段まで逃げるしかない。' },
    ],
  },
  ch4_clear: {
    id: 'ch4_clear',
    lines: [
      { speakerId: 'player', expression: 'silent', text: '僕はあの夜、屋上前で榊ユウを見ていた。なのに、誰にも言わなかった。' },
    ],
  },
  final_entry: {
    id: 'final_entry',
    lines: [
      { speakerId: 'player', expression: 'tired', text: '屋上前の扉が、教室の扉に変わっている。' },
      { speakerId: 'absentee', expression: 'hidden', mode: 'anomaly', text: '最後の出席確認を始めます。' },
    ],
  },
  final_correct: {
    id: 'final_correct',
    lines: [
      { speakerId: 'player', expression: 'silent', text: '榊ユウ。' },
      { speakerId: 'yu', expression: 'restored', important: true, text: '……やっと呼ばれた。' },
    ],
  },
  ending_a_hint: {
    id: 'ending_a_hint',
    lines: [
      { speakerId: 'player', expression: 'worried', text: '名前はわからない。これ以上、ここにいられない。' },
    ],
  },
};
