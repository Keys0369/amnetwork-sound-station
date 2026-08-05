import type { StorageProvider } from "@amnetwork/types";

/**
 * LocalStorage implementation of StorageProvider
 * Suitable for web applications with small data volumes
 */
export class LocalStorageProvider implements StorageProvider {
  private prefix = "@amnetwork:";

  async get<T>(key: string): Promise<T | null> {
    try {
      const prefixedKey = this.prefix + key;
      const item = localStorage.getItem(prefixedKey);

      if (!item) {
        return null;
      }

      const parsed = JSON.parse(item);

      if (parsed.expiresAt && new Date(parsed.expiresAt) < new Date()) {
        await this.remove(key);
        return null;
      }

      return parsed.value as T;
    } catch (error) {
      console.error(`Storage get error for key "${key}":`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T, expiresAt?: Date): Promise<void> {
    try {
      const prefixedKey = this.prefix + key;
      const item = {
        value,
        expiresAt: expiresAt?.toISOString(),
      };
      localStorage.setItem(prefixedKey, JSON.stringify(item));
    } catch (error) {
      console.error(`Storage set error for key "${key}":`, error);
    }
  }

  async remove(key: string): Promise<void> {
    try {
      const prefixedKey = this.prefix + key;
      localStorage.removeItem(prefixedKey);
    } catch (error) {
      console.error(`Storage remove error for key "${key}":`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.error("Storage clear error:", error);
    }
  }

  async keys(): Promise<string[]> {
    try {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.prefix)) {
          keys.push(key.replace(this.prefix, ""));
        }
      }
      return keys;
    } catch (error) {
      console.error("Storage keys error:", error);
      return [];
    }
  }
}

/**
 * In-memory storage implementation for testing and development
 */
export class MemoryStorageProvider implements StorageProvider {
  private store = new Map<string, { value: any; expiresAt?: Date }>();

  async get<T>(key: string): Promise<T | null> {
    try {
      const item = this.store.get(key);

      if (!item) {
        return null;
      }

      if (item.expiresAt && item.expiresAt < new Date()) {
        this.store.delete(key);
        return null;
      }

      return item.value as T;
    } catch (error) {
      console.error(`Storage get error for key "${key}":`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T, expiresAt?: Date): Promise<void> {
    try {
      this.store.set(key, { value, expiresAt });
    } catch (error) {
      console.error(`Storage set error for key "${key}":`, error);
    }
  }

  async remove(key: string): Promise<void> {
    try {
      this.store.delete(key);
    } catch (error) {
      console.error(`Storage remove error for key "${key}":`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      this.store.clear();
    } catch (error) {
      console.error("Storage clear error:", error);
    }
  }

  async keys(): Promise<string[]> {
    return Array.from(this.store.keys());
  }
}

/**
 * Factory for creating storage providers
 */
export function createStorageProvider(type: "local" | "memory" = "local"): StorageProvider {
  if (type === "memory") {
    return new MemoryStorageProvider();
  }

  // Default to localStorage if available, else memory
  if (typeof localStorage !== "undefined") {
    return new LocalStorageProvider();
  }

  console.warn("localStorage not available, falling back to memory storage");
  return new MemoryStorageProvider();
}

// Export default instance
export const storage = createStorageProvider();
