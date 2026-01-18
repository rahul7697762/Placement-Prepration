"use client";

import { SortingVisualizer, ArrayBar } from "@/components/visualizer/sorting-visualizer";

const mergeSortAlgorithm = async (
    array: ArrayBar[],
    setArray: React.Dispatch<React.SetStateAction<ArrayBar[]>>,
    delay: () => Promise<void>,
    isCancelled: React.MutableRefObject<boolean>
) => {
    const arr = [...array];

    const merge = async (left: number, mid: number, right: number) => {
        if (isCancelled.current) return;

        const leftArr = arr.slice(left, mid + 1).map(b => b.value);
        const rightArr = arr.slice(mid + 1, right + 1).map(b => b.value);

        let i = 0, j = 0, k = left;

        // Highlight merge section
        for (let x = left; x <= right; x++) {
            arr[x].state = "comparing";
        }
        setArray([...arr]);
        await delay();

        while (i < leftArr.length && j < rightArr.length) {
            if (isCancelled.current) return;

            if (leftArr[i] <= rightArr[j]) {
                arr[k].value = leftArr[i];
                arr[k].state = "swapping";
                setArray([...arr]);
                await delay();
                i++;
            } else {
                arr[k].value = rightArr[j];
                arr[k].state = "swapping";
                setArray([...arr]);
                await delay();
                j++;
            }
            arr[k].state = "current";
            k++;
        }

        while (i < leftArr.length) {
            if (isCancelled.current) return;
            arr[k].value = leftArr[i];
            arr[k].state = "current";
            setArray([...arr]);
            await delay();
            i++;
            k++;
        }

        while (j < rightArr.length) {
            if (isCancelled.current) return;
            arr[k].value = rightArr[j];
            arr[k].state = "current";
            setArray([...arr]);
            await delay();
            j++;
            k++;
        }

        // Mark merged section
        for (let x = left; x <= right; x++) {
            arr[x].state = right === arr.length - 1 && left === 0 ? "sorted" : "default";
        }
        setArray([...arr]);
    };

    const mergeSort = async (left: number, right: number) => {
        if (left < right && !isCancelled.current) {
            const mid = Math.floor((left + right) / 2);
            await mergeSort(left, mid);
            await mergeSort(mid + 1, right);
            await merge(left, mid, right);
        }
    };

    await mergeSort(0, arr.length - 1);

    // Mark all as sorted
    for (let i = 0; i < arr.length; i++) {
        arr[i].state = "sorted";
    }
    setArray([...arr]);
};

const codeSnippet = `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  
  return [...result, ...left.slice(i), ...right.slice(j)];
}`;

const algorithmSteps = [
    "Divide the array into two halves",
    "Recursively sort each half",
    "Merge the two sorted halves",
    "Compare elements from both halves",
    "Place smaller element first in merged array",
    "Continue until all elements are merged",
];

export default function MergeSortPage() {
    return (
        <SortingVisualizer
            title="Merge Sort"
            description="Merge Sort is a divide-and-conquer algorithm that divides the array into halves, recursively sorts them, and then merges the sorted halves. It's stable and guarantees O(n log n) time."
            timeComplexity={{
                best: "O(n log n)",
                average: "O(n log n)",
                worst: "O(n log n)",
            }}
            spaceComplexity="O(n)"
            codeSnippet={codeSnippet}
            algorithmSteps={algorithmSteps}
            sortFunction={mergeSortAlgorithm}
        />
    );
}
