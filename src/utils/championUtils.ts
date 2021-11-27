import * as prompt from 'prompt';
import fs from 'fs';

import { ChampionData, championNormalizationMap, CHAMPIONS } from "../champions/champions";
import { Champion, Modifier, Role } from "../champions/classes";
import { arraysAreEquivalent } from './utils';

export function getChampDataFromUserInput(name: string): ChampionData | null {
    const properName = championNormalizationMap[name];
    if (!properName) {
        return null;
    }
    return { name: properName, roles: CHAMPIONS[properName] };
}

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

export function teamfight(allies: Champion[], enemies: Champion[]) {
    const reducer = (arr: Champion[]) => {
        return arr
            .map(champ => {
                return champ.modifiers.indexOf(Modifier.CARELESS) >= 0 || champ.modifiers.indexOf(Modifier.BAD) >= 0
                    ? Math.random() * 50
                    : Math.random() * 100;
            })
            .reduce((accumulator: number, current: number) => current + accumulator, 0);
    }
    const allyPositioning = reducer(allies);
    const enemyPositioning = reducer(enemies);

    // A positive number would mean an ally advantage and a negative number, an enemy advantage
    let combatInitiationModifier = allyPositioning - enemyPositioning;


}

export function normalizeChampionName(name: string): string {
    const nameLower = name.toLowerCase()
        .replace(/\'/g, '')
        .replace(/\s/g, '')
        .replace(/\./g, '');

    if (nameLower === 'mf') {
        return 'missfortune';
    }
    if (nameLower === 'yi') {
        return 'masteryi';
    }
    if (nameLower === 'akechi') {
        return 'kayn';
    }
    if (nameLower === 'kat') {
        return 'katerina';
    }
    if (nameLower === 'asol') {
        return 'aurelionsol';
    }
    if (nameLower === 'drmundo') {
        return 'mundo';
    }
    if (nameLower === 'jarvan') {
        return 'jarvaniv';
    }
    if (nameLower === 'powder') {
        return 'jinx';
    }

    return nameLower;
}

export function normalizeRole(role: string): Role | null {
    const roleUpper = role.toUpperCase();

    if (roleUpper === 'TOP') {
        return Role.TOP;
    }
    if (['MIDDLE', 'MID'].indexOf(roleUpper) >= 0) {
        return Role.MID;
    }
    if (['BOT', 'BOTTOM', 'ADC'].indexOf(roleUpper) >= 0) {
        return Role.ADC;
    }
    if (['JUNGLE', 'JUNG', 'JNG', 'JG'].indexOf(roleUpper) >= 0) {
        return Role.JNG;
    }
    if (['SUPPORT', 'SUP', 'SP', 'SUPT'].indexOf(roleUpper) >= 0) {
        return Role.SUP;
    }

    return null;
}

// Used to refresh the static JSON files in case the CHAMPIONS array is modified
export function extractNamesForRole(role: Role): string[] {
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

export async function updateChampionFiles(): Promise<void> {
    const champJson = JSON.parse(fs.readFileSync('static/champions.json', 'utf-8'));
    for (const [name, roles] of Object.entries(CHAMPIONS)) {
        if (!arraysAreEquivalent(champJson[name], roles)) {
            return await writeChampionFiles();
        }
    }
}
