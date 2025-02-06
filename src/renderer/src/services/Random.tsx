import { Random } from 'random';

export function CreateRandomInstance(seed: string) {
    return {
        rnd: new Random(seed),
        GetRandomInt: (rnd: Random, min: number, max: number) => {
            return rnd.int(min, max);
        }
    };
}
