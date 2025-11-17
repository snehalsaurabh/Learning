const express = require('express');
const responseTime = require('response-time');
const promClient = require('prom-client'); // for monitoring metrics
const { doSomeHeavyComputation } = require('./heavyComputation');

// Winston logger for logging to Loki
const { createLogger, transports } = require("winston");
const LokiTransport = require("winston-loki");

const options = createLogger({
    transports: [
        new LokiTransport({
            labels: {
                app: 'loki-backend-monitoring',
            },
            host: process.env.LOKI_HOST,
        }),
    ],
});
const logger = createLogger(options);
logger.info('Logger initialized');

const app = express();
const PORT = process.env.PORT || 3000;

// Collects default metrics like process cpu usage, memory usage, etc.
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ register: promClient.register });

// Custom histogram for request response time
const reqResponseTimeHistogram = new promClient.Histogram({
    name: 'req_response_time_histogram',
    help: 'Histogram for request response time',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.5, 1, 2.5, 5, 10, 50, 100, 200, 500, 1000],
});

app.use(responseTime((req, res, time) => {
    reqResponseTimeHistogram.observe(time, {
        method: req.method,
        route: req.route.path,
        status_code: res.statusCode,
    });
}));
app.get('/', (req, res) => {
    logger.info('Request received on / route');
    res.send('Hello World');
});

app.get('/heavy-computation', async (req, res) => {
    logger.info('Request received on /heavy-computation route');
    try{
        const result = await doSomeHeavyComputation();
        res.json({ 
            status: 'success',
            message: 'Heavy computation completed successfully in ${timeTaken}ms',
        });
    } catch (error) {
        logger.error('Error in /heavy-computation route', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', promClient.register.contentType);
    res.send(await promClient.register.metrics());
});

app.listen(PORT, () => {
    console.log('Server is running on port 3000');
});