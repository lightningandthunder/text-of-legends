import * as prompt from 'prompt';
import { champions, championNamesNormalized } from '../champions/champions';
import { normalizeChampionName } from './normalization';

export async function getChampionFromUser() {
    prompt.start();

    const { championName } = await prompt.get({
        properties: {
            championName: {
                description: 'Please enter a champion name'
            }
        }
    });

    const champNameNormalized: string = normalizeChampionName(championName);
}

