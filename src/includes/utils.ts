export const convertArrayToString = (value: unknown) => {
    return Array.isArray(value) ? value.join(", ") : value;
};

export function getCurrentStoreSlug(): string {
    const segments = window.location.pathname.split("/").filter(Boolean);
    const second = segments[0] || "";
    const fourth = segments[2] || "";
    return `${second}${second && fourth ? "-" : ""}${fourth}`;
}
