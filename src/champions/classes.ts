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

export class Champion {
    name: string;
    role: Role = Role.TOP;
    metaRoles: Role[] = [];
    modifiers: Modifier[] = [];
    alignment: Alignment = Alignment.ALLY;
    strength: number = 0;

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