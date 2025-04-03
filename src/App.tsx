import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useReducer } from 'react';
import { bubbleSortGenerator } from './sortingAlgorithms/bubble';
import { cn } from '@/lib/utils';
import { selectionSortGenerator } from './sortingAlgorithms/selection';

const OPERATIONS_PER_SECOND = 2;

const ARRAY_SIZE_LIMITS = {
  MIN: 1,
  MAX: 400,
} as const;

const SORTING_ALGORITHMS = [
  { value: 'bubble', label: 'Bubble Sort' },
  { value: 'selection', label: 'Selection Sort' },
  { value: 'insertion', label: 'Insertion Sort' },
  { value: 'quick', label: 'Quick Sort' },
  { value: 'merge', label: 'Merge Sort' },
] as const;

type SortingAlgorithm = (typeof SORTING_ALGORITHMS)[number]['value'];

interface AppState {
  speed: number;
  algorithm: SortingAlgorithm;
  randomArray: number[];
  isSorting: boolean;
  activeSortingFunction?: Generator<[number[], number[]]>;
  sortedIndices: number[];
  activeIndices: number[];
}

type AppAction =
  | { type: 'SET_SPEED'; payload: number }
  | { type: 'SET_ALGORITHM'; payload: SortingAlgorithm }
  | { type: 'CHANGE_ARRAY_LENGTH'; payload: number }
  | { type: 'RANDOMIZE' }
  | { type: 'SORT' }
  | { type: 'STOP' }
  | { type: 'FINISH_SORTING' }
  | { type: 'SET_INDICES'; payload: { active: number[]; sorted: number[] } };

const initialState: AppState = {
  speed: 1,
  algorithm: 'bubble',
  randomArray: getRandomElements(50),
  isSorting: false,
  sortedIndices: [],
  activeIndices: [],
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_SPEED':
      return { ...state, speed: action.payload };
    case 'SET_ALGORITHM':
      return { ...state, algorithm: action.payload };
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

function getRandomElements(arraySize: number) {
  return Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100) + 1);
}

function getSortingFunction(algorithm: SortingAlgorithm) {
  switch (algorithm) {
    case 'bubble':
      return bubbleSortGenerator;
    case 'selection':
      return selectionSortGenerator;
    default:
      throw new Error(`Invalid algorithm: ${algorithm}`);
  }
}

function App() {
  const [
    {
      speed,
      algorithm,
      randomArray,
      isSorting,
      activeSortingFunction,
      sortedIndices,
      activeIndices,
    },
    dispatch,
  ] = useReducer(appReducer, initialState);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let cancel = false;

    async function sort() {
      while (activeSortingFunction != null && isSorting && !cancel) {
        const {
          done,
          value: [active, sorted],
        } = activeSortingFunction.next();

        if (done) {
          dispatch({ type: 'FINISH_SORTING' });
          return;
        }

        dispatch({ type: 'SET_INDICES', payload: { active, sorted } });
        await new Promise(
          (resolve) => (timeout = setTimeout(resolve, 1000 / OPERATIONS_PER_SECOND / speed))
        );
      }
    }

    sort();

    return () => {
      clearTimeout(timeout);
      cancel = true;
    };
  }, [isSorting, activeSortingFunction, speed]);

  return (
    <div className="flex flex-col h-screen">
      <header className="w-full bg-white border-b shadow-sm py-4 px-6 mb-4">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-xl font-bold">Sort Visualizer</h1>
          <div className="flex items-center gap-4">
            <Select
              value={algorithm}
              onValueChange={(value) =>
                dispatch({ type: 'SET_ALGORITHM', payload: value as SortingAlgorithm })
              }
              disabled={isSorting}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select algorithm" />
              </SelectTrigger>
              <SelectContent>
                {SORTING_ALGORITHMS.map((algorithm) => (
                  <SelectItem key={algorithm.value} value={algorithm.value}>
                    {algorithm.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              min={ARRAY_SIZE_LIMITS.MIN}
              max={ARRAY_SIZE_LIMITS.MAX}
              step={5}
              className="w-[120px]"
              defaultValue={randomArray.length}
              disabled={isSorting}
              onChange={(e) =>
                dispatch({ type: 'CHANGE_ARRAY_LENGTH', payload: e.target.valueAsNumber })
              }
            />
            <div className="flex items-center gap-2 w-[200px]">
              <span className="text-sm">Speed:</span>
              <Slider
                value={[speed]}
                onValueChange={(value) => dispatch({ type: 'SET_SPEED', payload: value[0] })}
                max={50}
                min={1}
                step={1}
                className="w-full"
              />
              <span className="text-sm w-12">{speed}x</span>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => dispatch({ type: isSorting ? 'STOP' : 'SORT' })}
                variant={isSorting ? 'destructive' : 'default'}
              >
                {isSorting ? 'Stop' : 'Sort'}
              </Button>
              <Button
                disabled={isSorting}
                variant="outline"
                onClick={() => dispatch({ type: 'RANDOMIZE' })}
              >
                Randomize
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex items-end w-full grow overflow-hidden">
        {randomArray.map((value, index) => (
          <div
            key={index}
            className={cn(
              'grow flex items-end justify-center pb-2 bg-muted',
              sortedIndices.includes(index) && 'bg-green-500',
              activeIndices.includes(index) && 'bg-blue-500'
            )}
            style={{ height: `${value}%` }}
          />
        ))}
      </main>
    </div>
  );
}

export default App;
