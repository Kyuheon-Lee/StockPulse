# StockPulse

미국 주식 데이터를 기반으로 관심 종목, 포트폴리오, 대시보드를 한 곳에서 확인하는 투자 시뮬레이션 UI입니다. Finnhub API를 사용하며, 사용자가 자신의 API 키를 설정해 데이터를 조회하도록 설계되어 있습니다.

## 주요 기능

- 시장 뉴스
    - Finnhub 시장 뉴스(일반/인수합병) 제공
    - 관심 종목에 대한 기업 뉴스 모아보기
- 관심 목록
    - 종목 카드에서 관심 등록/해제
    - 관심 목록과 카드 상태를 로컬에 저장
- 포트폴리오
    - 보유 종목 요약(매입금액, 평가금액, 손익)
    - 보유 종목 테이블 및 최근 거래 내역
- 대시보드
    - 선택 종목 시세 및 변동률 표시
    - Finnhub WebSocket 실시간 체결 데이터 구독
    - 매수/매도 시뮬레이션과 평균단가/평가손익 계산
    - 기업 상세 정보(거래소, 산업, 국가 등)
- 설정
    - Finnhub API 키 등록/삭제
    - 키는 브라우저 저장소에 영속 저장

## 화면/플로우

- 홈
    - 시장 뉴스 두 섹션(종합, 인수합병) + 관심 기업 뉴스
    - 유튜브 라이브 스트림 카드(채널 라이브 상태 확인)
- 관심 목록
    - 관심 종목 카드 리스트
    - 카드 클릭 시 대시보드로 이동
- 포트폴리오
    - 보유 종목 요약 카드, 테이블, 거래 내역
    - 행 클릭 시 해당 종목 대시보드로 이동
- 대시보드
    - 실시간 가격 변화와 변동률
    - 매수/매도 시뮬레이션
    - 기업 상세 정보
- 설정
    - Finnhub API 키 입력 후 저장
    - 키가 없으면 주요 페이지는 안내 UI만 표시

## 기술 스택

- React 19 + TypeScript
- Vite
- React Router
- TanStack Query (React Query)
- Zustand + persist
- Axios
- Sass (SCSS 모듈)

## 구현 상세

### API 계층

- `src/utils/api.ts`
    - Axios 인스턴스 생성
    - 요청 인터셉터에서 API 키를 주입
    - 키는 `settingsStore`에 저장된 값

### 데이터 패칭

- React Query 기반 훅
    - `useSearchQuote`, `useCompanyProfile`, `useMarketNews`, `useCompanyNews`, `useMarketStatus`, `useSearchSymbol`
- 캐시/재조회 정책은 각 훅에 명시

### 상태 관리

- `src/stores/stockStore.ts`
    - 관심 목록, 포지션, 거래 내역을 `zustand persist`로 영속 저장
- `src/stores/settingsStore.ts`
    - Finnhub API 키를 `zustand persist`로 저장

### 실시간 시세

- 대시보드에서 Finnhub WebSocket 구독
    - 종목 변경 시 구독/해제 처리
    - 최신 체결값을 즉시 반영

### API 키 가드

- `src/App.tsx`
    - API 키가 없으면 기본 화면 대신 `ApiKeyNotice`만 렌더링
    - `/settings`는 항상 접근 가능

### 타입 통합

- 외부 API 응답 타입은 `src/types/interfaces.ts`에서 통합 관리

## Finnhub API 키 설정

1. `https://finnhub.io/register`에서 API 키 발급
2. 앱의 설정 페이지에서 키 입력 후 저장
3. 저장된 키는 브라우저 로컬 저장소에 유지

## 실행 방법

```bash
npm install
npm run dev
```

## 빌드/배포

```bash
npm run build
npm run preview
```

빌드 산출물은 `dist/`에 생성됩니다.

## 폴더 구조

```text
src/
  components/
    apiKeyNotice/
    categoryTabs/
    header/
    myLikesSection/
    newsSection/
    searchBar/
    stockPriceCard/
  hooks/
  pages/
    dashboard/
    home/
    portfolio/
    settings/
    watchlist/
  stores/
    settingsStore.ts
    stockStore.ts
  styles/
  types/
    interfaces.ts
  utils/
    api.ts
```
