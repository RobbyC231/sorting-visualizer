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
import { useState } from 'react';

const SORTING_ALGORITHMS = [
  { value: 'bubble', label: 'Bubble Sort' },
  { value: 'quick', label: 'Quick Sort' },
  { value: 'merge', label: 'Merge Sort' },
  { value: 'insertion', label: 'Insertion Sort' },
  { value: 'selection', label: 'Selection Sort' },
] as const;

function App() {
  const [speed, setSpeed] = useState<number>(1);

  return (
    <div className="flex flex-row items-center justify-center min-h-svh gap-4">
      <h1 className="text-2xl font-bold mr-8">Sort Visualizer</h1>
      <Select>
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
      <Input type="number" min="1" max="400" className="w-[180px]" placeholder="Enter array size" />
      <div className="flex items-center gap-2 w-[200px]">
        <span className="text-sm">Speed:</span>
        <Slider
          value={[speed]}
          onValueChange={(value) => setSpeed(value[0])}
          max={50}
          step={1}
          className="w-full"
        />
        <span className="text-sm w-12">{speed}x</span>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => console.log('sort clicked')}>Sort</Button>
        <Button variant="outline" onClick={() => console.log('randomize clicked')}>
          Randomize
        </Button>
      </div>
    </div>
  );
}

export default App;
