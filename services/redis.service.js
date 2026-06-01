import Redis from 'ioredis';
import { getConfig } from '../config/config.js';

let redisClient = null;

async function createRedisClient() {
    if (redisClient) return redisClient;
    
    const config = await getConfig();
    redisClient = new Redis({
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password
    });

    redisClient.on('connect', () => {
        console.log('Connected to Redis');
    });

    redisClient.on('error', (err) => {
        console.error('Redis connection error:', err);
    });

    return redisClient;
}

// Initialize immediately
const clientPromise = createRedisClient();

// Export a proxy that lazily resolves the client
export default {
    get: async (...args) => (await clientPromise).get(...args),
    set: async (...args) => (await clientPromise).set(...args),
    del: async (...args) => (await clientPromise).del(...args),
};

export { clientPromise, createRedisClient };