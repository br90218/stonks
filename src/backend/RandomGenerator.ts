import { Random } from 'random';

export class RandomGenerator {
    private seed: string | null;
    private rng: Random;

    constructor(seed: string) {
        this.seed = seed;
        this.rng = new Random(this.seed);
    }

    generatePosOrNeg() {
        return this.rng.bool() ? 1 : -1;
    }
}
