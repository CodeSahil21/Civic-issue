# Redis Implementation Fixes

## 1. Connection Configuration
```typescript
// src/lib/redis.ts
export const redis = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    tls: process.env.REDIS_USE_TLS === 'true',
    connectTimeout: 5000,
    commandTimeout: 5000,
    reconnectStrategy: (retries) => Math.min(retries * 50, 500)
  }
});
```

## 2. Replace KEYS with SCAN
```typescript
// src/lib/cache.ts
const scanKeys = async (pattern: string): Promise<string[]> => {
  const keys: string[] = [];
  let cursor = 0;
  do {
    const result = await redis.scan(cursor, { MATCH: pattern, COUNT: 100 });
    cursor = result.cursor;
    keys.push(...result.keys);
  } while (cursor !== 0);
  return keys;
};

export const deleteCachePattern = async (pattern: string): Promise<void> => {
  try {
    await ensureRedis();
    const keys = await scanKeys(pattern);
    if (keys.length > 0) {
      await redis.del(keys);
    }
  } catch (error) {
    console.error(`Cache delete pattern error for ${pattern}:`, error);
  }
};
```

## 3. Add Cache Metrics
```typescript
// src/lib/cache.ts
let cacheStats = { hits: 0, misses: 0 };

export const getCache = async <T = any>(key: string): Promise<T | null> => {
  try {
    await ensureRedis();
    const cached = await redis.get(key);
    if (cached) {
      cacheStats.hits++;
      return JSON.parse(cached);
    }
    cacheStats.misses++;
    return null;
  } catch (error) {
    cacheStats.misses++;
    console.error(`Cache get error for key ${key}:`, error);
    return null;
  }
};

export const getCacheStats = () => ({
  ...cacheStats,
  hitRate: cacheStats.hits / (cacheStats.hits + cacheStats.misses) || 0
});
```

## 4. Add Missing Route Caching
```typescript
// src/modules/geo/geo.service.ts - ADD CACHING
// src/modules/admin/admin.service.ts - Cache departments/roles
```