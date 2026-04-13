/** コミュニティ / 交流機能の型定義 */

export interface UserProfile {
  userId: string;
  displayName: string;
  handle: string;           // @handle
  grade: number;            // 学年
  faculty: string;
  campus: string;
  tags: string[];           // 興味タグ
  comment: string;          // 自己紹介
  createdAt: string;
}

export interface Friend {
  id: string;
  userId: string;
  displayName: string;
  handle: string;
  grade: number;
  faculty: string;
  campus: string;
  tags: string[];
  comment: string;
  /** 既に友達になっているか */
  isFriend: boolean;
  /** おすすめとして表示するか */
  isSuggested?: boolean;
}

export interface Circle {
  id: string;
  name: string;
  genre: 'スポーツ' | '音楽' | '学術' | '文化' | '国際' | 'ボランティア' | 'その他';
  campus: string;
  description: string;
  activityDays: string[];
  memberCount: number;
  welcomingFreshmen: boolean;
}

export interface Topic {
  id: string;
  category: string;
  title: string;
  body: string;
  replies: number;
}
