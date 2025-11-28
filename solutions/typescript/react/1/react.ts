// react.ts (Refactored to implement a proper reactive system)

type GetterFn<T> = () => T;
type SetterFn<T> = (value: T) => void;
type InputPair<T> = [GetterFn<T>, SetterFn<T>];
type Unsubscribe = () => void;

// Define a common interface for cells that can be observed
interface Observable<T> {
  getValue: GetterFn<T>;
  addObserver: (observer: () => void) => Unsubscribe;
}

// Global variable (a stack) to capture dependencies during a computation.
// This allows nested computations and ensures the correct observers are registered.
const dependencyStack: Set<Observable<any>>[] = [];

// Base class for all cells, providing common observer management and dependency tracking
abstract class BaseCell<T> implements Observable<T> {
  protected _value: T;
  protected _observers = new Set<() => void>(); // Callbacks or dependent computed cells

  constructor(initialValue: T) {
    this._value = initialValue;
  }

  // When getValue() is called, if a computation is active (i.e., dependencyStack is not empty),
  // this cell registers itself as a dependency for the current computation.
  getValue(): T {
    if (dependencyStack.length > 0) {
      dependencyStack[dependencyStack.length - 1].add(this);
    }
    return this._value;
  }

  // Allows other cells or callbacks to subscribe to this cell's changes.
  addObserver(observer: () => void): Unsubscribe {
    this._observers.add(observer);
    return () => this._observers.delete(observer);
  }

  // Notifies all subscribed observers that the cell's value might have changed.
  protected _notifyObservers(): void {
    // In a more complex system, this might use a topological sort or microtask queue
    // to ensure correct update order and avoid re-entrancy. For this basic system,
    // direct notification is sufficient, assuming no circular dependencies are introduced manually.
    this._observers.forEach(observer => observer());
  }
}

// InputCell represents a settable value in the reactive system.
export class InputCell<T> extends BaseCell<T> {
  constructor(initialValue: T) {
    super(initialValue);
  }

  // Sets a new value and notifies all observers if the value has changed.
  setValue(newValue: T): void {
    if (this._value !== newValue) {
      this._value = newValue;
      this._notifyObservers();
    }
  }
}

// Factory function to create an InputPair (getter and setter) for an InputCell.
export const createInput = <T>(initialValue: T): InputPair<T> => {
  const cell = new InputCell(initialValue);
  return [() => cell.getValue(), (v) => cell.setValue(v)];
};

// ComputedCell represents a value derived from other cells.
export class ComputedCell<T> extends BaseCell<T> {
  private _computeFn: () => T;
  private _equalityCheck: boolean;
  private _dependencyUnsubscribes: Unsubscribe[] = [];

  constructor(computeFn: () => T, _?: T, equalityCheck: boolean = false) {
    // Initial value calculation: run `computeFn` once to set an initial value for `BaseCell`
    // without establishing dependencies yet.
    super(computeFn());
    this._computeFn = computeFn;
    this._equalityCheck = equalityCheck;

    // Perform the first proper recomputation to establish dependencies and potentially
    // update the initial value if `computeFn()` was a dummy call.
    this._recompute();
  }

  // Cleans up subscriptions to previous dependencies.
  private _cleanupDependencies(): void {
    this._dependencyUnsubscribes.forEach(unsubscribe => unsubscribe());
    this._dependencyUnsubscribes = [];
  }

  // Recomputes the cell's value and re-establishes its dependencies.
  private _recompute(): void {
    this._cleanupDependencies(); // Remove old subscriptions from dependencies

    const currentDependencies = new Set<Observable<any>>();
    dependencyStack.push(currentDependencies); // Push a new scope for capturing dependencies

    let newValue: T;
    try {
      newValue = this._computeFn(); // Run computation; calls to `getValue` inside will populate `currentDependencies`
    } finally {
      dependencyStack.pop(); // Pop the scope
    }

    // Subscribe to all newly captured dependencies. Each dependency will call `_recompute`
    // for this cell when its own value changes.
    currentDependencies.forEach(dep => {
      this._dependencyUnsubscribes.push(dep.addObserver(() => this._recompute()));
    });

    // Check if the value actually changed based on the `equalityCheck` flag.
    const oldValue = this._value;
    let valueChanged = false;

    if (this._equalityCheck) {
      if (oldValue !== newValue) {
        this._value = newValue;
        valueChanged = true;
      }
    } else {
      // If no equality check, always consider it changed if `_recompute` was triggered
      // and update the value.
      this._value = newValue;
      valueChanged = true;
    }

    // If the value changed (or `equalityCheck` was false), notify this cell's own observers.
    if (valueChanged) {
      this._notifyObservers();
    }
  }
}

// Factory function to create a getter for a ComputedCell.
export const createComputed = <T>(
  f: () => T,
  _?: T, // This parameter is ignored, kept for API compatibility with original code
  equalityCheck: boolean = false,
): GetterFn<T> => {
  const cell = new ComputedCell(f, _, equalityCheck);
  return () => cell.getValue();
};

// Creates a callback that listens to changes in other cells.
// The callback function `cb` is executed once initially to discover its dependencies,
// and then again whenever any of its dependencies change.
export const createCallback = <T>(cb: () => T): Unsubscribe => {
  const capturedDependencies = new Set<Observable<any>>();
  dependencyStack.push(capturedDependencies); // Start capturing dependencies

  let initialRunValue: T;
  try {
    // Run the user's callback once to establish initial state and capture dependencies.
    // The value returned is not directly used by `createCallback` but by the caller's closure.
    initialRunValue = cb();
  } finally {
    dependencyStack.pop(); // Stop capturing dependencies
  }

  // The actual function that will be registered as an observer.
  // When triggered by a dependency, it simply re-executes the user's callback.
  const actualCallback = () => {
    cb();
  };

  const unsubscribes: Unsubscribe[] = [];
  capturedDependencies.forEach(dep => {
    unsubscribes.push(dep.addObserver(actualCallback));
  });

  return () => {
    unsubscribes.forEach(unsubscribe => unsubscribe());
  };
};
