import mongoose from 'mongoose';
import { clientPromise } from '../services/redis.service.js';

export const pingHealthCheck = async (req, res) => {
    try {
        // Check MongoDB status
        const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
        
        // Check Redis status
        let redisStatus = 'disconnected';
        try {
            const redisClient = await clientPromise;
            const pingResult = await redisClient.ping();
            if (pingResult === 'PONG') {
                redisStatus = 'connected';
            }
        } catch (error) {
            console.error('Redis ping failed:', error);
        }

        res.status(200).json({
            success: true,
            message: "Health check completed.",
            services: {
                server: 'connected',
                mongodb: mongoStatus,
                redis: redisStatus
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Health check failed.",
            error: error.message
        });
    }
};
