# Reviews 데이터 구조

리뷰 데이터를 연령대와 시술 부위별로 분류하여 관리합니다.

## 파일 구조

```
reviews/
├── 20y-a.ts      # 20대 중안면 (3개)
├── 20y-ab.ts     # 20대 중+하안면 (3개)
├── 20y-b.ts      # 20대 하안면 (2개)
├── 30y-a.ts      # 30대 중안면 (3개)
├── 30y-ab.ts     # 30대 중+하안면 (2개)
├── 30y-b.ts      # 30대 하안면 (2개)
├── 40y-a.ts      # 40대 중안면 (5개)
├── 40y-ab.ts     # 40대 중+하안면 (2개)
├── 40y-b.ts      # 40대 하안면 (3개)
├── 50y-ab.ts     # 50대 중+하안면 (3개)
└── index.ts      # 통합 export
```

## 사용 방법

### 1. 전체 리뷰 가져오기 (기존 방식과 동일)
```typescript
import { REVIEWS } from '@/data/reviews';
```

### 2. 연령대별 리뷰 가져오기
```typescript
import { REVIEWS_20Y, REVIEWS_30Y, REVIEWS_40Y, REVIEWS_50Y } from '@/data/reviews';
```

### 3. 연령대 + 부위별 리뷰 가져오기
```typescript
import {
  REVIEWS_20Y_A,   // 20대 중안면
  REVIEWS_20Y_AB,  // 20대 중+하안면
  REVIEWS_20Y_B,   // 20대 하안면
  // ... 등등
} from '@/data/reviews';
```

## 부위 코드

- **a** (a type): 중안면 (mid) - `targets: ['mid']`
- **ab** (ab type): 중안면 + 하안면 - `targets: ['mid', 'lower']`
- **b** (b type): 하안면 (lower) - `targets: ['lower']`

## 이미지 경로 구조

이미지 파일은 다음 경로에 저장됩니다:
```
public/match/{연령대}/{부위 타입}/{ID}/
```

예시:
- `public/match/20y/a type/1/` - 20대, 중안면, ID 1번
- `public/match/30y/ab type/5/` - 30대, 중+하안면, ID 5번
