"use client";

import { SortingVisualizer, ArrayBar } from "@/components/visualizer/sorting-visualizer";

const bubbleSortAlgorithm = async (
    array: ArrayBar[],
    setArray: React.Dispatch<React.SetStateAction<ArrayBar[]>>,
    delay: () => Promise<void>,
    isCancelled: React.MutableRefObject<boolean>
) => {
    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (isCancelled.current) return;

            // Mark comparing
            arr[j].state = "comparing";
            arr[j + 1].state = "comparing";
            setArray([...arr]);
            await delay();

            if (arr[j].value > arr[j + 1].value) {
                // Mark swapping
                arr[j].state = "swapping";
                arr[j + 1].state = "swapping";
                setArray([...arr]);
                await delay();

                // Swap
                const temp = arr[j].value;
                arr[j].value = arr[j + 1].value;
                arr[j + 1].value = temp;
                setArray([...arr]);
                await delay();
            }

            // Reset to default
            arr[j].state = "default";
            arr[j + 1].state = "default";
        }

        // Mark as sorted
        arr[n - i - 1].state = "sorted";
        setArray([...arr]);
    }

    // Mark the first element as sorted
    if (arr.length > 0) {
        arr[0].state = "sorted";
        setArray([...arr]);
    }
};

const codeSnippet = `function bubbleSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
      }
    }
  }
  
  return arr;
}`;

const algorithmSteps = [
    "Start from the first element and compare adjacent elements",
    "If the current element is greater than the next, swap them",
    "Continue to the end of the array (this completes one pass)",
    "The largest element 'bubbles up' to its correct position",
    "Repeat for remaining unsorted portion",
    "Stop when no swaps are needed in a complete pass",
];

export default function BubbleSortPage() {
    return (
        <SortingVisualizer
            title="Bubble Sort"
            description="Bubble Sort is a simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order."
            timeComplexity={{
                best: "O(n)",
                average: "O(n²)",
                worst: "O(n²)",
            }}
            spaceComplexity="O(1)"
            codeSnippet={codeSnippet}
            algorithmSteps={algorithmSteps}
            sortFunction={bubbleSortAlgorithm}
        />
    );
}
