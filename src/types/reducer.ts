import { SortingAlgorithm } from './sorting';

export interface AppState {
  speed: number;
  algorithm: SortingAlgorithm;
  randomArray: number[];
  isSorting: boolean;
  activeSortingFunction?: Generator<[number[], number[]]>;
  sortedIndices: number[];
  activeIndices: number[];
}

export type AppAction =
  | { type: 'SET_SPEED'; payload: number }
  | { type: 'SET_ALGORITHM'; payload: SortingAlgorithm }
  | { type: 'CHANGE_ARRAY_LENGTH'; payload: number }
  | { type: 'RANDOMIZE' }
  | { type: 'SORT' }
  | { type: 'STOP' }
  | { type: 'FINISH_SORTING' }
  | { type: 'SET_INDICES'; payload: { active: number[]; sorted: number[] } };
