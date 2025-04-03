export function* insertionSortGenerator(array: number[]) {
  // First element is already considered sorted
  for (let i = 1; i < array.length; i++) {
    const currentValue = array[i];
    let j = i - 1;

    // Compare and shift elements to the right
    while (j >= 0 && array[j] > currentValue) {
      // Yield current comparison indices and sorted portion
      yield [[j + 1], []] as [number[], number[]];
      [array[j], array[j + 1]] = [array[j + 1], array[j]];
      j--;
    }

    // Place the current value in its correct position
    yield [[j + 1], []] as [number[], number[]];
    array[j + 1] = currentValue;
  }

  // Yield final state with all elements sorted
  yield [[], Array.from({ length: array.length }, (_, i) => i)] as [number[], number[]];

  return array;
}
