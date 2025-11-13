export interface Leaderboard {
  customerId: number;
  loginName: string;
  place: number;
  week: 'I' | 'II' | 'III' | 'IV';
}

