import * as prompt from 'prompt';
import fs from 'fs';

import { ChampionData, championNormalizationMap, CHAMPIONS } from '../champions/champions';
import { Modifier, Role, Event } from '../classes/enums'
import { arraysAreEquivalent } from './utils';
import Champion from '../classes/champion';

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

export function teamfight(allies: Champion[], enemies: Champion[], initialAllyPositionValue: number = 0) {
    const reducer = (arr: Champion[]) => {
        return arr
            .map(champ => {
                let factor = 1;

                if (champ.modifiers.indexOf(Modifier.CARELESS) >= 0) {
                    factor -= .35;
                } else if (champ.modifiers.indexOf(Modifier.CAREFUL) >= 0) {
                    factor += .35;
                }

                if (champ.modifiers.indexOf(Modifier.BAD) >= 0) {
                    factor -= .20;
                } else if (champ.modifiers.indexOf(Modifier.GODLIKE) >= 0) {
                    factor += .20;
                }

                return (
                    (Math.random()
                    * factor
                    * champ.getTraitEffects(Event.TEAMFIGHT_SETUP))
                    + arr.length
                );
            })
            .reduce((accumulator: number, current: number) => current + accumulator, 0);
    }

    const allyPositioning = initialAllyPositionValue + reducer(allies);
    const enemyPositioning = reducer(enemies);

    // A positive number would mean an ally advantage and a negative number, an enemy advantage
    // Add 5% * this factor to strength for champions on the team with better position
    const strengthFactor = 1 + (0.05 * Math.floor(allyPositioning - enemyPositioning));

    console.log(`Initiating combat with modifier ${strengthFactor}`);

    let allyDeaths: number = 0;
    let enemyDeaths: number = 0;

    const alliesSortedByWeakness = allies.sort((a, b) => a.strength - b.strength);
    const enemiesSortedByWeakness = enemies.sort((a, b) => a.strength - b.strength);

    console.log(alliesSortedByWeakness.map(c => c.modifiers).filter(m => m.length));
    console.log(enemiesSortedByWeakness.map(c => c.modifiers).filter(m => m.length));

    const strengthDifferential = (sumStrength(allies) * strengthFactor) - sumStrength(enemies);

    console.log(`Strength differential ${strengthDifferential}`)

    // TODO:
    // Decide kills
    // Record kills, deaths, and assists - assists can just go to teammates that didn't get the kill
}

export function sumStrength(arr: Champion[]): number {
    return arr.map(c => c.strength).reduce((acc, current) => current + acc, 0);
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
    if (nameLower === 'violet') {
        return 'vi';
    }
    if (nameLower === 'mayumi') {
        return 'bard';
    }
    if (nameLower === 'j4' || nameLower === 'jarvan') {
        return 'jarvaniv';
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
    if (['BOT', 'BOTTOM', 'ADC', 'ADCARRY'].indexOf(roleUpper) >= 0) {
        return Role.ADC;
    }
    if (['JUNGLE', 'JUNG', 'JNG', 'JG', 'FILL'].indexOf(roleUpper) >= 0) {
        return Role.JNG;
    }
    if (['SUPPORT', 'SUP', 'SP', 'SUPT'].indexOf(roleUpper) >= 0) {
        return Role.SUP;
    }

    return null;
}

export function getChampionByRole(champions: Champion[], role: Role): Champion | undefined {
    return champions.find(c => c.role === role);
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
