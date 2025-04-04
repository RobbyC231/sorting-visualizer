export function* quickSortGenerator(array: number[]) {
  // Helper function to partition the array
  function* partition(
    arr: number[],
    low: number,
    high: number
  ): Generator<[number[], number[]], number> {
    // Choose the rightmost element as pivot
    const pivot = arr[high];
    let i = low - 1;

    // Compare each element with pivot
    for (let j = low; j < high; j++) {
      // Yield current comparison indices
      yield [[j, high], []] as [number[], number[]];

      if (arr[j] <= pivot) {
        i++;
        // Swap elements
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }

    // Swap pivot to its final position
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    
    return i + 1; // Return the pivot index
  }

  // Helper function to perform quick sort
  function* quickSortHelper(
    arr: number[],
    low: number,
    high: number
  ): Generator<[number[], number[]], void> {
    if (low < high) {
      // Partition the array and get pivot index
      const pivotIndex = yield* partition(arr, low, high);

      // Recursively sort elements before and after pivot
      yield* quickSortHelper(arr, low, pivotIndex - 1);
      yield* quickSortHelper(arr, pivotIndex + 1, high);
    }
  }

  // Start the quick sort process
  yield* quickSortHelper(array, 0, array.length - 1);

  // Yield final state with all elements sorted
  yield [[], Array.from({ length: array.length }, (_, i) => i)] as [number[], number[]];

  return array;
}
