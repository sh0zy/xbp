export class LocalStorageRepository<T> {
  private key: string;
  constructor(key: string) {
    this.key = key;
  }

  getAll(): T[] {
    try {
      const raw = localStorage.getItem(this.key);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  setAll(items: T[]): void {
    localStorage.setItem(this.key, JSON.stringify(items));
  }

  getSingle(): T | null {
    try {
      const raw = localStorage.getItem(this.key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  setSingle(item: T): void {
    localStorage.setItem(this.key, JSON.stringify(item));
  }

  clear(): void {
    localStorage.removeItem(this.key);
  }
}
