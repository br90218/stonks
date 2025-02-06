export function SetRandomInterval(intervalFunction, minDelay, maxDelay, ...args) {
    let timeout;

    const runInterval = () => {
        const timeoutFunction = () => {
            intervalFunction(args);
            runInterval();
        };

        const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

        timeout = setTimeout(timeoutFunction, delay);
    };

    runInterval();

    return {
        clear() {
            clearTimeout(timeout);
        }
    };
}
