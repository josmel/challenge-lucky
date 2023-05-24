export interface CacheRepository {
  get(key: string): Promise<any | null>;
  set(key: string, value: any): Promise<void>;
  delete(key: string): Promise<void>;
}
