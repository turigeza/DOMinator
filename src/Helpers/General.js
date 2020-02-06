export function toNaturalNumber(val) {
    const abs = Math.abs(parseInt(val, 10));
    return isNaN(abs) ? 0 : abs;
}
