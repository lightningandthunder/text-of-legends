import { Role } from "../champions/classes";

export function normalizeChampionName(name: string): string {
    const nameLower = name.toLowerCase()
        .replace(/\'/g, '')
        .replace(/\s/g, '')
        .replace(/\./g, '');

    if (nameLower === 'mf') {
        return 'missfortune';
    }
    if (nameLower === 'yi') {
        return 'masteryi';
    }
    if (nameLower === 'akechi') {
        return 'kayn';
    }
    if (nameLower === 'kat') {
        return 'katerina';
    }
    if (nameLower === 'asol') {
        return 'aurelionsol';
    }
    if (nameLower === 'drmundo') {
        return 'mundo';
    }
    if (nameLower === 'jarvan') {
        return 'jarvaniv';
    }
    if (nameLower === 'powder') {
        return 'jinx';
    }

    return nameLower;
}

export function normalizeRole(role: string): Role | null {
    const roleUpper = role.toUpperCase();

    if (roleUpper === 'TOP') {
        return Role.TOP;
    }
    if (['MIDDLE', 'MID'].indexOf(roleUpper) >= 0) {
        return Role.MID;
    }
    if (['BOT', 'BOTTOM', 'ADC'].indexOf(roleUpper) >= 0) {
        return Role.ADC;
    }
    if(['JUNGLE', 'JUNG', 'JNG', 'JG'].indexOf(roleUpper) >= 0) {
        return Role.JNG;
    }
    if(['SUPPORT', 'SUP', 'SP', 'SUPT'].indexOf(roleUpper) >= 0) {
        return Role.SUP;
    }

    return null;
}