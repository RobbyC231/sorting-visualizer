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
import { cn } from '@/lib/utils';
import { ARRAY_SIZE_LIMITS, SORTING_ALGORITHMS, SortingAlgorithm } from '@/types/sorting';
import { appReducer, initialState } from '@/reducers/appReducer';

const OPERATIONS_PER_SECOND = 2;

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
