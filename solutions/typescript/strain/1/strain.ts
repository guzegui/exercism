export function keep<T>(array: T[], condition: (element: any) => boolean) {
  return keepOrDiscard("keep", array, condition);
}

export function discard<T>(array: T[], condition: (element: any) => boolean) {
  return keepOrDiscard("discard", array, condition);
}

function keepOrDiscard<T>(
  kOrD: string,
  array: T[],
  condition: (element: any) => boolean,
) {
  if (array.length === 0) {
    return [];
  }

  if (kOrD === "keep") {
    traverseAndCheck(false, array, condition);
  } else if (kOrD === "discard") {
    traverseAndCheck(true, array, condition);
  }
  return array;
}

function indexToRemove<T>(array: T[], indexToRemove: number): T[] {
  const length = array.length;

  if (indexToRemove < 0 || indexToRemove > length || length == 0) {
    return array;
  }

  for (let i = indexToRemove; i < length - 1; i++) {
    array[i] = array[i + 1];
  }

  array.length = length - 1;

  return array;
}

function traverseAndCheck<T>(
  flag: boolean,
  array: T[],
  condition: (element: any) => boolean,
) {
  for (let i = 0; i < array.length; i++) {
    if (condition(array[i]) === flag) {
      indexToRemove(array, i);
      i--;
    }
  }
}
