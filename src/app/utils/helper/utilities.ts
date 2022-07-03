
export function getMasterByName(name: string) {
    return localStorage.getItem('value_master') ? JSON.parse(localStorage.getItem('value_master')).find((item) => {
        return item?.text === name;
    }) : null;
}