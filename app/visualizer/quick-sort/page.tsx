"use client";

import { SortingVisualizer, ArrayBar } from "@/components/visualizer/sorting-visualizer";

const quickSortAlgorithm = async (
    array: ArrayBar[],
    setArray: React.Dispatch<React.SetStateAction<ArrayBar[]>>,
    delay: () => Promise<void>,
    isCancelled: React.MutableRefObject<boolean>
) => {
    const arr = [...array];

    const partition = async (low: number, high: number): Promise<number> => {
        const pivot = arr[high].value;
        arr[high].state = "pivot";
        setArray([...arr]);
        await delay();

        let i = low - 1;

        for (let j = low; j < high; j++) {
            if (isCancelled.current) return i + 1;

            arr[j].state = "comparing";
            setArray([...arr]);
            await delay();

            if (arr[j].value < pivot) {
                i++;
                if (i !== j) {
                    arr[i].state = "swapping";
                    arr[j].state = "swapping";
                    setArray([...arr]);
                    await delay();

                    const temp = arr[i].value;
                    arr[i].value = arr[j].value;
                    arr[j].value = temp;
                }
            }

            arr[j].state = "default";
            if (i >= low) arr[i].state = "default";
        }

        // Swap pivot to correct position
        arr[i + 1].state = "swapping";
        arr[high].state = "swapping";
        setArray([...arr]);
        await delay();

        const temp = arr[i + 1].value;
        arr[i + 1].value = arr[high].value;
        arr[high].value = temp;

        arr[i + 1].state = "sorted";
        arr[high].state = "default";
        setArray([...arr]);

        return i + 1;
    };

    const quickSort = async (low: number, high: number) => {
        if (low < high && !isCancelled.current) {
            const pi = await partition(low, high);
            await quickSort(low, pi - 1);
            await quickSort(pi + 1, high);
        } else if (low === high) {
            arr[low].state = "sorted";
            setArray([...arr]);
        }
    };

    await quickSort(0, arr.length - 1);

    // Mark all as sorted
    for (let i = 0; i < arr.length; i++) {
        arr[i].state = "sorted";
    }
    setArray([...arr]);
};

const codeSnippet = `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`;

const algorithmSteps = [
    "Choose a pivot element (typically last element)",
    "Partition: place smaller elements before pivot, larger after",
    "The pivot is now in its final sorted position",
    "Recursively apply to left sub-array",
    "Recursively apply to right sub-array",
    "Continue until all elements are in place",
];

export default function QuickSortPage() {
    return (
        <SortingVisualizer
            title="Quick Sort"
            description="Quick Sort is a highly efficient divide-and-conquer algorithm that selects a 'pivot' element and partitions the array around it. It's widely used due to its excellent average-case performance."
            timeComplexity={{
                best: "O(n log n)",
                average: "O(n log n)",
                worst: "O(n²)",
            }}
            spaceComplexity="O(log n)"
            codeSnippet={codeSnippet}
            algorithmSteps={algorithmSteps}
            sortFunction={quickSortAlgorithm}
        />
    );
}
