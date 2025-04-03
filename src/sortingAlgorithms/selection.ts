export function* selectionSortGenerator(array: number[]) {
  for (let i = 0; i < array.length - 1; i++) {
    let minIndex = i;
    
    // Find the minimum element in the unsorted portion
    for (let j = i + 1; j < array.length; j++) {
      yield [
        [j, minIndex],
        Array.from({ length: i }, (_, index) => index)
      ] as [number[], number[]];
      
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }
    
    // Swap the minimum element with the first unsorted element
    if (minIndex !== i) {
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
    }
  }
  
  // Yield final state with all elements sorted
  yield [
    [],
    Array.from({ length: array.length }, (_, i) => i)
  ] as [number[], number[]];
  
  return array;
}
