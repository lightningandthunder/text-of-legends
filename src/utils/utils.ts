import * as prompt from 'prompt';
import fs from 'fs';

import { ChampionData, getChampDataFromUserInput, CHAMPIONS } from '../champions/champions';
import { Role } from '../champions/classes';
import { normalizeChampionName, normalizeRole } from './normalization';

export async function getChampionFromUser(): Promise<{ data: ChampionData, selectedRole: Role }> {
    prompt.start();
    const { championName } = await prompt.get({
        properties: {
            championName: {
                description: 'Please enter a champion name'
            }
        }
    });
    const champNameNormalized: string = normalizeChampionName(championName);

    const data: ChampionData | null = getChampDataFromUserInput(champNameNormalized)
    if (!data) {
        console.error('Invalid name entry.');
        process.exit(1);
    }

    const { userRole } = await prompt.get({
        properties: {
            userRole: {
                description: 'Please enter a role'
            }
        }
    });

    let selectedRole = normalizeRole(userRole);
    if (selectedRole === null) {
        console.error('Invalid role entry.');
        process.exit(1);
    }

    return { data: data, selectedRole: selectedRole }
}

export function getRandomObjectKey(obj: any) {
    const keys = Object.keys(obj);
    return keys[keys.length * Math.random() << 0];
};

export function getRandomArrayElement(arr: Array<any>) {
    return Math.floor(Math.random() * arr.length);
}

// Used to refresh the static JSON files in case the CHAMPIONS array is modified
function extractNamesForRole(role: Role): string[] {
    return Object.entries(CHAMPIONS)
        .filter(([k, v]) => v.indexOf(role) >= 0)
        .map(([name, _]) => name)
}

export async function writeChampionFiles() {
    console.log('Writing new champion files...')
    for (const role of Object.values(Role)) {
        fs.writeFile(`static/${role.toString().toLowerCase()}.json`, JSON.stringify(extractNamesForRole(role)), () => { });
    }

    fs.writeFile('static/champions.json', JSON.stringify(CHAMPIONS), () => { });
}

function arraysAreEquivalent(arr1: any[], arr2: any[]) {
    if (arr1 === undefined || arr2 === undefined) {
        return false;
    }
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (const element of arr1) {
        if (arr2.indexOf(element) < 0) {
            return false;
        }
    }
    return true;
}

export async function updateChampionFiles(): Promise<void> {
    const champJson = JSON.parse(fs.readFileSync('static/champions.json', 'utf-8'));
    for (const [name, roles] of Object.entries(CHAMPIONS)) {
        if (!arraysAreEquivalent(champJson[name], roles)) {
            return await writeChampionFiles();
        }
    }
}
