import * as prompt from 'prompt';
import { ChampionData, getChampDataFromUserInput } from '../champions/champions';
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
