
export type Position = '팀장' | '실장' | '사업부장' | '본부장' | '대표이사';
export const POSITIONS: Position[] = ['팀장', '실장', '사업부장', '본부장', '대표이사'];

export type Affiliation = '현대자동차' | '기아' | '현대모비스' | '현대오토에버' | '현대건설' | '현대카드';
export const AFFILIATIONS: Affiliation[] = ['현대자동차', '기아', '현대모비스', '현대오토에버', '현대건설', '현대카드'];

export interface UserRegistration {
  affiliation: string;
  employeeId: string;
  name: string;
  position: Position;
  timestamp: string;
}

export interface FirebaseSettings {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}
