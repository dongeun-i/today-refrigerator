import type { Ingredient } from '@/entities/ingredient';
import type { Recipe } from '@/entities/recipe';

export const MOCK_EXPIRING: Ingredient[] = [
  {
    id: '1',
    name: '우유',
    category: '유제품',
    storage: '냉장',
    daysLeft: 2,
    remainingAmount: '45%',
    remainingPercent: 45,
    expiryDate: '2026-07-02',
  },
  {
    id: '2',
    name: '대서양 연어',
    category: '수산물',
    storage: '냉동',
    daysLeft: 0,
    remainingAmount: '200g',
    remainingPercent: 25,
    expiryDate: '2026-06-30',
  },
];

export const MOCK_FRESH: Ingredient[] = [
  {
    id: '3',
    name: '달걀',
    category: '단백질',
    storage: '냉장',
    daysLeft: 12,
    remainingAmount: '6 / 12 개',
    remainingPercent: 50,
    expiryDate: '2026-07-12',
  },
  {
    id: '4',
    name: '아보카도',
    category: '농산물',
    storage: '실온',
    daysLeft: 3,
    remainingAmount: '1 / 4 개',
    remainingPercent: 25,
    expiryDate: '2026-07-03',
  },
  {
    id: '5',
    name: '펜네 파스타',
    category: '곡물',
    storage: '실온',
    daysLeft: 180,
    remainingAmount: '850g',
    remainingPercent: 85,
    expiryDate: '2026-12-27',
  },
];

export const MOCK_EXPIRING_QUICK = [
  { name: '어린 시금치', location: '신선실', daysLeft: 1 },
  { name: '저지방 우유', location: '냉장실 상단', daysLeft: 1 },
  { name: '블루베리', location: '과일 보관함', daysLeft: 3 },
];

export const MOCK_RECIPES: Recipe[] = [
  {
    id: '1',
    name: '시금치 견과류 샐러드',
    description: '임박 식재료 4개 활용 가능',
    matchingIngredients: 4,
  },
  {
    id: '2',
    name: '허브 치킨 구이',
    description: '임박 식재료 2개 활용 가능',
    matchingIngredients: 2,
  },
  {
    id: '3',
    name: '레몬 갈릭 연어 구이',
    description: '냉동 연어 활용 추천',
    matchingIngredients: 3,
  },
];

export const MOCK_SHOPPING = [
  { id: '1', name: '그릭 요거트', note: '냉장고 잔량 부족', quantity: '2개', checked: false },
  { id: '2', name: '신선한 시금치', note: '추천 레시피: 그린 스무디', quantity: '1팩', checked: false },
  { id: '3', name: '천연발효종 빵', note: '', quantity: '', checked: false },
  { id: '4', name: '유기농 달걀', note: '즐겨찾기에서 추가됨', quantity: '', checked: true },
  { id: '5', name: '아몬드 우유', note: '', quantity: '2L', checked: true },
];

export const MOCK_REPORT = {
  wastedAmount: 42500,
  wastedChange: 12,
  categories: [
    { name: '농산물', current: 85000, prev: 70000 },
    { name: '정육', current: 65000, prev: 55000 },
    { name: '유제품', current: 55000, prev: 50000 },
    { name: '가공식품', current: 45000, prev: 60000 },
    { name: '기타', current: 34150, prev: 30000 },
  ],
  totalSpend: 284150,
  frequentBuy: [
    { name: '시금치', count: 4 },
    { name: '우유', count: 3 },
  ],
  frequentWaste: [
    { name: '시금치', percent: 60 },
    { name: '바나나', percent: 25 },
  ],
};
