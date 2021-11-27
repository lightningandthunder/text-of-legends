import GameState from "./game-state/game-state";
import { updateChampionFiles } from "./utils/utils";

(async () => {
    await updateChampionFiles();
    const game = new GameState();
    await game.startGame();
    console.log(JSON.stringify(game, null, 4))
})();
