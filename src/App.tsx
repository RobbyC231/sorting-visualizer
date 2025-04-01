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
import { stat } from 'fs';

const SORTING_ALGORITHMS = [
  { value: 'bubble', label: 'Bubble Sort' },
  { value: 'quick', label: 'Quick Sort' },
  { value: 'merge', label: 'Merge Sort' },
  { value: 'insertion', label: 'Insertion Sort' },
  { value: 'selection', label: 'Selection Sort' },
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
      return { ...state, randomArray: getRandomElements(action.payload) };
    case 'RANDOMIZE':
      return { ...state, randomArray: getRandomElements(state.randomArray.length) };
    case 'SORT':
      return {
        ...state,
        isSorting: true,
        activeSortingFunction:
          state.activeSortingFunction ?? getSortingFunction(state.algorithm)(state.randomArray),
      };
    case 'FINISH_SORTING':
      return { ...state, isSorting: false };
    case 'SET_INDICES':
      return {
        ...state,
        sortedIndices: action.payload.sorted,
        activeIndices: action.payload.active,
      };
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
    default:
      throw new Error(`Invalid algorithm: ${algorithm}`);
  }
}

function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    async function sort() {
      while (state.activeSortingFunction != null && state.isSorting) {
        const {
          done,
          value: [active, sorted],
        } = state.activeSortingFunction.next();
        if (done) {
          dispatch({ type: 'FINISH_SORTING' });
          return;
        }
        dispatch({ type: 'SET_INDICES', payload: { active, sorted } });
      }
    }

    sort();
  }, [state.isSorting, state.activeSortingFunction]);

  //   useEffect(() => {
  //     let cancel = false;
  //     let timeout: NodeJS.Timeout;
  //     async function inner() {
  //       while (activeSortingFunction != null && isSorting && !cancel) {
  //         const {
  //           done,
  //           value: [active, sorted],
  //         } = activeSortingFunction.next();

  //         if (done) {
  //           dispatch({ type: 'FINISH_SORTING' });
  //           return;
  //         }

  //         dispatch({ type: 'SET_INDICES', payload: { active, sorted } });
  //         await new Promise<void>((resolve) => {
  //           timeout = setTimeout(resolve, 1000 / OPERATIONS_PER_SECOND / sortingSpeed);
  //         });
  //       }
  //     }

  //     inner();

  //     return () => {
  //       clearTimeout(timeout);
  //       cancel = true;
  //     };
  //   }, [activeSortingFunction, sortingSpeed, isSorting]);

  return (
    <div className="flex flex-col h-screen">
      <header className="w-full bg-white border-b shadow-sm py-4 px-6 mb-4">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-xl font-bold">Sort Visualizer</h1>
          <div className="flex items-center gap-4">
            <Select
              value={state.algorithm}
              onValueChange={(value) =>
                dispatch({ type: 'SET_ALGORITHM', payload: value as SortingAlgorithm })
              }
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
              min="1"
              max="400"
              className="w-[120px]"
              placeholder="Array size"
              value={state.randomArray.length}
              onChange={(e) =>
                dispatch({ type: 'CHANGE_ARRAY_LENGTH', payload: Number(e.target.value) })
              }
            />
            <div className="flex items-center gap-2 w-[200px]">
              <span className="text-sm">Speed:</span>
              <Slider
                value={[state.speed]}
                onValueChange={(value) => dispatch({ type: 'SET_SPEED', payload: value[0] })}
                max={50}
                step={1}
                className="w-full"
              />
              <span className="text-sm w-12">{state.speed}x</span>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => console.log('sort clicked')}>Sort</Button>
              <Button variant="outline" onClick={() => dispatch({ type: 'RANDOMIZE' })}>
                Randomize
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex items-end w-full grow overflow-hidden">
        {state.randomArray.map((value, index) => (
          <div
            key={index}
            className="grow flex items-end justify-center pb-2 bg-muted"
            style={{ height: `${value}%` }}
          />
        ))}
      </main>
    </div>
  );
}

export default App;
