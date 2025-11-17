async function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function doSomeHeavyComputation() {
    const ms = getRandomNumber(10, 3000);
    const shouldThrowError = getRandomNumber(0, 6) === 4;
    if (shouldThrowError) {
        const randomError = getRandomNumber([
            'DB Crashed',
            'Network Error',
            'Invalid Request',
            'Timeout',
            'Internal Server Error',
            'Unknown Error',
        ]);
        throw new Error(randomError);
    }
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`Heavy computation completed in ${ms}ms`);
        }, ms);
    });
}

module.exports = { doSomeHeavyComputation };