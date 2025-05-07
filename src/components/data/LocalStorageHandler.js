export const putDataInLocalStorage = function (data,key) {
    localStorage.setItem(key, JSON.stringify(data));
};

export const getDataFromLocalStorage = function (key) {
    return JSON.parse(localStorage.getItem(key));
};
