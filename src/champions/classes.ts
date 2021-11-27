export enum Role {
    TOP = 'TOP',
    MID = 'MID',
    ADC = 'ADC',
    SUP = 'SUP',
    JNG = 'JNG'
}

export enum Modifier {
    CAREFUL = 'CAREFUL',
    CARELESS = 'CARELESS',
    FRIENDLY = 'FRIENDLY',
    CONTRARIAN = 'CONTRARIAN',
    GODLIKE = 'GODLIKE',
    BAD = 'BAD'
}

export enum Alignment {
    PLAYER = 'PLAYER',
    ALLY = 'ALLY',
    ENEMY = 'ENEMY'
}

export enum Event {
    KILL = 'KILL',
    DEATH = 'DEATH',
    ASSIST = 'ASSIST',
    TEAMFIGHT = 'TEAMFIGHT',
    SOLOFIGHT = 'SOLOFIGHT',
    SPLITPUSH = 'SPLITPUSH'
}

export class Champion {
    name: string;
    role: Role = Role.TOP;
    metaRoles: Role[] = [];
    modifiers: Modifier[] = [];
    alignment: Alignment = Alignment.ALLY;
    strength: number = 0;
    kills: number = 0;
    deaths: number = 0;
    assists: number = 0;
    uniqueTrait: (a: any) => number = (a) => 1;

    constructor(name: string, metaRoles: Role[]) {
        this.name = name;
        this.metaRoles = metaRoles;
    }

    setAlignment(alignment: Alignment) {
        this.alignment = alignment;
        return this;
    }

    setRole(role: Role) {
        this.role = role;
        this.initRandomModifiers();
        return this;
    }

    setUniqueTrait(fun: (a: any) => number) {
        this.uniqueTrait = fun;
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

    private initRandomModifiers() {
        // Allies are inherently weaker than enemies to make the game challenging.
        // ...and more realistic?
        const modifier = this.alignment === Alignment.ALLY
            ? 0.85
            : 1;

        const friendliness = this.getRandomPercent(modifier);
        const care = this.getRandomPercent(modifier);
        const skillLevel = this.getRandomPercent(modifier);

        // If you're playing off-meta and are not a skilled player, good luck!
        if (skillLevel < 80
            && this.role !== undefined
            && this.metaRoles.indexOf(this.role) < 0) {
            this.strength = -20;
        }

        const modifiers = [];
        if (this.alignment !== Alignment.PLAYER) {
            if (friendliness < 30) {
                modifiers.push(Modifier.CONTRARIAN);
            } else if (friendliness > 80) {
                modifiers.push(Modifier.FRIENDLY);
            }

            if (care < 30) {
                modifiers.push(Modifier.CARELESS);
            } else if (care > 80) {
                modifiers.push(Modifier.CAREFUL);
            }

            if (skillLevel < 30) {
                modifiers.push(Modifier.BAD);
            } else if (skillLevel > 80) {
                modifiers.push(Modifier.GODLIKE);
            }
        }
        this.modifiers = modifiers;
    }
}