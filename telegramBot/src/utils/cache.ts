import NodeCache from 'node-cache';
import { logger } from './logger';

class CacheService {
    private cache: NodeCache;

    constructor() {
        this.cache = new NodeCache({
        stdTTL: 600, // 10 минут по умолчанию
        checkperiod: 60,
        useClones: false
        });
    }

    set(key: string, value: any, ttl?: number): boolean {
        if (ttl) {
            const success = this.cache.set(key, value, ttl);
            if (success) {
            logger.debug(`Cache set: ${key}`);
            }
            return success;
        }
        return false;
    }

    get<T>(key: string): T | undefined {
        const value = this.cache.get<T>(key);
        if (value !== undefined) {
        logger.debug(`Cache hit: ${key}`);
        } else {
        logger.debug(`Cache miss: ${key}`);
        }
        return value;
    }

    del(key: string): number {
        const deleted = this.cache.del(key);
        if (deleted > 0) {
        logger.debug(`Cache deleted: ${key}`);
        }
        return deleted;
    }

    flush(): void {
        this.cache.flushAll();
        logger.info('Cache flushed');
    }
    }

export const cache = new CacheService();