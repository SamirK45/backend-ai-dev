import jwt from 'jsonwebtoken';
import redisClient from '../services/redis.service.js';
import { getConfig } from '../config/config.js';

export const authUser = async (req,res,next)=>{
    try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if(!token){
        return res.status(401).json({error: 'Unauthorized User '})
    }
      const isBlackListed = await redisClient.get(token);

      if(isBlackListed){
        res.cookie('token', '',);
            return res.status(401).json({error: 'Unauthorized User '})
      }

        const config = await getConfig();
        const decoded = jwt.verify(token, config.jwt.secret);
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({error: 'Unauthorized access '})
    }
}