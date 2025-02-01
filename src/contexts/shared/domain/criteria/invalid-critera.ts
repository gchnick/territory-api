export class InvalidCriteria extends Error {
  constructor() {
    super("Limit is required when the cursor is defined");
  }
}
