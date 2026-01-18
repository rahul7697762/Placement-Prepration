"use client";

import { SortingVisualizer, ArrayBar } from "@/components/visualizer/sorting-visualizer";

const selectionSortAlgorithm = async (
    array: ArrayBar[],
    setArray: React.Dispatch<React.SetStateAction<ArrayBar[]>>,
    delay: () => Promise<void>,
    isCancelled: React.MutableRefObject<boolean>
) => {
    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        if (isCancelled.current) return;

        let minIdx = i;
        arr[i].state = "current";
        setArray([...arr]);
        await delay();

        for (let j = i + 1; j < n; j++) {
            if (isCancelled.current) return;

            arr[j].state = "comparing";
            setArray([...arr]);
            await delay();

            if (arr[j].value < arr[minIdx].value) {
                if (minIdx !== i) {
                    arr[minIdx].state = "default";
                }
                minIdx = j;
                arr[minIdx].state = "pivot";
            } else {
                arr[j].state = "default";
            }
            setArray([...arr]);
        }

        if (minIdx !== i) {
            // Swap
            arr[i].state = "swapping";
            arr[minIdx].state = "swapping";
            setArray([...arr]);
            await delay();

            const temp = arr[i].value;
            arr[i].value = arr[minIdx].value;
            arr[minIdx].value = temp;

            arr[minIdx].state = "default";
        }

        arr[i].state = "sorted";
        setArray([...arr]);
    }

    // Mark last element as sorted
    if (arr.length > 0) {
        arr[n - 1].state = "sorted";
        setArray([...arr]);
    }
};

const codeSnippet = `function selectionSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    
    // Find minimum in unsorted portion
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    
    // Swap minimum with first unsorted
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  
  return arr;
}`;

const algorithmSteps = [
    "Find the minimum element in the unsorted portion",
    "Swap it with the first unsorted element",
    "Move the boundary of sorted portion one step right",
    "Repeat until the entire array is sorted",
    "Each pass places one element in its final position",
];

export default function SelectionSortPage() {
    return (
        <SortingVisualizer
            title="Selection Sort"
            description="Selection Sort is an in-place comparison sorting algorithm that divides the input into a sorted and unsorted region, repeatedly selecting the smallest element from the unsorted region."
            timeComplexity={{
                best: "O(n²)",
                average: "O(n²)",
                worst: "O(n²)",
            }}
            spaceComplexity="O(1)"
            codeSnippet={codeSnippet}
            algorithmSteps={algorithmSteps}
            sortFunction={selectionSortAlgorithm}
        />
    );
}
