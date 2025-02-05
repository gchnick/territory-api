import { Congregation } from "./congregation";

export abstract class CongregationRepository {
  abstract save(congregation: Congregation): Promise<void>;

  abstract deleteAll(): Promise<void>;
}
