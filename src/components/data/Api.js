import {
  getDataFromLocalStorage,
  putDataInLocalStorage,
} from "./LocalStorageHandler.js";

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

const fetchDataFromURL = async function (url, timeout_sec, apikey) {
  try {
    const res = await Promise.race([
      fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          apikey: apikey,
        },
      }),
      timeout(timeout_sec),
    ]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

// export const loadData = async function (config) {
//   console.log(`Fetching ${config.localStoreName}`);
//   try {
//     const localData = getDataFromLocalStorage(config.localStoreName);
//     if (localData) {
//       console.log(`${config.localStoreName} fetched from local storage`);
//       return localData;
//     } //TODO: ADD DELTA LOGIC HERE
//     const data = await fetchDataFromURL(
//       config.url,
//       config.timeout,
//       config.apikey
//     );
//     console.log(`${config.localStoreName} fetched from API`);
//     putDataInLocalStorage(data.member, config.localStoreName);
//     return data.member;
//   } catch (err) {
//     throw err;
//   }
// };

export const loadData = async function (config) {
  console.log(`Fetching ${config.localStoreName}`);
  try {
    // const localData = getDataFromLocalStorage(config.localStoreName);
    // if (localData) {
    //   console.log(`${config.localStoreName} fetched from local storage`);
    //   return localData;
    // } //TODO: ADD DELTA LOGIC HERE
    const data = await fetchDataFromURL(
      config.url,
      config.timeout,
      config.apikey
    );
    console.log(`${config.localStoreName} fetched from API`);
    // putDataInLocalStorage(data.member, config.localStoreName);
    return data.member;
  } catch (err) {
    throw err;
  }
};
