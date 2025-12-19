// src/data/reviews/index.ts
import { ReviewData } from '../../types';

// Import all review groups
import { REVIEWS_20Y_A } from './20y-a';
import { REVIEWS_20Y_AB } from './20y-ab';
import { REVIEWS_20Y_B } from './20y-b';
import { REVIEWS_30Y_A } from './30y-a';
import { REVIEWS_30Y_AB } from './30y-ab';
import { REVIEWS_30Y_B } from './30y-b';
import { REVIEWS_40Y_A } from './40y-a';
import { REVIEWS_40Y_AB } from './40y-ab';
import { REVIEWS_40Y_B } from './40y-b';
import { REVIEWS_50Y_AB } from './50y-ab';

// Re-export all groups
export { REVIEWS_20Y_A, REVIEWS_20Y_AB, REVIEWS_20Y_B };
export { REVIEWS_30Y_A, REVIEWS_30Y_AB, REVIEWS_30Y_B };
export { REVIEWS_40Y_A, REVIEWS_40Y_AB, REVIEWS_40Y_B };
export { REVIEWS_50Y_AB };

// Combined export for backward compatibility
export const REVIEWS: ReviewData[] = [
    ...REVIEWS_20Y_A,
    ...REVIEWS_20Y_AB,
    ...REVIEWS_20Y_B,
    ...REVIEWS_30Y_A,
    ...REVIEWS_30Y_AB,
    ...REVIEWS_30Y_B,
    ...REVIEWS_40Y_A,
    ...REVIEWS_40Y_AB,
    ...REVIEWS_40Y_B,
    ...REVIEWS_50Y_AB
].filter((review): review is ReviewData => review !== undefined && review !== null);

// Export by age
export const REVIEWS_20Y: ReviewData[] = [
    ...REVIEWS_20Y_A,
    ...REVIEWS_20Y_AB,
    ...REVIEWS_20Y_B
];

export const REVIEWS_30Y: ReviewData[] = [
    ...REVIEWS_30Y_A,
    ...REVIEWS_30Y_AB,
    ...REVIEWS_30Y_B
];

export const REVIEWS_40Y: ReviewData[] = [
    ...REVIEWS_40Y_A,
    ...REVIEWS_40Y_AB,
    ...REVIEWS_40Y_B
];

export const REVIEWS_50Y: ReviewData[] = [
    ...REVIEWS_50Y_AB
];
