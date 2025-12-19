// src/types.ts

export type AgeGroup = '20' | '30' | '40' | '50';
export type TargetArea = 'mid' | 'lower'; // 중안면, 하안면

export interface ReviewData {
    id: number;
    name?: string; // 작성자 이름 (e.g. '이**님')
    age: AgeGroup;
    targets: TargetArea[]; // ['mid'], ['lower'], or ['mid', 'lower']
    tags: string[]; // 필터링에 사용될 태그 (예: '팔자주름', '이중턱')
    memo?: string[]; // 특이사항 (예: 'contouring' - 윤곽수술)
    content: string; // 원본 텍스트 데이터 (특수 태그 포함)
}
