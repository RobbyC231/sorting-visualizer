export function* bubbleSortGenerator(array: number[]) {
    for (let n = array.length; n >= 0; n--) {
      for (let i = 0; i < n - 1; i++) {
        yield [
          [i],
          Array.from(
            { length: array.length - n },
            (_, i) => array.length - i - 1
          ),
        ] as [number[], number[]]
        
        if (array[i] > array[i + 1]) {
          // Swap the elements
          ;[array[i], array[i + 1]] = [array[i + 1], array[i]]
        }
      }
    }
  
    yield [
      [], 
      Array.from(
        { length: array.length }, 
        (_, i) => i
      )
    ] as [ number[], number[]]
  
    return array
  }
