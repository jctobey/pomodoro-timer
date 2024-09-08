export type ClassValue =
  | ClassArray
  | ClassDictionary
  | string
  | number
  | null
  | boolean
  | undefined;
export type ClassDictionary = Record<string, any>;
export type ClassArray = Array<ClassValue>;

export const classNames = (...args: ClassValue[]): string => {
  const classes: string[] = [];
  args.forEach((arg) => {
    if (!arg) {
      return;
    }
    const argType = typeof arg;
    if (argType === "number" || argType === "string") {
      classes.push(String(arg));
    }
    if (Array.isArray(arg)) {
      classes.push(classNames(...args));
      return;
    }
    if (typeof arg === "object") {
      const objArg = arg as ClassDictionary;
      for (const key in objArg) {
        if (Object.hasOwn(objArg, key) && objArg[key]) {
          classes.push(key);
        }
      }
    }
  });
  return classes.join(" ");
};
