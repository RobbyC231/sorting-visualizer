export function* mergeSortGenerator(array: number[]) {
  // Helper function to merge two sorted arrays
  function* merge(
    left: number[],
    right: number[],
    startIndex: number
  ): Generator<[number[], number[]], number[]> {
    const result: number[] = [];
    let i = 0;
    let j = 0;
    let k = 0;

    while (i < left.length && j < right.length) {
      // Yield current comparison indices
      yield [[startIndex + i, startIndex + left.length + j], []] as [number[], number[]];

      if (left[i] <= right[j]) {
        result[k] = left[i];
        i++;
      } else {
        result[k] = right[j];
        j++;
      }
      k++;
    }

    // Copy remaining elements from left array
    while (i < left.length) {
      result[k] = left[i];
      i++;
      k++;
    }

    // Copy remaining elements from right array
    while (j < right.length) {
      result[k] = right[j];
      j++;
      k++;
    }

    return result;
  }

  // Helper function to perform merge sort
  function* mergeSortHelper(
    arr: number[],
    startIndex: number
  ): Generator<[number[], number[]], number[]> {
    if (arr.length <= 1) {
      return arr;
    }

    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    // Recursively sort left and right halves
    const sortedLeft = yield* mergeSortHelper(left, startIndex);
    const sortedRight = yield* mergeSortHelper(right, startIndex + mid);

    // Merge the sorted halves
    const merged = yield* merge(sortedLeft, sortedRight, startIndex);

    // Update the original array with merged result
    for (let i = 0; i < merged.length; i++) {
      array[startIndex + i] = merged[i];
    }

    return merged;
  }

  // Start the merge sort process
  yield* mergeSortHelper(array, 0);

  // Yield final state with all elements sorted
  yield [[], Array.from({ length: array.length }, (_, i) => i)] as [number[], number[]];

  return array;
}
