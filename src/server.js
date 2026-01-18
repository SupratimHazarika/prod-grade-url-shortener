const { connectRedis } = require('./config/redis');
const app = require('./app');

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await connectRedis(); // 1️⃣ Redis ready
        app.listen(PORT, () => {
            console.log(`App is listening on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

startServer();


