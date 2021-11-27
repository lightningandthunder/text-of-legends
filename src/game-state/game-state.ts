import { CHAMPIONS } from "../champions/champions";
import { Champion, Alignment } from "../champions/classes"
import { getChampionFromUser, getRandomObjectKey, getRandomArrayElement } from "../utils/utils";

export default class GameState {
    player: Champion | undefined;
    allies: Champion[] = [];
    enemies: Champion[] = [];

    constructor() {}

    async startGame() {
        const { data, selectedRole } = await getChampionFromUser();
        this.player = new Champion(data.name, data.roles)
            .setAlignment(Alignment.PLAYER)
            .setRole(selectedRole);

        this.setAlliesAndEnemies(this.player);
    }

    // TODO:
    // startGameTop(), based on TP decisions and mid/jg interactions
    // startGameMid(), based on roaming decisions
    // startGameAdc(), based on whether or not to commit to teamfights
    // startGameJng(), based on ganking decisions and initiating objectives
    // startGameSup(), based on roaming and whether or not to abandon lane

    private setAlliesAndEnemies(playerChampion: Champion) {
        const allies: string[] = [playerChampion.name];
        const allyRoles: string[] = [];
        const enemies: string[] = [];
        const enemyRoles: string[] = [];

        // Get 9 random names
        // while (champNames.length < 9) {
        //     const name = getRandomObjectKey(CHAMPIONS);
        //     if (champNames.indexOf(name) < 0) {
        //         champNames.push(name);
        //     }
        // }

        // for (let name of champNames) {
        //     this.allies.push(
        //         new Champion(name, CHAMPIONS[name])
        //             .setAlignment(Alignment.ALLY)
        //             .setRole()
        //     );
        // }
    }

}