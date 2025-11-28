type GetterFn<T> = () => T;
type SetterFn<T> = (value: T) => void;
type InputPair<T> = [GetterFn<T>, SetterFn<T>];
type Callback = () => void;
type Subject = {
  subscribers: Callback[];
  subscribe: (f: Callback) => void;
  emit: Callback;
};

let callbacks: Callback[] = [];
const last = <T>(xs: T[]): T => xs[xs.length - 1];
const subject: Subject = {
  subscribers: [],
  subscribe(f) {
    subject.subscribers.push(f);
  },
  emit() {
    subject.subscribers.forEach((f) => f());
  },
};

export const createInput = <T>(initialValue: T): InputPair<T> => {
  let value = initialValue;

  const getter: GetterFn<T> = () => value;
  const setter: SetterFn<T> = (v) => {
    value = v;
    subject.emit();
  };

  return [getter, setter];
};

export const createComputed = <T>(
  f: () => T,
  _?: T,
  equalityCheck?: boolean,
): (() => T) => {
  const outputs: T[] = [];

  subject.subscribers = [];
  subject.subscribe(() => {
    const nextOutput = f();

    if (!equalityCheck || (equalityCheck && last(outputs) !== nextOutput)) {
      callbacks.forEach((cb) => cb());
    }

    outputs.push(nextOutput);
  });

  outputs.push(f());

  return f;
};

export const createCallback = <T>(cb: () => T): (() => void) => {
  callbacks.push(cb);

  return (): void => {
    callbacks = callbacks.filter((x) => x !== cb);
  };
};
