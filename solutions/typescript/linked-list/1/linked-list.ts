class Node<T> {
  value: T;
  next: Node<T> | null;
  prev: Node<T> | null;

  constructor(value: T) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

export class LinkedList<TElement> {
  private head: Node<TElement> | null;
  private tail: Node<TElement> | null;
  private _count: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this._count = 0;
  }

  public push(element: TElement): void {
    const newNode = new Node(element);
    if (this.tail) {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    } else {
      this.head = newNode;
      this.tail = newNode;
    }
    this._count++;
  }

  public pop(): TElement | undefined {
    if (!this.tail) {
      return undefined; // Or throw an error, depending on desired behavior for empty list
    }
    const value = this.tail.value;
    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
    } else {
      this.tail = this.tail.prev;
      if (this.tail) {
        this.tail.next = null;
      }
    }
    this._count--;
    return value;
  }

  public shift(): TElement | undefined {
    if (!this.head) {
      return undefined; // Or throw an error
    }
    const value = this.head.value;
    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
    } else {
      this.head = this.head.next;
      if (this.head) {
        this.head.prev = null;
      }
    }
    this._count--;
    return value;
  }

  public unshift(element: TElement): void {
    const newNode = new Node(element);
    if (this.head) {
      this.head.prev = newNode;
      newNode.next = this.head;
      this.head = newNode;
    } else {
      this.head = newNode;
      this.tail = newNode;
    }
    this._count++;
  }

  public delete(element: TElement): void {
    let current = this.head;
    while (current) {
      if (current.value === element) {
        if (current === this.head && current === this.tail) {
          // Only one element in the list
          this.head = null;
          this.tail = null;
        } else if (current === this.head) {
          // Deleting the head
          this.head = current.next;
          if (this.head) {
            this.head.prev = null;
          }
        } else if (current === this.tail) {
          // Deleting the tail
          this.tail = current.prev;
          if (this.tail) {
            this.tail.next = null;
          }
        } else {
          // Deleting a middle element
          if (current.prev) {
            current.prev.next = current.next;
          }
          if (current.next) {
            current.next.prev = current.prev;
          }
        }
        this._count--;
        break; // Only delete the first occurrence
      }
      current = current.next;
    }
  }

  public count(): number {
    return this._count;
  }
}
