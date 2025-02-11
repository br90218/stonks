import { Random } from 'random';

export class RandomGenerator {
    private seed: string | null;
    private rng: Random;

    constructor(seed: string) {
        this.seed = seed;
        this.rng = new Random(this.seed);
    }

    /**
     * Generates the direction of the stock (going up or down?)
     * @returns 1 or -1
     */
    generateDirection() {
        return this.rng.bool() ? 1 : -1;
    }

    randomInterval = (functionToInvoke, minDelay, maxDelay) => {
        let timeout;

        const runInterval = () => {
            const timeOutFunction = () => {
                functionToInvoke();
                runInterval();
            };
            const delay = this.rng.int(minDelay, maxDelay);
            timeout = setTimeout(timeOutFunction, delay);
        };

        runInterval();

        return {
            clear() {
                clearTimeout(timeout);
            }
        };
    };
}
