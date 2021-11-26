import { Champion } from "../champions/classes"

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