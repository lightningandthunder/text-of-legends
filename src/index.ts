import GameState from "./game-state/game-state";
import { updateChampionFiles } from "./utils/championUtils";

(async () => {
    await updateChampionFiles();
    const game = new GameState();
    const initialGameState = await game.initGame();
    console.log('Welcome to Summoner\'s Rift! Your initial game state is:');
    console.log(initialGameState);
})();
