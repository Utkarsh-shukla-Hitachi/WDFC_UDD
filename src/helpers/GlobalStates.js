import React from "react";

export const GlobalStates = React.createContext({
    filterState: {
        filter: {},
        setFilter: () => {},
    },
    dataModelsState: {
        dataModels: {},
        setDataModels: () => {},
    },
    dataLoadState: {
        isLoading:{}
    },
    appConfig:null,
    theme: {
        currentTheme: "dark",
        setCurrentTheme: () => {},
    },
    });
