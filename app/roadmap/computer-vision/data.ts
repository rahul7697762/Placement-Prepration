import { Unit } from './types';
import { section1Data } from './data1';
import { section2Data } from './data2';
import { section3Data } from './data3';
import { section4Data } from './data4';
import { section5Data } from './data5';

// Export types for use in page.tsx
export type { Topic, Unit } from './types';

// Combine all sections into a single array
export const computerVisionData: Unit[] = [
    section1Data,
    section2Data,
    section3Data,
    section4Data,
    section5Data
];
