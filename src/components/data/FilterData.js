const StationList = {
    "jaipur":["REJN","AELN","DBLN","BAGN","SMPN","PMPN","FLN","SKNN","KSGN"],
    "ajmer":["SDHN","BGMN","HPRN","CNLN","MLND","JALN","BRLN","KVJN","BNSN","SRPN","SMIN"],
    "ahmedabad":["PNUN","CDQN","UMND","MSHN","GUSN","SAUN","SAUS","TBAN","CGYN","VDAN","MPRN"],
    }

export const filterWOData = function (data, filters) {

    const { startDate, endDate, division, site, block, assetClass,filterMode } = filters;
    
    //date filter
    if (startDate && startDate !== "" && endDate && endDate !== "") {
        data = data.filter((wo) => {
            const woDate = new Date(wo.reportdate);
            return woDate >= new Date(startDate) && woDate <= new Date(endDate);
        });
    }
    
   
    //division filter
    if (division && division.length > 0) {
        const divSiteList=division.flatMap((d) => StationList[d.value]);
        data = data.filter((wo) => divSiteList.includes(wo.siteid));
    }

    switch (filterMode) {
        case "site":
            if (site && site.length > 0) {
                const siteList=site.map((s) => s.value);
                //site filter
                data = data.filter((wo) => siteList.includes(wo.siteid));
            }
            break;

        case "block":
            //block filter
                if(block && block.length > 0){
                    const blockList=block.flatMap((b) => b.alhlist);

                    data = data.filter((wo) => blockList.filter((b) => wo.dfc_assetnameid?.startsWith(b)).length > 0);
                }
            break;

        default:
            break;
        }


    //assetClass filter
    if(assetClass && assetClass.length > 0){
        const assetClassList=assetClass.map((ac) => ac.value);

        data = data.filter((asset) => assetClassList.filter((ac) => asset.dfc_assetclass?.toLowerCase()=== ac?.toLowerCase()).length > 0);
        
    }
return data

}




export const filterInvData = function (data, filters) {
    
        const {division, site} = filters;
        var filteredData = data;
        if (!data) return [];
        if (data.length === 0) return [];

        // //division filter
        // if (division && division.length > 0) {
        //     const divSiteList=division.flatMap((d) => StationList[d.value]);
        //     data = data.filter((inv) => divSiteList.includes(inv.siteid));
        // }

        
        //site filter
        if (site && site !== "All") {
            filteredData = filteredData.filter((item) => item.siteid === site);
        }
        return filteredData;

}

export const filterAssetData = function (data, filters) {

    const {division,site,block,assetClass,filterMode} = filters;
    
   
    
    //division filter
    if (division && division.length > 0) {
        const divSiteList=division.flatMap((d) => StationList[d.value]);
        data = data.filter((asset) => divSiteList.includes(asset.siteid));
    }

    switch (filterMode) {
        case "site":
            if (site && site.length > 0) {
                const siteList=site.map((s) => s.value);
                //site filter
                data = data.filter((asset) => siteList.includes(asset.siteid));
            }
            break;

        case "block":
            //block filter
                if(block && block.length > 0){
                    const blockList=block.flatMap((b) => b.alhlist);

                    data = data.filter((asset) => blockList.filter((b) => asset.dfc_assetnameid?.startsWith(b)).length > 0);
                }
            break;

        default:
            break;
        }


    //assetClass filter
    if(assetClass && assetClass.length > 0){
        const assetClassList=assetClass.map((ac) => ac.value);

        data = data.filter((asset) => assetClassList.filter((ac) => asset.dfc_assetclass?.toLowerCase()=== ac?.toLowerCase()).length > 0);
        
    }
    return data
}

export const filterPRData = function (data, filters) {
}

export const filterPOData = function (data, filters) {
}
