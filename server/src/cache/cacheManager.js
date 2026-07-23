class CacheManager {
  constructor() {
    this.cache = new Map();
    this.hits = 0;
    this.misses = 0;
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) {
      this.misses++;
      return null;
    }
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }
    this.hits++;
    return item.value;
  }

  set(key, value, ttlSeconds = 300) {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { value, expiresAt });
  }

  del(key) {
    this.cache.delete(key);
  }

  invalidatePlayer(playerId) {
    for (const key of this.cache.keys()) {
      if (key.includes(`player:${playerId}`) || key.includes('leaderboard')) {
        this.cache.delete(key);
      }
    }
    console.log(`🧹 Cache invalidated for player ID ${playerId} and leaderboards.`);
  }

  clear() {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  getStats() {
    const totalRequests = this.hits + this.misses;
    const hitRate = totalRequests > 0 ? ((this.hits / totalRequests) * 100).toFixed(1) : 0;
    return {
      size: this.cache.size,
      hits: this.hits,
      misses: this.misses,
      hitRate: `${hitRate}%`
    };
  }
}

export const cache = new CacheManager();
export default cache;
