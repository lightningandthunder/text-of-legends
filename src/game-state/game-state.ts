import { Champion } from "../champions/champions"

export default class GameState {
    allies: Champion[];
    enemies: Champion[];

    constructor(allies: Champion[], enemies: Champion[]) {
        this.allies = allies;
        this.enemies = enemies;
    }

    startGame() {
        
    }
}