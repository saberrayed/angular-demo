export function getStorage(name, parse = false) {
    return parse ? JSON.parse(localStorage.getItem(name)) : localStorage.getItem(name);
}