# 오늘의냉장고 (Today Refrigerator)

스마트 식재료 관리 앱. 냉장고 속 재료의 유통기한을 추적하고, 맞춤 레시피를 추천하며, 식비 낭비를 줄여주는 모바일 서비스입니다.

## Tech Stack

| 영역 | 기술 |
|------|------|
| Framework | Expo SDK 56 + React Native 0.85 |
| Routing | Expo Router (file-based) |
| Language | TypeScript 6.0 |
| Icons | lucide-react-native |
| Fonts | Inter, Noto Sans KR (@expo-google-fonts) |
| Charts | react-native-svg |
| Backend (예정) | Supabase (PostgreSQL + Edge Functions) |
| Admin (예정) | Next.js + Tailwind CSS |

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npx expo start

# 플랫폼별 실행
npx expo start --ios
npx expo start --android
npx expo start --web
```

## 프로젝트 구조 (CDD + FSD)

**Component-Driven Development**와 **Feature-Sliced Design** 아키텍처를 적용했습니다.

```
src/
├── app/                          # Pages (Expo Router)
│   ├── _layout.tsx               # Root Stack + 폰트 로딩
│   └── (tabs)/
│       ├── _layout.tsx           # 5-Tab Navigation (Lucide Icons)
│       ├── index.tsx             # 홈 (대시보드)
│       ├── inventory.tsx         # 냉장고 (인벤토리)
│       ├── shopping.tsx          # 장보기 목록
│       ├── recipe.tsx            # 레시피 추천
│       └── report.tsx            # 식비 리포트
│
├── shared/                       # Shared Layer ─ 앱 전체에서 재사용
│   ├── theme/
│   │   ├── colors.ts             # 라이트/다크 컬러 팔레트
│   │   ├── fonts.ts              # Inter + Noto Sans KR fontFamily 매핑
│   │   └── spacing.ts            # spacing, border-radius 토큰
│   ├── ui/                       # CDD Atoms (순수 UI 컴포넌트)
│   │   ├── Badge.tsx             # D-day, 상태 뱃지
│   │   ├── Card.tsx              # 기본 카드 (shadow 기반, border 없음)
│   │   ├── ChipFilter.tsx        # 필터 칩 (전체/냉장/냉동/실온)
│   │   ├── ProgressBar.tsx       # 잔량 게이지 바
│   │   ├── SearchInput.tsx       # 검색 입력 (Lucide Search 아이콘)
│   │   └── SectionHeader.tsx     # 섹션 제목 + 액션 버튼
│   └── lib/
│       ├── useAppTheme.ts        # 라이트/다크 테마 훅
│       └── mock-data.ts          # 개발용 목 데이터
│
├── entities/                     # Entity Layer ─ 비즈니스 도메인 모델
│   ├── ingredient/
│   │   ├── model/types.ts        # Ingredient 타입 정의
│   │   └── ui/
│   │       ├── IngredientCard.tsx # 식재료 카드 (잔량 바 + D-day 뱃지)
│   │       └── ExpiringItem.tsx   # 임박 식재료 카드 (횡스크롤용)
│   └── recipe/
│       ├── model/types.ts        # Recipe 타입 정의
│       └── ui/
│           └── RecipeCard.tsx     # 레시피 카드 (매칭 식재료 수 표시)
│
└── features/                     # Feature Layer ─ 독립 기능 단위
    ├── freshness-score/
    │   └── ui/
    │       └── FreshnessGauge.tsx # SVG 원형 신선도 게이지
    └── stat-summary/
        └── ui/
            └── StatCards.tsx      # 3열 통계 요약 카드
```

### FSD 레이어 규칙

| Layer | 역할 | Import 가능 대상 |
|-------|------|-----------------|
| `app` | 페이지, 라우팅 | 모든 하위 레이어 |
| `features` | 독립 기능 단위 | `entities`, `shared` |
| `entities` | 비즈니스 도메인 | `shared` |
| `shared` | 공통 UI, 테마, 유틸 | 없음 (최하위) |

## 디자인 시스템

### 컬러 팔레트

| 토큰 | Light | Dark | 용도 |
|------|-------|------|------|
| `primary` | `#4dd1c4` | `#4dd1c4` | 메인 액센트 (민트) |
| `accent` | `#F687B3` | `#F687B3` | 경고/임박 (핑크) |
| `background` | `#eef1f3` | `#131f1e` | 앱 배경 |
| `backgroundCard` | `#f7f8fa` | `rgba(255,255,255,0.05)` | 카드 배경 |

### 폰트

- **Inter** (Regular, Medium, SemiBold, Bold) - 숫자, 영문
- **Noto Sans KR** (Regular, Medium, SemiBold, Bold) - 한글 UI

### 아이콘

[lucide-react-native](https://lucide.dev) 사용. 탭바 아이콘:

| 탭 | 아이콘 |
|----|--------|
| 홈 | `Home` |
| 냉장고 | `Refrigerator` |
| 장보기 | `ShoppingCart` |
| 레시피 | `ChefHat` |
| 리포트 | `BarChart3` |

## 화면 구성

| 화면 | 경로 | 설명 |
|------|------|------|
| 대시보드 | `/(tabs)/` | 신선도 게이지, 임박 식재료, 맞춤 레시피 |
| 냉장고 | `/(tabs)/inventory` | 칩 필터 + 검색, 식재료 목록 (유통기한순) |
| 장보기 | `/(tabs)/shopping` | 체크리스트, 빠른 추가, 일괄 입고 CTA |
| 레시피 | `/(tabs)/recipe` | 식재료 매칭 기반 레시피 추천 |
| 리포트 | `/(tabs)/report` | 낭비 금액, 카테고리별 소비, 스마트 팁 |

---

## 개발 로드맵

### Phase 1: 인프라 및 DB 구축

| 단계 | 작업 | 상세 |
|------|------|------|
| 1 | DB 설정 | Supabase 프로젝트 또는 local 생성 |
| 2 | 테이블 생성 | 테이블 정의 및 동작 설계 |
| 3 | 기초 데이터 | 카테고리(육류, 채소 등), 필수 표준 식재료(소고기, 양파 등) 초기 데이터 삽입 |

### Phase 2: 로컬 관리자 페이지 개발

서비스 운영 도구. 로컬 전용으로 보안 강화.

| 단계 | 작업 | 상세 |
|------|------|------|
| 1 | 환경 구성 | Next.js + Tailwind CSS 기반 프로젝트 생성 및 API 연결 |
| 2 | 마스터 관리 | 표준 식재료 등록, 부위별 계층 구조(`parent_id`) 관리 화면 |
| 3 | 콘텐츠 구축 | 레시피 등록, 식재료 매핑 도구 |

**결과물**: 앱 개발 시 바로 사용할 수 있는 풍부한 사전 데이터 확보.

### Phase 3: 백엔드 및 핵심 로직 개발

Supabase Edge Functions 기반 서버리스 로직.

| 단계 | 작업 | 상세 |
|------|------|------|
| 1 | 인증 | 카카오/구글/애플 소셜 로그인, JWT 발급 |
| 2 | OCR & 매칭 | 영수증 텍스트 추출, 표준 식재료 매핑 알고리즘 |
| 3 | 레시피 매칭 | 냉장고 잔량 기반 레시피 추천 쿼리 최적화 |

### Phase 4: 모바일 앱 개발

현재 UI 프로토타입을 실제 데이터와 연동.

| 단계 | 작업 | 상세 |
|------|------|------|
| 1 | 메인 UI | 하이브리드 단위(%, g, ea) 인벤토리 리스트 및 게이지 UI |
| 2 | 장보기 레이어 | 장보기 리스트, 완료 시 인벤토리 자동 입고 로직 |
| 3 | 통계 및 리포트 | `history` 스키마 데이터 기반 지출 분석 차트 |

### Phase 5: 테스트 및 배포

| 단계 | 작업 | 상세 |
|------|------|------|
| 1 | 통합 테스트 | 장보기 -> 입고 -> 레시피 추천 -> 소비 전체 사이클 점검 |
| 2 | 베타 테스트 | 소규모 그룹(가족/지인) 초대 코드, 실사용 피드백 수집 |
| 3 | 런칭 | App Store + Google Play 스토어 등록 |

## 주요 명령어

```bash
# 개발
npx expo start                   # 개발 서버 시작
npx expo start --web             # 웹 브라우저로 실행
npx expo start --ios             # iOS 시뮬레이터
npx expo start --android         # Android 에뮬레이터

# 빌드 & 배포
npx expo export --platform web   # 웹 정적 빌드
eas build --platform ios         # iOS 빌드 (EAS)
eas build --platform android     # Android 빌드 (EAS)

# 코드 품질
npx expo lint                    # ESLint 실행
npx tsc --noEmit                 # TypeScript 타입 체크

# 패키지 관리
npx expo install <package>       # Expo 호환 버전으로 설치
```
