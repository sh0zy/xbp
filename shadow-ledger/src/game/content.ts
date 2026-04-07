import { CHASE_MAX_DISTANCE } from "./constants";
import type {
  ChaseState,
  DialogueEntry,
  EndingType,
  Item,
  JournalEntry,
  MapDefinition,
  SceneEvent
} from "./types";

export const ITEMS: Record<Item["id"], Item> = {
  "visitor-pass": {
    id: "visitor-pass",
    name: "来訪者パス",
    description: "湿ったプラスチックの入館証。",
    detail: "裏面に赤いペンで「413」とだけ書かれている。書類室の電子錠と同じ数字配列に見える。",
    tag: "key"
  },
  "ward-key": {
    id: "ward-key",
    name: "西病棟の鍵",
    description: "真鍮の小さな鍵。",
    detail: "キーホルダーには「West Ward」と掠れた刻印。冷え切っているのに、指に貼りつく。",
    tag: "key"
  },
  "prayer-slip": {
    id: "prayer-slip",
    name: "濡れた護符",
    description: "祈りの文句がにじんだ紙片。",
    detail: "折り目の奥に、凪の字で「呼び戻すな。閉じろ」と走り書きがある。",
    tag: "ritual"
  },
  "rosary-beads": {
    id: "rosary-beads",
    name: "数珠",
    description: "古い消毒液の匂いが残る。",
    detail: "玉のいくつかが擦り減っている。誰かが何度も指で数えた形だ。",
    tag: "tool"
  },
  "patient-tag": {
    id: "patient-tag",
    name: "患者タグ 072",
    description: "金属製のネームタグ。",
    detail: "裏側に「移送済」と刻まれている。けれど表の番号だけは何度削っても消えなかったらしい。",
    tag: "record"
  },
  "ledger-fragment": {
    id: "ledger-fragment",
    name: "黒い帳簿の切れ端",
    description: "水を吸った紙片。",
    detail: "署名欄だけが丁寧に切り取られている。残った行には、あなたの生年月日がある。",
    tag: "record"
  }
};

export const JOURNALS: Record<JournalEntry["id"], JournalEntry> = {
  "voicemail-transcript": {
    id: "voicemail-transcript",
    title: "留守電の書き起こし",
    category: "recording",
    excerpt: "……ちょうぼを、とじて。わたしのなまえを、まだ……。",
    pages: [
      "03:17 / 発信元不明\n\nノイズと水音のあいだに、女の声がまぎれている。\n『帳簿を閉じて。まだ、わたしの名前を思い出せるうちに』",
      "音声解析メモ\n\n発話者の声紋は有沢凪と一致。\nただし本人は八年前、月ヶ瀬診療棟の事故で死亡扱い。"
    ]
  },
  "patient-list": {
    id: "patient-list",
    title: "隔離患者一覧",
    category: "list",
    excerpt: "072 の欄だけ赤丸。備考に「転記先あり」。",
    pages: [
      "隔離患者一覧 / 旧西病棟\n\n013　入眠時に水音を訴える\n041　鏡面に話しかける\n072　夜間移送 / 転記先あり\n108　氏名欠落\n",
      "欄外メモ\n\n『タグ 072 は薬品庫へ。帳簿の参照前に返却すること』\n書いた人の名字だけが滲んで読めない。"
    ]
  },
  "accident-report": {
    id: "accident-report",
    title: "事故報告書 抜粋",
    category: "report",
    excerpt: "地下の止水弁を閉めるより先に、記録簿の回収が命じられた。",
    pages: [
      "事故報告書 第四版 / 非公開\n\n六月二十七日 21:14、地下処置室の水槽配管が破断。\n避難指示より先に『黒帳簿』の回収命令が出されたため、導線が乱れた。",
      "追記\n\n行方不明者一名。有沢凪。\n備考欄には鉛筆で『移送先にて確認済』とあり、その上から何度も塗り潰されている。"
    ]
  },
  "mio-chart": {
    id: "mio-chart",
    title: "有沢澪 観察記録",
    category: "chart",
    excerpt: "事故当夜の記憶欠落。家族識別に遅れあり。",
    pages: [
      "観察記録 / 被検者 A-04\n\n氏名: 有沢澪\n症状: 事故当夜の記憶欠落、家族識別の遅れ、呼名に対する反応不安定。",
      "手書き追記\n\n『姉の名前を先に帳簿へ逃がした。妹は外へ出せる。順番を逆にするな』\nインクは途中で水に溶け、最後だけ凪の筆跡に変わっている。"
    ]
  },
  "nurse-confession": {
    id: "nurse-confession",
    title: "看護記録 私的メモ",
    category: "diary",
    excerpt: "凪さんは、自分の名前を先に帳簿へ預けた。",
    pages: [
      "私的メモ / 破棄予定\n\n止水弁より先に帳簿を守れと言われた。あの子たちの姉妹は逆にするべきじゃなかった。けれど凪さんは笑って、自分の署名欄を差し出した。",
      "『澪だけは外へ返して』\nそう言って水の中へ降りた。私は閉めた。扉も、記録も、口も。全部。"
    ]
  },
  "blood-ledger": {
    id: "blood-ledger",
    title: "黒帳簿 末尾ページ",
    category: "memo",
    excerpt: "署名欄に凪の名前。その下の空欄は、まだあなたのものだ。",
    pages: [
      "黒帳簿 / 末尾\n\n移送先: 地下封印室\n署名済: 有沢凪\n保留欄: 有沢 ＿＿\n",
      "余白の走り書き\n\n『次に書けば、外へ出た記憶もこちら側へ落ちる』\n紙の端だけが、まだ新しい血の色をしている。"
    ]
  }
};

export const MAPS: Record<MapDefinition["id"], MapDefinition> = {
  foyer: {
    id: "foyer",
    name: "玄関",
    subtitle: "乾いたガラスと、濡れた足跡",
    ambient: "受付の空気だけがやけに乾いている。",
    spawn: { x: 4, y: 6 },
    grid: [
      "#########",
      "#.......#",
      "#.......#",
      "#..###..#",
      "#.......#",
      "#.......#",
      "#..###..#",
      "#.......#",
      "#########"
    ],
    objects: [
      {
        id: "foyer-phone",
        mapId: "foyer",
        position: { x: 2, y: 2 },
        label: "公衆電話",
        kind: "inspect",
        actionLabel: "受話器を取る",
        description: "切れているはずなのに、向こう側の音だけが残っている。",
        interactFrom: "adjacent",
        glow: "cold"
      },
      {
        id: "foyer-bench",
        mapId: "foyer",
        position: { x: 6, y: 2 },
        label: "長椅子",
        kind: "pickup",
        actionLabel: "探る",
        description: "埃の切れ目に、最近誰かが座った跡がある。",
        interactFrom: "adjacent",
        glow: "item"
      },
      {
        id: "foyer-shoes",
        mapId: "foyer",
        position: { x: 2, y: 6 },
        label: "下駄箱",
        kind: "inspect",
        actionLabel: "開ける",
        description: "古い内履きの間に、紙片が挟まっている。",
        interactFrom: "adjacent",
        glow: "cold"
      },
      {
        id: "foyer-corridor-door",
        mapId: "foyer",
        position: { x: 7, y: 4 },
        label: "廊下への扉",
        kind: "door",
        actionLabel: "進む",
        description: "向こうの蛍光灯だけが生きている。",
        interactFrom: "same",
        glow: "none"
      }
    ]
  },
  corridor: {
    id: "corridor",
    name: "廊下",
    subtitle: "音だけが先に逃げる",
    ambient: "蛍光灯の唸りが壁の中を這っている。",
    spawn: { x: 1, y: 4 },
    grid: [
      "#########",
      "#.......#",
      "#.###...#",
      "#.......#",
      "#...#...#",
      "#.......#",
      "#...###.#",
      "#.......#",
      "#########"
    ],
    objects: [
      {
        id: "corridor-archive-door",
        mapId: "corridor",
        position: { x: 6, y: 2 },
        label: "書類室の扉",
        kind: "door",
        actionLabel: "入る",
        description: "カードリーダーが弱く明滅している。",
        interactFrom: "same",
        glow: "cold"
      },
      {
        id: "corridor-ward-door",
        mapId: "corridor",
        position: { x: 2, y: 7 },
        label: "西病棟の扉",
        kind: "door",
        actionLabel: "開ける",
        description: "錆びた鍵穴のまわりだけ新しい傷がある。",
        interactFrom: "same",
        glow: "none"
      },
      {
        id: "corridor-stair-door",
        mapId: "corridor",
        position: { x: 7, y: 6 },
        label: "非常階段",
        kind: "door",
        actionLabel: "降りる",
        description: "下へ続く扉。向こうの空気だけが冷たすぎる。",
        interactFrom: "same",
        glow: "danger"
      },
      {
        id: "corridor-handprint",
        mapId: "corridor",
        position: { x: 4, y: 4 },
        label: "赤い手形",
        kind: "inspect",
        actionLabel: "見る",
        description: "さっきまでなかった。指が一本足りない。",
        interactFrom: "adjacent",
        hiddenUntilFlags: ["chartRead"],
        glow: "danger"
      }
    ]
  },
  archive: {
    id: "archive",
    name: "資料室",
    subtitle: "紙のほうが、息を潜めるのがうまい",
    ambient: "紙束が湿気を吸い、壁より重い匂いを放っている。",
    spawn: { x: 1, y: 4 },
    grid: [
      "#########",
      "#.......#",
      "#...#...#",
      "#.......#",
      "#.......#",
      "#...#...#",
      "#.......#",
      "#.......#",
      "#########"
    ],
    objects: [
      {
        id: "archive-corridor-door",
        mapId: "archive",
        position: { x: 1, y: 4 },
        label: "廊下へ戻る",
        kind: "door",
        actionLabel: "戻る",
        description: "扉の隙間から、白い廊下灯が一本だけ伸びている。",
        interactFrom: "same",
        glow: "none"
      },
      {
        id: "archive-locker",
        mapId: "archive",
        position: { x: 2, y: 2 },
        label: "施錠棚",
        kind: "inspect",
        actionLabel: "番号を試す",
        description: "三桁の番号錠。誰かが急いで拭った跡が残る。",
        interactFrom: "adjacent",
        glow: "item"
      },
      {
        id: "archive-patient-list",
        mapId: "archive",
        position: { x: 6, y: 2 },
        label: "隔離患者一覧",
        kind: "inspect",
        actionLabel: "読む",
        description: "番号と病状の一覧。072だけ赤丸。",
        interactFrom: "adjacent",
        glow: "cold"
      },
      {
        id: "archive-accident-report",
        mapId: "archive",
        position: { x: 6, y: 5 },
        label: "事故報告書",
        kind: "inspect",
        actionLabel: "読む",
        description: "水濡れで半分だけ残った報告書。",
        interactFrom: "adjacent",
        glow: "cold"
      },
      {
        id: "archive-chart",
        mapId: "archive",
        position: { x: 2, y: 6 },
        label: "観察記録",
        kind: "inspect",
        actionLabel: "めくる",
        description: "自分の名字が見えた気がした。",
        interactFrom: "adjacent",
        glow: "danger"
      }
    ]
  },
  ward: {
    id: "ward",
    name: "病室",
    subtitle: "安全だった場所ほど、息をひそめる",
    ambient: "薄いカーテンの向こうで、寝返りの気配だけが続く。",
    spawn: { x: 1, y: 4 },
    grid: [
      "#########",
      "#.......#",
      "#...#...#",
      "#.......#",
      "#.......#",
      "#...#...#",
      "#.......#",
      "#.......#",
      "#########"
    ],
    objects: [
      {
        id: "ward-corridor-door",
        mapId: "ward",
        position: { x: 1, y: 4 },
        label: "廊下へ戻る",
        kind: "door",
        actionLabel: "戻る",
        description: "扉の向こうから靴音がときどき消える。",
        interactFrom: "same",
        glow: "none"
      },
      {
        id: "ward-medicine-locker",
        mapId: "ward",
        position: { x: 2, y: 2 },
        label: "薬品庫",
        kind: "inspect",
        actionLabel: "番号を試す",
        description: "番号錠の下に、薄く 072 の擦れ跡。",
        interactFrom: "adjacent",
        glow: "item"
      },
      {
        id: "ward-bedside",
        mapId: "ward",
        position: { x: 6, y: 2 },
        label: "ベッド脇",
        kind: "pickup",
        actionLabel: "めくる",
        description: "シーツの下に紙片が噛み込んでいる。",
        interactFrom: "adjacent",
        glow: "item"
      },
      {
        id: "ward-recorder",
        mapId: "ward",
        position: { x: 6, y: 5 },
        label: "録音機",
        kind: "inspect",
        actionLabel: "再生する",
        description: "カセットは止まっているのに、ヘッドだけ温かい。",
        interactFrom: "adjacent",
        glow: "cold"
      },
      {
        id: "ward-closet",
        mapId: "ward",
        position: { x: 2, y: 6 },
        label: "リネン庫",
        kind: "hide",
        actionLabel: "隠れる",
        description: "布の奥なら、名前まで届かないかもしれない。",
        interactFrom: "same",
        glow: "danger"
      }
    ]
  },
  stairwell: {
    id: "stairwell",
    name: "非常階段",
    subtitle: "下へ行くほど、記憶が近い",
    ambient: "壁のコンクリートが地下の冷気を返してくる。",
    spawn: { x: 1, y: 4 },
    grid: [
      "#########",
      "#.......#",
      "#...#...#",
      "#.......#",
      "#.......#",
      "#...#...#",
      "#.......#",
      "#.......#",
      "#########"
    ],
    objects: [
      {
        id: "stairwell-corridor-door",
        mapId: "stairwell",
        position: { x: 1, y: 4 },
        label: "廊下へ戻る",
        kind: "door",
        actionLabel: "戻る",
        description: "ここより上は、まだ人の高さの空気だ。",
        interactFrom: "same",
        glow: "none"
      },
      {
        id: "stairwell-basement-seal",
        mapId: "stairwell",
        position: { x: 6, y: 2 },
        label: "地下封印扉",
        kind: "seal",
        actionLabel: "封を解く",
        description: "患者タグと祈りの紙を差し込む細い隙間がある。",
        interactFrom: "adjacent",
        glow: "danger"
      },
      {
        id: "stairwell-nameplate",
        mapId: "stairwell",
        position: { x: 6, y: 6 },
        label: "階段銘板",
        kind: "inspect",
        actionLabel: "読む",
        description: "地下の表記だけ、白い塗料で塗り潰されている。",
        interactFrom: "adjacent",
        glow: "cold"
      }
    ]
  },
  basement: {
    id: "basement",
    name: "地下封印室",
    subtitle: "帳簿は、選ばれるのを待っていた",
    ambient: "水ではなく、紙の湿気が喉に張りつく。",
    spawn: { x: 1, y: 4 },
    grid: [
      "#########",
      "#.......#",
      "#.......#",
      "#.......#",
      "#...#...#",
      "#.......#",
      "#.......#",
      "#.......#",
      "#########"
    ],
    objects: [
      {
        id: "basement-altar",
        mapId: "basement",
        position: { x: 4, y: 2 },
        label: "黒帳簿",
        kind: "seal",
        actionLabel: "開く",
        description: "最後の空欄だけが、新しい。",
        interactFrom: "adjacent",
        glow: "danger"
      },
      {
        id: "basement-recorder",
        mapId: "basement",
        position: { x: 6, y: 5 },
        label: "末尾ページ",
        kind: "inspect",
        actionLabel: "読む",
        description: "帳簿の切れ端より新しい紙が、ここに綴じ直されている。",
        interactFrom: "adjacent",
        glow: "cold"
      }
    ]
  }
};

export const DEFAULT_CHASE_STATE: ChaseState = {
  id: "corridor-hunt",
  active: false,
  pursuerDistance: 0,
  maxDistance: CHASE_MAX_DISTANCE,
  safeObjectId: "ward-closet",
  completed: false
};

export const DIALOGUES: Record<string, DialogueEntry> = {
  "intro-1": {
    id: "intro-1",
    speaker: "澪",
    text: "診療棟の玄関は、鍵がかかったままのはずだった。なのに今夜だけ、内側から少しだけ開いている。",
    tone: "calm",
    nextId: "intro-2"
  },
  "intro-2": {
    id: "intro-2",
    speaker: "澪",
    text: "着信履歴の最後に残っていたのは、八年前に死んだ姉・凪の番号。『帳簿を閉じて』という声だけが、水音にまぎれていた。",
    tone: "dread",
    setFlags: ["introSeen"],
    statusText: "上の空気より、床下の気配のほうが近い。"
  },
  "foyer-phone-first": {
    id: "foyer-phone-first",
    speaker: "公衆電話",
    text: "受話器は切れている。それでも硬貨の転がる音だけが、向こう側から何度も返ってくる。",
    tone: "dread",
    setFlags: ["foyerPhoneSeen"],
    statusText: "沈黙のはずの場所に、聞き覚えだけが残っている。"
  },
  "foyer-phone-repeat": {
    id: "foyer-phone-repeat",
    speaker: "澪",
    text: "今はただ、受話器の冷たさしかない。けれど耳を離すと、たしかに誰かが呼吸を止めた気配がした。",
    tone: "calm"
  },
  "foyer-phone-late": {
    id: "foyer-phone-late",
    speaker: "凪",
    text: "『澪。下へ行く前に、わたしの名前を思い出して。あの帳簿は、空欄を家族に寄せるから』",
    tone: "warning",
    setFlags: ["payphoneChanged"],
    statusText: "受話器の向こうが切れたあとも、水滴だけが三つ数えられた。"
  },
  "foyer-bench-found": {
    id: "foyer-bench-found",
    speaker: "澪",
    text: "長椅子の下に、ひとつだけ濡れていないカードがある。裏面に赤い字で『413』。",
    tone: "calm",
    grantItemIds: ["visitor-pass"],
    statusText: "三桁の数字だけが、ここではやけに新しい。"
  },
  "foyer-bench-empty": {
    id: "foyer-bench-empty",
    speaker: "澪",
    text: "カードのあった場所に、四角い乾き跡だけが残っている。",
    tone: "calm"
  },
  "foyer-shoes-note": {
    id: "foyer-shoes-note",
    speaker: "澪",
    text: "下駄箱の隙間に留守電の書き起こし。紙は古いのに、インクだけがまだ滲んでいる。",
    tone: "calm",
    grantJournalIds: ["voicemail-transcript"],
    statusText: "『帳簿を閉じて』。文字で読むほうが、声より怖い。"
  },
  "foyer-shoes-repeat": {
    id: "foyer-shoes-repeat",
    speaker: "澪",
    text: "紙片はもう読んだ。けれど見返すたび、最後の一文だけが少しずつ長くなっている気がする。",
    tone: "dread"
  },
  "door-foyer-corridor": {
    id: "door-foyer-corridor",
    speaker: "地の文",
    text: "白い廊下灯の下へ足を滑らせる。",
    tone: "calm",
    transitionToMap: {
      mapId: "corridor",
      position: { x: 1, y: 4 },
      facing: "right"
    }
  },
  "corridor-enter": {
    id: "corridor-enter",
    speaker: "地の文",
    text: "蛍光灯は生きているのに、灯りの届かない部分だけが妙に近い。戻れる距離が、もう玄関より長い。",
    tone: "dread",
    setFlags: ["corridorEntered"],
    statusText: "先が見えないこと自体が、ここでは一番ましな情報だ。"
  },
  "corridor-handprint": {
    id: "corridor-handprint",
    speaker: "澪",
    text: "赤い手形が、壁の内側から押し返されたみたいに滲んでいる。指が一本足りない。凪は事故のあと、右手の小指を失っていた。",
    tone: "warning",
    statusText: "以前はなかったものが、もう以前からここにいたみたいな顔をしている。"
  },
  "archive-door-locked": {
    id: "archive-door-locked",
    speaker: "澪",
    text: "書類室のカードリーダーが点滅している。差し込める形は、手元の来訪者パスしか思いつかない。",
    tone: "calm"
  },
  "archive-door-open": {
    id: "archive-door-open",
    speaker: "地の文",
    text: "来訪者パスをかざすと、電子錠が乾いた音で外れた。",
    tone: "calm",
    transitionToMap: {
      mapId: "archive",
      position: { x: 1, y: 4 },
      facing: "right"
    }
  },
  "archive-enter": {
    id: "archive-enter",
    speaker: "地の文",
    text: "書類室の紙束だけが、廊下よりずっと静かに腐っている。ここでは紙のほうが人間より長生きだ。",
    tone: "dread",
    setFlags: ["archiveEntered"],
    statusText: "湿った紙の匂いは、病室より先に喉へ降りてくる。"
  },
  "archive-locker-prompt": {
    id: "archive-locker-prompt",
    speaker: "施錠棚",
    text: "三桁の番号を選ぶ。",
    tone: "calm",
    choices: [
      { label: "413", nextId: "archive-locker-correct" },
      { label: "431", nextId: "archive-locker-wrong" },
      { label: "314", nextId: "archive-locker-wrong" }
    ]
  },
  "archive-locker-wrong": {
    id: "archive-locker-wrong",
    speaker: "施錠棚",
    text: "錠前の奥で、誰かが小さく咳き込んだみたいな湿った音がした。それきり動かない。",
    tone: "dread",
    statusText: "数字を間違えるたび、棚の中身だけが近づく気がする。"
  },
  "archive-locker-correct": {
    id: "archive-locker-correct",
    speaker: "澪",
    text: "錠が外れた。中には西病棟の鍵、濡れた護符、古い数珠。急いで隠したみたいに詰め込まれている。",
    tone: "warning",
    setFlags: ["archiveCodeSolved", "wardDoorUnlocked"],
    grantItemIds: ["ward-key", "prayer-slip", "rosary-beads"],
    statusText: "誰かは地下へ行かせたくなくて、でも完全には止めきれなかった。"
  },
  "archive-locker-repeat": {
    id: "archive-locker-repeat",
    speaker: "澪",
    text: "棚の中はもう空だ。底板だけが濡れていて、そこだけ指の跡が二人分残っている。",
    tone: "dread"
  },
  "archive-patient-list": {
    id: "archive-patient-list",
    speaker: "澪",
    text: "患者一覧の 072 だけに赤丸。薬品庫への返却指示が、書き足しのような筆跡で残されている。",
    tone: "calm",
    setFlags: ["patientListRead"],
    grantJournalIds: ["patient-list"],
    statusText: "番号はただの順番じゃない。誰かを戻す鍵になっている。"
  },
  "archive-accident-report": {
    id: "archive-accident-report",
    speaker: "澪",
    text: "事故報告書の順序が変だ。避難より先に『黒帳簿を回収せよ』と命じられている。",
    tone: "warning",
    setFlags: ["accidentReportRead"],
    grantJournalIds: ["accident-report"],
    statusText: "ここでは人命より先に、名前が運ばれた。"
  },
  "archive-chart-1": {
    id: "archive-chart-1",
    speaker: "澪",
    text: "観察記録の表紙に、自分の名字がある。めくった瞬間、紙より先に耳の奥が冷えた。",
    tone: "warning",
    nextId: "archive-chart-2"
  },
  "archive-chart-2": {
    id: "archive-chart-2",
    speaker: "地の文",
    text: "事故当夜の記憶欠落。家族識別の遅れ。欄外の追記には『姉の名前を先に帳簿へ逃がした。妹は外へ返せる』。最後の一筆だけ、凪の筆跡だった。",
    tone: "dread",
    setFlags: ["chartRead"],
    grantJournalIds: ["mio-chart"],
    statusText: "決定的な発見ほど、読み終えたあとに自分の体温を奪っていく。"
  },
  "door-archive-corridor": {
    id: "door-archive-corridor",
    speaker: "地の文",
    text: "紙の匂いを置き去りにして、廊下へ戻る。",
    tone: "calm",
    transitionToMap: {
      mapId: "corridor",
      position: { x: 6, y: 3 },
      facing: "left"
    }
  },
  "door-ward-corridor": {
    id: "door-ward-corridor",
    speaker: "地の文",
    text: "病室の湿った静けさを背に、廊下へ戻る。",
    tone: "calm",
    transitionToMap: {
      mapId: "corridor",
      position: { x: 2, y: 6 },
      facing: "down"
    }
  },
  "door-stairwell-corridor": {
    id: "door-stairwell-corridor",
    speaker: "地の文",
    text: "冷気を振り払うように、廊下の灯りへ戻る。",
    tone: "calm",
    transitionToMap: {
      mapId: "corridor",
      position: { x: 7, y: 7 },
      facing: "up"
    }
  },
  "chase-start-1": {
    id: "chase-start-1",
    speaker: "地の文",
    text: "蛍光灯の唸りが、ぷつりと切れた。無音になった瞬間、廊下が急に近くなる。",
    tone: "dread",
    nextId: "chase-start-2"
  },
  "chase-start-2": {
    id: "chase-start-2",
    speaker: "地の文",
    text: "奥で、看護師の靴音が水を踏む。一定の速さで、あなたの名前を数えながら近づいてくる。隠れられる場所まで走るしかない。",
    tone: "warning",
    setFlags: ["chaseStarted"],
    startChase: "corridor-hunt",
    statusText: "音が消えた。追いつかれる前に、布の奥へ。"
  },
  "ward-door-locked": {
    id: "ward-door-locked",
    speaker: "澪",
    text: "西病棟の扉は古い鍵で閉じられている。書類室で見つけた真鍮の鍵が合いそうだ。",
    tone: "calm"
  },
  "ward-door-open": {
    id: "ward-door-open",
    speaker: "地の文",
    text: "鍵が抵抗なく回る。閉じたはずの病室が、中からあなたを待っていたみたいに。",
    tone: "calm",
    transitionToMap: {
      mapId: "ward",
      position: { x: 1, y: 4 },
      facing: "right"
    }
  },
  "ward-enter": {
    id: "ward-enter",
    speaker: "地の文",
    text: "カーテンの向こうで、誰かが寝返りをうった気がした。けれどベッドには誰もいない。",
    tone: "dread",
    setFlags: ["wardEntered"],
    statusText: "安全だった場所ほど、あとから安全ではなかったと知る。"
  },
  "ward-locker-no-clue": {
    id: "ward-locker-no-clue",
    speaker: "澪",
    text: "薬品庫の錠は三桁。番号の手掛かりがまだ足りない。",
    tone: "calm"
  },
  "ward-locker-prompt": {
    id: "ward-locker-prompt",
    speaker: "薬品庫",
    text: "返却タグの番号を入力する。",
    tone: "calm",
    choices: [
      { label: "072", nextId: "ward-locker-correct" },
      { label: "207", nextId: "ward-locker-wrong" },
      { label: "720", nextId: "ward-locker-wrong" }
    ]
  },
  "ward-locker-wrong": {
    id: "ward-locker-wrong",
    speaker: "薬品庫",
    text: "錠前は動かない。代わりに、中から金属のタグが壁を引っかく音だけがした。",
    tone: "dread"
  },
  "ward-locker-correct": {
    id: "ward-locker-correct",
    speaker: "澪",
    text: "薬品庫が開き、患者タグ 072 が転がり落ちた。裏側には『移送済』。",
    tone: "warning",
    setFlags: ["wardCabinetSolved"],
    grantItemIds: ["patient-tag"],
    statusText: "番号は人を区別するためじゃない。運ぶ順番を決めるためにあった。"
  },
  "ward-bedside-found": {
    id: "ward-bedside-found",
    speaker: "澪",
    text: "シーツの下から、黒い帳簿の切れ端。署名欄だけが切り取られ、残りには自分の生年月日が滲んでいる。",
    tone: "warning",
    grantItemIds: ["ledger-fragment"],
    statusText: "ここまで来て、帳簿の空欄が自分に向いていると分かる。"
  },
  "ward-bedside-repeat": {
    id: "ward-bedside-repeat",
    speaker: "澪",
    text: "ベッド脇には、紙を抜いたあとの重みだけが残っている。",
    tone: "calm"
  },
  "ward-recorder": {
    id: "ward-recorder",
    speaker: "看護師の声",
    text: "『凪さんは、自分の名前を先に帳簿へ預けた。澪さんだけは外へ返したかったのに、私は扉を閉めた』",
    tone: "dread",
    setFlags: ["confessionRead"],
    grantJournalIds: ["nurse-confession"],
    statusText: "意味が分かった瞬間、さっきまでの廊下よりこの病室のほうが怖くなる。"
  },
  "ward-recorder-repeat": {
    id: "ward-recorder-repeat",
    speaker: "澪",
    text: "再生は終わっているはずなのに、巻き戻しの音だけがずっと細く続いている。",
    tone: "dread"
  },
  "ward-closet-hide": {
    id: "ward-closet-hide",
    speaker: "地の文",
    text: "リネンの山に身を沈める。扉の向こうで靴音が止まり、誰かがあなたの名前を最後まで数えずに去っていった。",
    tone: "warning",
    setFlags: ["chaseCompleted", "hidFromNurse"],
    completeChase: true,
    statusText: "助かった、ではなく、今はまだ書き込まれなかっただけだ。"
  },
  "ward-closet-idle": {
    id: "ward-closet-idle",
    speaker: "澪",
    text: "布の匂いは古い。ここに隠れた人が、前にもいたことだけは分かる。",
    tone: "calm"
  },
  "stair-door-blocked": {
    id: "stair-door-blocked",
    speaker: "澪",
    text: "非常階段の前だけ、空気が重い。今はまだ、あの靴音のほうが先に来る。",
    tone: "warning"
  },
  "stair-door-open": {
    id: "stair-door-open",
    speaker: "地の文",
    text: "扉を開けると、地下から紙の湿気が吹き上がる。",
    tone: "calm",
    transitionToMap: {
      mapId: "stairwell",
      position: { x: 1, y: 4 },
      facing: "right"
    }
  },
  "stairwell-enter": {
    id: "stairwell-enter",
    speaker: "地の文",
    text: "階段を一段降りるたび、自分の記憶より地下のほうが近くなる。",
    tone: "dread",
    setFlags: ["stairwellEntered"],
    statusText: "戻りたくない場所ほど、真相はそこで待っている。"
  },
  "stairwell-nameplate": {
    id: "stairwell-nameplate",
    speaker: "澪",
    text: "地下の表記だけ、白い塗料で塗り潰されている。塗膜の下から『封印室』の二文字が透けた。",
    tone: "calm"
  },
  "seal-locked": {
    id: "seal-locked",
    speaker: "澪",
    text: "封印扉には三つの欠けた条件がある。患者タグ、帳簿の切れ端、そして誰かが残した祈り。",
    tone: "warning"
  },
  "seal-open": {
    id: "seal-open",
    speaker: "地の文",
    text: "患者タグと護符を差し込み、帳簿の切れ端を重ねる。封印扉の向こうで、水ではなく紙の擦れる音がした。",
    tone: "warning",
    setFlags: ["basementUnlocked"],
    transitionToMap: {
      mapId: "basement",
      position: { x: 1, y: 4 },
      facing: "right"
    }
  },
  "basement-enter": {
    id: "basement-enter",
    speaker: "地の文",
    text: "地下封印室は、病院というより書庫だった。中央に黒帳簿が開いたまま置かれ、最後の空欄だけが乾いている。",
    tone: "dread",
    setFlags: ["basementEntered"],
    statusText: "ここに来る前から、あなたはもう読まれていた。"
  },
  "basement-recorder": {
    id: "basement-recorder",
    speaker: "澪",
    text: "綴じ直された末尾ページ。署名欄には凪の名前、その下の空欄だけが今夜のために残されている。",
    tone: "warning",
    setFlags: ["bloodLedgerRead"],
    grantJournalIds: ["blood-ledger"],
    statusText: "帳簿は道具ではなく、名前の居場所そのものだった。"
  },
  "basement-recorder-repeat": {
    id: "basement-recorder-repeat",
    speaker: "澪",
    text: "ページを閉じても、最後の空欄だけはまぶたの裏に残る。",
    tone: "dread"
  },
  "altar-choice": {
    id: "altar-choice",
    speaker: "黒帳簿",
    text: "最後の空欄を前に、選ぶ。",
    tone: "warning",
    choices: [
      { label: "凪の名前を呼び、帳簿を閉じる", nextId: "ending-release-line" },
      { label: "自分の名前を書き、帳簿を継ぐ", nextId: "ending-inheritance-line" },
      { label: "何も書かず、背を向ける", nextId: "ending-silence-line" }
    ]
  },
  "ending-release-line": {
    id: "ending-release-line",
    speaker: "凪",
    text: "『それでいい。今度は澪が外へ出て』 乾いていた空欄が閉じ、地下の紙音がようやく止まった。",
    tone: "calm",
    ending: "release"
  },
  "ending-inheritance-line": {
    id: "ending-inheritance-line",
    speaker: "地の文",
    text: "自分の名前を書いた瞬間、玄関までの記憶が一枚ずつ湿っていく。帳簿は軽くなり、代わりにあなたの声が地下に残った。",
    tone: "dread",
    ending: "inheritance"
  },
  "ending-silence-line": {
    id: "ending-silence-line",
    speaker: "地の文",
    text: "背を向けた瞬間、帳簿は閉じないまま静かになった。外へ出ても、姉の名前だけはもう思い出せない。",
    tone: "warning",
    ending: "silence"
  }
};

export const SCENE_EVENTS: SceneEvent[] = [
  {
    id: "corridor-chase-start",
    trigger: "enter",
    mapId: "corridor",
    requiredFlags: ["chartRead"],
    excludedFlags: ["chaseStarted", "chaseCompleted"],
    dialogueId: "chase-start-1"
  },
  {
    id: "corridor-first-enter",
    trigger: "enter",
    mapId: "corridor",
    excludedFlags: ["corridorEntered", "chartRead"],
    dialogueId: "corridor-enter"
  },
  {
    id: "archive-first-enter",
    trigger: "enter",
    mapId: "archive",
    excludedFlags: ["archiveEntered"],
    dialogueId: "archive-enter"
  },
  {
    id: "ward-first-enter",
    trigger: "enter",
    mapId: "ward",
    excludedFlags: ["wardEntered"],
    dialogueId: "ward-enter"
  },
  {
    id: "stairwell-first-enter",
    trigger: "enter",
    mapId: "stairwell",
    excludedFlags: ["stairwellEntered"],
    dialogueId: "stairwell-enter"
  },
  {
    id: "basement-first-enter",
    trigger: "enter",
    mapId: "basement",
    excludedFlags: ["basementEntered"],
    dialogueId: "basement-enter"
  },
  {
    id: "foyer-phone-late",
    trigger: "interact",
    mapId: "foyer",
    objectId: "foyer-phone",
    requiredFlags: ["chartRead"],
    excludedFlags: ["payphoneChanged"],
    dialogueId: "foyer-phone-late"
  },
  {
    id: "foyer-phone-first",
    trigger: "interact",
    mapId: "foyer",
    objectId: "foyer-phone",
    excludedFlags: ["foyerPhoneSeen", "chartRead"],
    dialogueId: "foyer-phone-first"
  },
  {
    id: "foyer-phone-repeat",
    trigger: "interact",
    mapId: "foyer",
    objectId: "foyer-phone",
    dialogueId: "foyer-phone-repeat"
  },
  {
    id: "foyer-bench-found",
    trigger: "interact",
    mapId: "foyer",
    objectId: "foyer-bench",
    excludedFlags: ["visitorPassTaken"],
    dialogueId: "foyer-bench-found"
  },
  {
    id: "foyer-bench-empty",
    trigger: "interact",
    mapId: "foyer",
    objectId: "foyer-bench",
    dialogueId: "foyer-bench-empty"
  },
  {
    id: "foyer-shoes-note",
    trigger: "interact",
    mapId: "foyer",
    objectId: "foyer-shoes",
    requiredFlags: ["introSeen"],
    dialogueId: "foyer-shoes-note"
  },
  {
    id: "foyer-to-corridor",
    trigger: "interact",
    mapId: "foyer",
    objectId: "foyer-corridor-door",
    dialogueId: "door-foyer-corridor"
  },
  {
    id: "archive-door-locked",
    trigger: "interact",
    mapId: "corridor",
    objectId: "corridor-archive-door",
    excludedFlags: ["visitorPassTaken"],
    dialogueId: "archive-door-locked"
  },
  {
    id: "archive-door-open",
    trigger: "interact",
    mapId: "corridor",
    objectId: "corridor-archive-door",
    requiredFlags: ["visitorPassTaken"],
    dialogueId: "archive-door-open"
  },
  {
    id: "ward-door-locked",
    trigger: "interact",
    mapId: "corridor",
    objectId: "corridor-ward-door",
    excludedFlags: ["wardDoorUnlocked"],
    dialogueId: "ward-door-locked"
  },
  {
    id: "ward-door-open",
    trigger: "interact",
    mapId: "corridor",
    objectId: "corridor-ward-door",
    requiredFlags: ["wardDoorUnlocked"],
    dialogueId: "ward-door-open"
  },
  {
    id: "stair-door-blocked",
    trigger: "interact",
    mapId: "corridor",
    objectId: "corridor-stair-door",
    excludedFlags: ["chaseCompleted"],
    dialogueId: "stair-door-blocked"
  },
  {
    id: "stair-door-open",
    trigger: "interact",
    mapId: "corridor",
    objectId: "corridor-stair-door",
    requiredFlags: ["chaseCompleted"],
    dialogueId: "stair-door-open"
  },
  {
    id: "corridor-handprint",
    trigger: "interact",
    mapId: "corridor",
    objectId: "corridor-handprint",
    dialogueId: "corridor-handprint"
  },
  {
    id: "archive-to-corridor",
    trigger: "interact",
    mapId: "archive",
    objectId: "archive-corridor-door",
    dialogueId: "door-archive-corridor"
  },
  {
    id: "archive-locker-prompt",
    trigger: "interact",
    mapId: "archive",
    objectId: "archive-locker",
    excludedFlags: ["archiveCodeSolved"],
    dialogueId: "archive-locker-prompt"
  },
  {
    id: "archive-locker-repeat",
    trigger: "interact",
    mapId: "archive",
    objectId: "archive-locker",
    requiredFlags: ["archiveCodeSolved"],
    dialogueId: "archive-locker-repeat"
  },
  {
    id: "archive-patient-list",
    trigger: "interact",
    mapId: "archive",
    objectId: "archive-patient-list",
    dialogueId: "archive-patient-list"
  },
  {
    id: "archive-accident-report",
    trigger: "interact",
    mapId: "archive",
    objectId: "archive-accident-report",
    dialogueId: "archive-accident-report"
  },
  {
    id: "archive-chart",
    trigger: "interact",
    mapId: "archive",
    objectId: "archive-chart",
    dialogueId: "archive-chart-1"
  },
  {
    id: "ward-to-corridor",
    trigger: "interact",
    mapId: "ward",
    objectId: "ward-corridor-door",
    dialogueId: "door-ward-corridor"
  },
  {
    id: "ward-locker-no-clue",
    trigger: "interact",
    mapId: "ward",
    objectId: "ward-medicine-locker",
    excludedFlags: ["patientListRead", "wardCabinetSolved"],
    dialogueId: "ward-locker-no-clue"
  },
  {
    id: "ward-locker-prompt",
    trigger: "interact",
    mapId: "ward",
    objectId: "ward-medicine-locker",
    requiredFlags: ["patientListRead"],
    excludedFlags: ["wardCabinetSolved"],
    dialogueId: "ward-locker-prompt"
  },
  {
    id: "ward-locker-repeat",
    trigger: "interact",
    mapId: "ward",
    objectId: "ward-medicine-locker",
    requiredFlags: ["wardCabinetSolved"],
    dialogueId: "ward-locker-correct"
  },
  {
    id: "ward-bedside-found",
    trigger: "interact",
    mapId: "ward",
    objectId: "ward-bedside",
    excludedFlags: ["ledgerFragmentTaken"],
    dialogueId: "ward-bedside-found"
  },
  {
    id: "ward-bedside-repeat",
    trigger: "interact",
    mapId: "ward",
    objectId: "ward-bedside",
    requiredFlags: ["ledgerFragmentTaken"],
    dialogueId: "ward-bedside-repeat"
  },
  {
    id: "ward-recorder-first",
    trigger: "interact",
    mapId: "ward",
    objectId: "ward-recorder",
    excludedFlags: ["confessionRead"],
    dialogueId: "ward-recorder"
  },
  {
    id: "ward-recorder-repeat",
    trigger: "interact",
    mapId: "ward",
    objectId: "ward-recorder",
    requiredFlags: ["confessionRead"],
    dialogueId: "ward-recorder-repeat"
  },
  {
    id: "ward-closet-hide",
    trigger: "interact",
    mapId: "ward",
    objectId: "ward-closet",
    requiredFlags: ["chaseStarted"],
    excludedFlags: ["chaseCompleted"],
    dialogueId: "ward-closet-hide"
  },
  {
    id: "ward-closet-idle",
    trigger: "interact",
    mapId: "ward",
    objectId: "ward-closet",
    dialogueId: "ward-closet-idle"
  },
  {
    id: "stairwell-to-corridor",
    trigger: "interact",
    mapId: "stairwell",
    objectId: "stairwell-corridor-door",
    dialogueId: "door-stairwell-corridor"
  },
  {
    id: "stairwell-nameplate",
    trigger: "interact",
    mapId: "stairwell",
    objectId: "stairwell-nameplate",
    dialogueId: "stairwell-nameplate"
  },
  {
    id: "seal-open",
    trigger: "interact",
    mapId: "stairwell",
    objectId: "stairwell-basement-seal",
    requiredFlags: ["patientTagTaken", "ledgerFragmentTaken", "prayerSlipTaken"],
    dialogueId: "seal-open"
  },
  {
    id: "seal-locked",
    trigger: "interact",
    mapId: "stairwell",
    objectId: "stairwell-basement-seal",
    dialogueId: "seal-locked"
  },
  {
    id: "basement-recorder-first",
    trigger: "interact",
    mapId: "basement",
    objectId: "basement-recorder",
    excludedFlags: ["bloodLedgerRead"],
    dialogueId: "basement-recorder"
  },
  {
    id: "basement-recorder-repeat",
    trigger: "interact",
    mapId: "basement",
    objectId: "basement-recorder",
    requiredFlags: ["bloodLedgerRead"],
    dialogueId: "basement-recorder-repeat"
  },
  {
    id: "basement-altar-choice",
    trigger: "interact",
    mapId: "basement",
    objectId: "basement-altar",
    dialogueId: "altar-choice"
  }
];

export const ENDING_SUMMARIES: Record<
  EndingType,
  { title: string; body: string; ribbon: string }
> = {
  release: {
    title: "終幕: 解放",
    body: "凪の名前を呼び、帳簿を閉じた。外へ出た朝の空気は冷たかったが、もう地下の湿気ではなかった。姉の記憶は痛みごと残り、それでもあなたの足は玄関の外へ進めた。",
    ribbon: "帳簿を閉じ、名を返した"
  },
  inheritance: {
    title: "終幕: 継承",
    body: "自分の名前を書き込んだ瞬間、事故の夜よりあとの記憶がゆっくり湿って沈んでいく。月ヶ瀬診療棟は静かになったが、その静けさを守る声はもう地上には残らない。",
    ribbon: "空欄を引き受けた"
  },
  silence: {
    title: "終幕: 沈黙",
    body: "何も書かずに背を向けた。玄関の外へ出ても、姉の名前だけが舌の先で滑り落ちる。帳簿は閉じなかったが、あなたの中の何かだけが静かに閉じた。",
    ribbon: "真相から目を逸らした"
  }
};
