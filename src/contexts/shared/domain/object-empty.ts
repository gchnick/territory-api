export const isObjectEmpty = (object?: unknown) => {
  return JSON.stringify(object) === "{}";
};

export const isNotObjectEmpty = (object?: unknown) => {
  return !isObjectEmpty(object);
};
