import { SortingAlgorithm } from '@/types/sorting';
import { bubbleSortGenerator } from '@/sortingAlgorithms/bubble';
import { selectionSortGenerator } from '@/sortingAlgorithms/selection';
import { insertionSortGenerator } from '@/sortingAlgorithms/insertion';
import { mergeSortGenerator } from '@/sortingAlgorithms/merge';
import { quickSortGenerator } from '@/sortingAlgorithms/quick';

export function getRandomElements(arraySize: number) {
  return Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100) + 1);
}

export function getSortingFunction(algorithm: SortingAlgorithm) {
  switch (algorithm) {
    case 'bubble':
      return bubbleSortGenerator;
    case 'selection':
      return selectionSortGenerator;
    case 'insertion':
      return insertionSortGenerator;
    case 'quick':
      return quickSortGenerator;
    case 'merge':
      return mergeSortGenerator;
    default:
      throw new Error(`Invalid algorithm: ${algorithm}`);
  }
}
