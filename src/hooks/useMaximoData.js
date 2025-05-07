import { useState, useEffect } from 'react';
import useConfig from './useConfig';
import { loadData } from "../components/data/Api";
import { useKeycloak } from '@react-keycloak/web';

const useMaximoData = () => {
    // State variables
    const [data, setData] = useState(
        {
            woData: [],
            inventoryData: [],
            invBalData: [],
            prData: [],
            poData: [],
            assetData: [],
        }
    );
    const [loading, setLoading] = useState(
        {
            woData: true,
            inventoryData: true,
            invBalData: true,
            prData: true,
            poData: true,
            assetData: true,
        }
    );

    const [error, setError] = useState(null);

    const appConfig = useConfig();
    const { keycloak } = useKeycloak();

    const LoadDataFromAPI = () => {
        const time = new Date().getTime();

        //work order data
        loadData({
            url: appConfig.WORKORDER_URL,
            localStoreName: "woData",
            timeout: appConfig.API_TIMEOUT_SEC,
            apikey: appConfig.MAX_API_KEY,
        })
            .then((data) => {
                console.log(
                    "WO Data fetched in " + (new Date().getTime() - time) + " ms"
                );

                setData(prevData => ({ ...prevData, woData: data }));
                setLoading(prevLoading => ({ ...prevLoading, woData: false }));
            })
            .catch((error) => {
                console.log(error);
            });

        //inventory data
        loadData({
            url: appConfig.INVENTORY_URL,
            localStoreName: "inventoryData",
            timeout: appConfig.API_TIMEOUT_SEC,
            apikey: appConfig.MAX_API_KEY,
        })
            .then((data) => {
                console.log(
                    "Inventory Data fetched in " + (new Date().getTime() - time) + " ms"
                );
                setData(prevData => ({ ...prevData, inventoryData: data }));
                setLoading(prevLoading => ({ ...prevLoading, inventoryData: false }));
            })
            .catch((error) => {
                console.log(error);
            });

        //inventory balance data
        loadData({
            url: appConfig.INVBAL_URL,
            localStoreName: "invBalData",
            timeout: appConfig.API_TIMEOUT_SEC,
            apikey: appConfig.MAX_API_KEY,
        }).then((data) => {
            console.log(
                "Inventory Balance Data fetched in " +
                (new Date().getTime() - time) +
                " ms"
            );
            setData(prevData => ({ ...prevData, invBalData: data }));
            setLoading(prevLoading => ({ ...prevLoading, invBalData: false }));
        });

        //pr data
        loadData({
            url: appConfig.PR_URL,
            localStoreName: "prData",
            timeout: appConfig.API_TIMEOUT_SEC,
            apikey: appConfig.MAX_API_KEY,
        }).then((data) => {
            console.log(
                "Purchase Requisition Data fetched in " +
                (new Date().getTime() - time) +
                " ms"
            );
            setData(prevData => ({ ...prevData, prData: data }));
            setLoading(prevLoading => ({ ...prevLoading, prData: false }));
        });

        //po data
        loadData({
            url: appConfig.PO_URL,
            localStoreName: "poData",
            timeout: appConfig.API_TIMEOUT_SEC,
            apikey: appConfig.MAX_API_KEY,
        }).then((data) => {
            console.log(
                "Purchase Order Data fetched in " +
                (new Date().getTime() - time) +
                " ms"
            );
            setData(prevData => ({ ...prevData, poData: data }));
            setLoading(prevLoading => ({ ...prevLoading, poData: false }));
        });

        //asset data
        loadData({
            url: appConfig.ASSET_URL,
            localStoreName: "assetData",
            timeout: appConfig.API_TIMEOUT_SEC,
            apikey: appConfig.MAX_API_KEY,
        })
            .then((data) => {
                console.log(
                    "Asset Data fetched in " + (new Date().getTime() - time) + " ms"
                );
                setData(prevData => ({ ...prevData, assetData: data }));
                setLoading(prevLoading => ({ ...prevLoading, assetData: false }));
            })
            .catch((error) => {
                console.log(error);
            });

        return;
    };

    // Fetch data from Maximo API
    useEffect(() => {
        if (!appConfig) return;
        if (!keycloak.authenticated) return;
        const fetchData = async () => {
            try {
                LoadDataFromAPI();
            } catch (error) {
                setError(error);
            }
        };

        fetchData();
    }, [appConfig,keycloak.initialized,keycloak.authenticated]);

    

    return { data, loading, error};
};

export default useMaximoData;
