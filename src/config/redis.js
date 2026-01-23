const { createClient } = require('redis')

const redisClient = createClient({
    url: 'redis://localhost:6379',
});

redisClient.on('error', (err) => {
    console.error('Redis client error', err);
});

const redisReadClient = redisClient.duplicate();

async function connectRedis(){
    if (!redisClient.isOpen){
        await redisClient.connect();
        console.log('Redis write client connected');
    }

    if (!redisReadClient.isOpen) {
        await redisReadClient.connect();
        console.log('Redis read client connected');
    }
}

module.exports = {
    redisClient,
    redisReadClient,
    connectRedis
}




