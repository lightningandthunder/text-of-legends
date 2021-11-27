import { CHAMPION_EFFECTS } from "../champions/champions";
import { Alignment, Modifier, Role, Event } from "./enums";

export default class Champion {
    name: string;
    role: Role = Role.TOP;
    metaRoles: Role[] = [];
    modifiers: Modifier[] = [];
    alignment: Alignment = Alignment.ALLY;
    strength: number = 5;
    kills: number = 0;
    deaths: number = 0;
    assists: number = 0;
    uniqueTrait: (a: Event) => number = _ => 1;

    constructor(name: string, metaRoles: Role[]) {
        this.name = name;
        this.metaRoles = metaRoles;
        this.uniqueTrait = CHAMPION_EFFECTS[name];
    }

    setAlignment(alignment: Alignment) {
        this.alignment = alignment;
        return this;
    }

    setRole(role: Role) {
        this.role = role;
        this.initModifiers();
        return this;
    }

    getTraitEffects(event: Event): number {
        return this.uniqueTrait(event);
    }

    recordKills(kills: number) {
        const multiplier: number = this.getTraitEffects(Event.KILL);
        this.kills += kills;
        this.strength += this.strength > 0
            ? (kills * 5 * multiplier) + Math.floor(this.strength / 5)
            : (kills * 5 * multiplier);
    }

    recordDeath() {
        const softenFactor: number = this.getTraitEffects(Event.DEATH);
        this.deaths += 1;
        this.strength += softenFactor;
    }

    recordAssists(assists: number) {
        const multiplier: number = this.getTraitEffects(Event.ASSIST);
        this.assists += assists;
        this.strength += this.strength > 0
            ? (assists * 2 * multiplier) + Math.floor(this.strength / 5)
            : (assists * 2 * multiplier);
    }

    private getRandomPercent(modifier: number = 1) {
        return Math.floor(Math.random() * 100) * modifier;
    }

    private initModifiers() {
        // Allies are inherently weaker than enemies to make the game challenging.
        // ...and more realistic?
        const modifier = this.alignment === Alignment.ALLY
            ? 0.85
            : 1;

        const friendliness = this.getRandomPercent(modifier);
        const care = this.getRandomPercent(modifier);
        const skillLevel = this.getRandomPercent(modifier);

        // If you're playing off-meta and are not a skilled player, good luck!
        if (skillLevel < 80 && this.metaRoles.indexOf(this.role) < 0) {
            this.strength = 0;
        }

        this.strength += this.getTraitEffects(Event.CHAMPION_INIT);

        const modifiers = [];
        if (this.alignment !== Alignment.PLAYER) {
            if (friendliness < 20) {
                modifiers.push(Modifier.CONTRARIAN);
            } else if (friendliness > 85) {
                modifiers.push(Modifier.FRIENDLY);
            }

            if (care < 20) {
                modifiers.push(Modifier.CARELESS);
            } else if (care > 85) {
                modifiers.push(Modifier.CAREFUL);
            }

            if (skillLevel < 20) {
                modifiers.push(Modifier.BAD);
            } else if (skillLevel > 85) {
                modifiers.push(Modifier.GODLIKE);
            }
        }
        this.modifiers = modifiers;
    }
}