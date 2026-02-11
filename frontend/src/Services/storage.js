export const getData = (key) => {
    return JSON.parse(localStorage.getItem(key)) || [];
};

export const setData = (key, data) => {
    localStorage.getItem(key, JSON.stringify(data));
};