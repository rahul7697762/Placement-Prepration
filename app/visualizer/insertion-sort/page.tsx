"use client";

import { SortingVisualizer, ArrayBar } from "@/components/visualizer/sorting-visualizer";

const insertionSortAlgorithm = async (
    array: ArrayBar[],
    setArray: React.Dispatch<React.SetStateAction<ArrayBar[]>>,
    delay: () => Promise<void>,
    isCancelled: React.MutableRefObject<boolean>
) => {
    const arr = [...array];
    const n = arr.length;

    arr[0].state = "sorted";
    setArray([...arr]);

    for (let i = 1; i < n; i++) {
        if (isCancelled.current) return;

        const key = arr[i].value;
        arr[i].state = "current";
        setArray([...arr]);
        await delay();

        let j = i - 1;

        while (j >= 0 && arr[j].value > key) {
            if (isCancelled.current) return;

            arr[j].state = "comparing";
            setArray([...arr]);
            await delay();

            arr[j + 1].value = arr[j].value;
            arr[j + 1].state = "swapping";
            arr[j].state = "sorted";
            setArray([...arr]);
            await delay();

            j--;
        }

        arr[j + 1].value = key;
        arr[j + 1].state = "sorted";
        setArray([...arr]);
        await delay();

        // Mark all elements up to i as sorted
        for (let k = 0; k <= i; k++) {
            arr[k].state = "sorted";
        }
        setArray([...arr]);
    }
};

const codeSnippet = `function insertionSort(arr) {
  const n = arr.length;
  
  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    
    // Move elements greater than key
    // one position ahead
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    
    arr[j + 1] = key;
  }
  
  return arr;
}`;

const algorithmSteps = [
    "Start with the second element (first is already sorted)",
    "Compare current element with sorted portion",
    "Shift larger elements one position to the right",
    "Insert current element in its correct position",
    "Repeat for all remaining elements",
    "Like sorting playing cards in your hand",
];

export default function InsertionSortPage() {
    return (
        <SortingVisualizer
            title="Insertion Sort"
            description="Insertion Sort builds the final sorted array one item at a time. It's efficient for small datasets and nearly sorted arrays, working like sorting playing cards in your hands."
            timeComplexity={{
                best: "O(n)",
                average: "O(n²)",
                worst: "O(n²)",
            }}
            spaceComplexity="O(1)"
            codeSnippet={codeSnippet}
            algorithmSteps={algorithmSteps}
            sortFunction={insertionSortAlgorithm}
        />
    );
}
