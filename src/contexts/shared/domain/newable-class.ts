/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface NewableClass<T> extends Function {
  // eslint-disable-next-line @typescript-eslint/prefer-function-type
  new (...args: any[]): T;
}
