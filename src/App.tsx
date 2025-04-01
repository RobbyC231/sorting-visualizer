import './App.css';
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
import { useReducer } from 'react';

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
  algorithm: SortingAlgorithm | null;
  arraySize: number;
}

type AppAction =
  | { type: 'SET_SPEED'; payload: number }
  | { type: 'SET_ALGORITHM'; payload: SortingAlgorithm }
  | { type: 'SET_ARRAY_SIZE'; payload: number };

const initialState: AppState = {
  speed: 1,
  algorithm: null,
  arraySize: 50,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_SPEED':
      return { ...state, speed: action.payload };
    case 'SET_ALGORITHM':
      return { ...state, algorithm: action.payload };
    case 'SET_ARRAY_SIZE':
      return { ...state, arraySize: action.payload };
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <>
      <header className="flex flex-row items-center justify-center min-h-svh gap-4">
        <h1 className="text-2xl font-bold mr-8">Sort Visualizer</h1>
        <Select
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
          className="w-[180px]"
          placeholder="Enter array size"
          value={state.arraySize}
          onChange={(e) => dispatch({ type: 'SET_ARRAY_SIZE', payload: Number(e.target.value) })}
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
          <Button variant="outline" onClick={() => console.log('randomize clicked')}>
            Randomize
          </Button>
        </div>
      </header>
      <main></main>
    </>
  );
}

export default App;
