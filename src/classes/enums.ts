export enum Action {
    START_FIGHT = 'START_FIGHT',
    JOIN_FIGHT = 'JOIN_FIGHT',
    RETREAT = 'RETREAT',
    FARM = 'FARM',
    PING_WARNING = 'PING_WARNING',
    PING_GOING = 'PING_GOING',
    TELEPORT = 'TELEPORT',
    PUSH_OBJECTIVE = 'PUSH_OBJECTIVE'
};

export enum Role {
    TOP = 'TOP',
    MID = 'MID',
    ADC = 'ADC',
    SUP = 'SUP',
    JNG = 'JNG'
};

export enum Modifier {
    CAREFUL = 'CAREFUL',
    CARELESS = 'CARELESS',
    FRIENDLY = 'FRIENDLY',
    CONTRARIAN = 'CONTRARIAN',
    GODLIKE = 'GODLIKE',
    BAD = 'BAD'
};

export enum Alignment {
    PLAYER = 'PLAYER',
    ALLY = 'ALLY',
    ENEMY = 'ENEMY'
};

export enum Event {
    CHAMPION_INIT = 'CHAMPION_INIT',
    KILL = 'KILL',
    DEATH = 'DEATH',
    ASSIST = 'ASSIST',
    TEAMFIGHT_SETUP = 'TEAMFIGHT_SETUP',
    TEAMFIGHT = 'TEAMFIGHT',
    SOLOFIGHT = 'SOLOFIGHT',
    SPLITPUSH = 'SPLITPUSH'
};