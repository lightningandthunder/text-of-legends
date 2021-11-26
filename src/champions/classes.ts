export enum Role {
    TOP,
    MID,
    ADC,
    SUP,
    JNG
}

export enum Modifier {
    FED,
    FEEDING,
    FRIENDLY,
    CONTRARIAN,
    GODLIKE,
    BAD
}

export enum Alignment {
    ALLY,
    ENEMY
}

export class Champion {
    name: string;
    role: Role;
    modifiers: Modifier[] = [];
    alignment: Alignment;

    constructor(name: string, role: Role, alignment: Alignment) {
        this.name = name;
        this.role = role;
        this.alignment = alignment;
        this.initRandomModifiers();
    }

    private getRandomPercent(modifier: number = 1) {
        return Math.floor(Math.random() * 100) * modifier;
      }

    initRandomModifiers() {
        // Allies are inherently weaker than enemies to make the game challenging.
        // ...and more realistic?
        const modifier = this.alignment === Alignment.ALLY
            ? 0.85
            : 1;

        const friendliness = this.getRandomPercent(modifier);
        const fedStatus = this.getRandomPercent(modifier);
        const skillLevel = this.getRandomPercent(modifier);

        const modifiers = [];

        if (friendliness < 30) {
            modifiers.push(Modifier.CONTRARIAN);
        } else if (friendliness > 80) {
            modifiers.push(Modifier.FRIENDLY);
        }

        if (fedStatus < 30) {
            modifiers.push(Modifier.FEEDING);
        } else if (fedStatus > 80) {
            modifiers.push(Modifier.FED);
        }

        if (skillLevel < 30) {
            modifiers.push(Modifier.BAD);
        } else if (skillLevel > 80) {
            modifiers.push(Modifier.GODLIKE);
        }

        this.modifiers = modifiers;
    }
}