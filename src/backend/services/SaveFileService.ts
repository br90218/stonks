import fs from 'fs';
import { homedir } from 'os';
import path from 'path';
import { RunFile } from './Objects';

//WARN: All the savefile directories are local.
//This will break, not to mention it isn't safe.
const SAVEDIR = homedir() + '\\Documents\\stonk balatro\\runfile.json';

export function RetrieveRunFile(offline = false): RunFile | null {
    if (offline) {
        let runFileJSON: string = '';
        try {
            runFileJSON = fs.readFileSync(SAVEDIR, 'utf-8');
        } catch (err) {
            console.error(err);
        }
        if (runFileJSON != '') {
            console.log('runfile found');
            const jsonObject = JSON.parse(runFileJSON);
            const runFile: RunFile = {
                name: jsonObject.name,
                seed: jsonObject.seed
            };
            return runFile;
        }
        return null;
    } else {
        //TODO: no online save yet.
        console.error('not implemented');
        return null;
    }
}

/**
 * `CreateNewRunFile` does not save. Use `SaveRunFile` immediately afterwards.
 */
export function CreateNewRunFile(name: string, seed: string): RunFile {
    const runFile: RunFile = {
        name: name,
        seed: seed
    };

    return runFile;
}

export function SaveRunFile(runFile: RunFile, offline = false): void {
    if (offline) {
        const runFileJSON = JSON.stringify(runFile);
        try {
            fs.writeFileSync(path.resolve(SAVEDIR), runFileJSON);
        } catch (err) {
            console.error(err);
        }
        return;
    }
    //TODO: no online mode... may have to wait until the day we go on steam...
}
