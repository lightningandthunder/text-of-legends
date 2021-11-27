export function getRandomObjectKey(obj: any) {
    const keys = Object.keys(obj);
    return keys[keys.length * Math.random() << 0];
};

export function getRandomArrayElement(arr: Array<any>) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function arraysAreEquivalent(arr1: any[], arr2: any[]) {
    if (arr1 === undefined || arr2 === undefined) {
        return false;
    }
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (const element of arr1) {
        if (arr2.indexOf(element) < 0) {
            return false;
        }
    }
    return true;
}
