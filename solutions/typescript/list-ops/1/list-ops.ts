// Define an internal interface for the linked list nodes.
// This is a minimal, brief addition to properly type the internal linked list structure.
interface ListNode<T> {
  value: T;
  next: ListNode<T> | null;
}

export class List<T> {
  private head: ListNode<T> | null = null;
  private tail: ListNode<T> | null = null;

  // Private constructor to enforce list creation via the static factory method.
  private constructor() {}

  // Static factory method to create a new List instance from given values.
  // It iterates over the values using a `for...of` loop (allowed for Iterables)
  // and adds each value to the new list using an internal helper.
  public static create<T>(...values: T[]): List<T> {
    const newList = new List<T>();
    for (const value of values) {
      newList.add(value);
    }
    return newList;
  }

  // Private helper method to add a single element to the end of the list.
  private add(value: T): void {
    const newNode: ListNode<T> = { value: value, next: null }; // Object literal, not an array literal.

    if (!this.head) {
      // If the list is empty, the new node becomes both head and tail.
      this.head = newNode;
      this.tail = newNode;
    } else {
      // If the list is not empty, append the new node to the current tail.
      this.tail!.next = newNode; // Use `!` to assert `tail` is not null here.
      this.tail = newNode; // Update the tail to the newly added node.
    }
  }

  // Private helper method to add a single element to the beginning of the list.
  private prepend(value: T): void {
    const newNode: ListNode<T> = { value: value, next: null };
    if (!this.head) {
      // If the list is empty, the new node becomes both head and tail.
      this.head = newNode;
      this.tail = newNode;
    } else {
      // If the list is not empty, prepend the new node to the current head.
      newNode.next = this.head;
      this.head = newNode;
    }
  }

  // This `forEach` method is required by the custom `toHaveValues` matcher in `list-ops.test.ts`.
  // It allows the test matcher to iterate and collect values from the list.
  public forEach(callback: (item: T) => void): void {
    let current: ListNode<T> | null = this.head;
    while (current !== null) {
      callback(current.value);
      current = current.next;
    }
  }

  public append(otherList: List<T>): List<T> {
    const newList = new List<T>();
    this.forEach((item) => newList.add(item));
    otherList.forEach((item) => newList.add(item));
    return newList;
  }

  public concat(listOfLists: List<List<T>>): List<T> {
    const resultList = new List<T>();
    this.forEach((item) => resultList.add(item));
    listOfLists.forEach((innerList) => {
      innerList.forEach((item) => resultList.add(item));
    });
    return resultList;
  }

  public filter(predicate: (item: T) => boolean): List<T> {
    const newList = new List<T>();
    this.forEach((item) => {
      if (predicate(item)) {
        newList.add(item);
      }
    });
    return newList;
  }

  public length(): number {
    let count = 0;
    let current = this.head;
    while (current !== null) {
      count++;
      current = current.next;
    }
    return count;
  }

  public map<U>(mapper: (item: T) => U): List<U> {
    const newList = new List<U>();
    this.forEach((item) => newList.add(mapper(item)));
    return newList;
  }

  public foldl<U>(reducer: (acc: U, item: T) => U, initialAccumulator: U): U {
    let accumulator: U = initialAccumulator;
    this.forEach((item) => {
      accumulator = reducer(accumulator, item);
    });
    return accumulator;
  }

  public foldr<U>(reducer: (acc: U, item: T) => U, initialAccumulator: U): U {
    const _foldrRecursive = (node: ListNode<T> | null, acc: U): U => {
      if (node === null) {
        return acc;
      }
      const reducedTail = _foldrRecursive(node.next, acc);
      return reducer(reducedTail, node.value);
    };
    return _foldrRecursive(this.head, initialAccumulator);
  }

  public reverse(): List<T> {
    const newList = new List<T>();
    this.forEach((item) => newList.prepend(item));
    return newList;
  }
}
