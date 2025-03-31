import './App.css';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const SORTING_ALGORITHMS = [
  { value: 'bubble', label: 'Bubble Sort' },
  { value: 'quick', label: 'Quick Sort' },
  { value: 'merge', label: 'Merge Sort' },
  { value: 'insertion', label: 'Insertion Sort' },
  { value: 'selection', label: 'Selection Sort' },
] as const;

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh gap-4">
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
      <Button onClick={() => console.log('clicked')}>Click me</Button>
    </div>
  );
}

export default App;
