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