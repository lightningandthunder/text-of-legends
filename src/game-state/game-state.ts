import { CHAMPIONS } from "../champions/champions";
import fs from 'fs';

import { Champion, Alignment, Role } from "../champions/classes"
import { getRandomObjectKey, getRandomArrayElement } from "../utils/utils";
import { getChampionFromUser } from "../utils/championUtils";

export default class GameState {
    player: Champion | undefined;
    allies: Champion[] = [];
    enemies: Champion[] = [];

    constructor() { }

    async initGame() {
        const { data, selectedRole } = await getChampionFromUser();
        this.player = new Champion(data.name, data.roles)
            .setAlignment(Alignment.PLAYER)
            .setRole(selectedRole);

        this.setAlliesAndEnemies(this.player);

        return {
            player: { name: this.player.name, role: this.player.role },
            allies: this.allies.map(champ => { return { name: champ.name, role: champ.role } }),
            enemies: this.enemies.map(champ => { return { name: champ.name, role: champ.role } }),
        }
    }

    // TODO:
    // startGameTop(), based on TP decisions and mid/jg interactions
    // startGameMid(), based on roaming decisions
    // startGameAdc(), based on whether or not to commit to teamfights
    // startGameJng(), based on ganking decisions and initiating objectives
    // startGameSup(), based on roaming and whether or not to abandon lane

    private startGameMid() {

    }

    // TODO: make this DRY
    private setAlliesAndEnemies(playerChampion: Champion) {
        const allies: Champion[] = [playerChampion];
        const allyRolesRemaining: Role[] = Object.values(Role);
        allyRolesRemaining.splice(allyRolesRemaining.indexOf(playerChampion.role), 1);
        const enemies: Champion[] = [];
        const enemyRolesRemaining: Role[] = Object.values(Role);

        const allyIsOffMeta: boolean = Math.random() > 0.85;
        const enemyIsOffMeta: boolean = Math.random() > 0.90;

        if (allyIsOffMeta) {
            // Pick a random champion
            let championName: string = playerChampion.name;
            while (championName === playerChampion.name) {
                championName = getRandomObjectKey(CHAMPIONS);
            }

            // Select a random role
            let offMetaRole: Role = playerChampion.role;
            while (CHAMPIONS[championName].indexOf(offMetaRole) >= 0 || allyRolesRemaining.indexOf(offMetaRole) < 0) {
                offMetaRole = getRandomArrayElement(Object.values(Role));
            }

            // Remove it from remaining roles and set up our new champion in an off-meta role
            allyRolesRemaining.splice(allyRolesRemaining.indexOf(offMetaRole), 1);
            allies.push(
                new Champion(championName, CHAMPIONS[championName])
                    .setAlignment(Alignment.ALLY)
                    .setRole(offMetaRole)
            );
        }

        for (const role of allyRolesRemaining) {
            let championName: string = playerChampion.name;
            const roleChampionNames: string[] = JSON.parse(fs.readFileSync(`static/${role.toString().toLowerCase()}.json`, 'utf-8'));
            const allyChampionNames = allies.map(champ => champ.name);
            while (allyChampionNames.indexOf(championName) >= 0) {
                championName = getRandomArrayElement(roleChampionNames);
            }
            allies.push(
                new Champion(championName, CHAMPIONS[championName])
                    .setAlignment(Alignment.ALLY)
                    .setRole(role)
            );
        }

        if (enemyIsOffMeta) {
            // Pick a random champion
            let championName: string = playerChampion.name;
            while (allies.map(champ => champ.name).indexOf(championName) >= 0) {
                championName = getRandomObjectKey(CHAMPIONS);
            }

            // Select a random role
            let offMetaRole: Role = getRandomArrayElement(Object.values(Role))

            // Remove it from remaining roles and set up our new champion in an off-meta role
            enemyRolesRemaining.splice(enemyRolesRemaining.indexOf(offMetaRole), 1);
            enemies.push(
                new Champion(championName, CHAMPIONS[championName])
                    .setAlignment(Alignment.ENEMY)
                    .setRole(offMetaRole)
            );
        }

        for (const role of enemyRolesRemaining) {
            const championNamesTaken = [...allies.map(champ => champ.name), ...enemies.map(champ => champ.name)];
            let championName: string = playerChampion.name;
            const roleChampionNames: string[] = JSON.parse(fs.readFileSync(`static/${role.toString().toLowerCase()}.json`, 'utf-8'));
            while (championNamesTaken.indexOf(championName) >= 0) {
                championName = getRandomArrayElement(roleChampionNames);
            }
            enemies.push(
                new Champion(championName, CHAMPIONS[championName])
                    .setAlignment(Alignment.ENEMY)
                    .setRole(role)
            );
        }
        this.allies = allies;
        this.enemies = enemies;
    }

}