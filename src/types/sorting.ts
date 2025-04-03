export const ARRAY_SIZE_LIMITS = {
  MIN: 1,
  MAX: 400,
} as const;

export const SORTING_ALGORITHMS = [
  { value: 'bubble', label: 'Bubble Sort' },
  { value: 'selection', label: 'Selection Sort' },
  { value: 'insertion', label: 'Insertion Sort' },
  { value: 'quick', label: 'Quick Sort' },
  { value: 'merge', label: 'Merge Sort' },
] as const;

export type SortingAlgorithm = (typeof SORTING_ALGORITHMS)[number]['value'];
