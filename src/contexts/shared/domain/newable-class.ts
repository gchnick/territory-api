/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface NewableClass<T> extends Function {
  new (...args: any[]): T;
}
