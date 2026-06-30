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

### Phase 1: React Native 환경 구성

모바일 앱의 기반을 다지고 UI 프로토타입을 완성하는 단계.

| 단계 | 작업 | 상세 |
|------|------|------|
| 1 | 프로젝트 셋업 | Expo SDK 56 초기 구성, CDD + FSD 디렉토리 구조 수립 |
| 2 | 디자인 시스템 | 컬러 토큰, 폰트(Inter/Noto Sans KR), 공통 UI 컴포넌트 구축 |
| 3 | UI 프로토타입 | 5개 탭 화면 퍼블리싱 (대시보드, 냉장고, 장보기, 레시피, 리포트) |
| 4 | DB 설계 | 스키마 구조 설계 (마스터, 서비스, 히스토리), 테이블 정의 및 관계 설정 |

### Phase 2: 관리자 페이지 및 API 개발

Next.js 기반 어드민 + API 서버 구축. 앱에 필요한 데이터를 미리 확보.

| 단계 | 작업 | 상세 |
|------|------|------|
| 1 | 환경 구성 | Next.js + Tailwind CSS 프로젝트 생성, DB 연결 |
| 2 | API 설계 | RESTful API 엔드포인트 정의 (식재료, 레시피, 유저, 인벤토리) |
| 3 | 마스터 관리 | 표준 식재료 등록, 부위별 계층 구조(`parent_id`) 관리 화면 |
| 4 | 콘텐츠 구축 | 레시피 등록 및 식재료 매핑 도구, 기초 데이터 시딩 |

**결과물**: 앱 개발 시 바로 사용할 수 있는 API + 풍부한 사전 데이터 확보.

### Phase 3: 핵심 로직 개발 및 앱 연동

백엔드 핵심 기능과 모바일 앱을 본격적으로 연결하는 단계.

| 단계 | 작업 | 상세 |
|------|------|------|
| 1 | 인증 | 카카오/구글/애플 소셜 로그인, JWT 기반 세션 관리 |
| 2 | 인벤토리 연동 | 하이브리드 단위(%, g, ea) 실 데이터 CRUD, 유통기한 알림 |
| 3 | OCR & 매칭 | 영수증 텍스트 추출, 표준 식재료 자동 매핑 알고리즘 |
| 4 | 레시피 매칭 | 냉장고 잔량 기반 레시피 추천 쿼리 최적화 |
| 5 | 장보기 플로우 | 장보기 리스트 완료 시 인벤토리 자동 입고 로직 |
| 6 | 통계 리포트 | 히스토리 데이터 기반 지출 분석 차트 시각화 |

### Phase 4: 테스트 및 보안

| 단계 | 작업 | 상세 |
|------|------|------|
| 1 | 통합 테스트 | 장보기 -> 입고 -> 레시피 추천 -> 소비 전체 사이클 E2E 점검 |
| 2 | 보안 점검 | API 인증/인가, 입력값 검증, SQL Injection 방어, 민감 데이터 암호화 |
| 3 | 베타 테스트 | 소규모 그룹(가족/지인) 초대 코드 공유, 실사용 피드백 수집 |
| 4 | 성능 최적화 | 쿼리 튜닝, 이미지 캐싱, 번들 사이즈 최적화 |

### Phase 5: 배포 준비

| 단계 | 작업 | 상세 |
|------|------|------|
| 1 | 스토어 준비 | 앱 아이콘, 스크린샷, 스토어 설명문 작성 |
| 2 | CI/CD 구성 | EAS Build + EAS Submit 파이프라인 설정 |
| 3 | 런칭 | App Store + Google Play 스토어 등록 및 심사 |
| 4 | 모니터링 | 크래시 리포팅, 사용자 분석 도구 연동 |

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
