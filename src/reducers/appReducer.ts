import { AppState, AppAction } from '@/types/reducer';
import { ARRAY_SIZE_LIMITS } from '@/types/sorting';
import { getRandomElements, getSortingFunction } from '@/utils/sorting';

export const initialState: AppState = {
  speed: 1,
  algorithm: 'bubble',
  randomArray: getRandomElements(50),
  isSorting: false,
  sortedIndices: [],
  activeIndices: [],
};

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_SPEED':
      return { ...state, speed: action.payload };
    case 'SET_ALGORITHM':
      return {
        ...state,
        algorithm: action.payload,
        randomArray: getRandomElements(state.randomArray.length),
        sortedIndices: [],
        activeIndices: [],
        activeSortingFunction: undefined,
        isSorting: false,
      };
    case 'CHANGE_ARRAY_LENGTH':
      if (
        action.payload < ARRAY_SIZE_LIMITS.MIN ||
        action.payload > ARRAY_SIZE_LIMITS.MAX ||
        isNaN(action.payload)
      ) {
        return state;
      }

      return {
        ...state,
        randomArray: getRandomElements(action.payload),
        sortedIndices: [],
        activeIndices: [],
        activeSortingFunction: undefined,
      };
    case 'RANDOMIZE':
      return {
        ...state,
        randomArray: getRandomElements(state.randomArray.length),
        sortedIndices: [],
        activeIndices: [],
        activeSortingFunction: undefined,
      };
    case 'SORT':
      return {
        ...state,
        isSorting: true,
        activeSortingFunction:
          state.activeSortingFunction ?? getSortingFunction(state.algorithm)(state.randomArray),
      };
    case 'FINISH_SORTING':
      return {
        ...state,
        isSorting: false,
        activeSortingFunction: undefined,
      };
    case 'SET_INDICES':
      return {
        ...state,
        sortedIndices: action.payload.sorted,
        activeIndices: action.payload.active,
      };
    case 'STOP':
      return { ...state, isSorting: false };
    default:
      return state;
  }
}
