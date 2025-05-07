import { filterWOData, filterInvData ,filterAssetData} from "./FilterData.js";

// create a map for status
const statusMap = new Map(
    [  
["APPR", "Approved"],
["WAPPR", "Waiting Approval"],
// ["COMP", "Completed"],
// ["CAN", "Cancelled"],
["WPERMIT", "Waiting Permit"],
["INPRG", "In Progress"],
// ["CLOSE", "Closed"],
["WMATL", "Waiting Material"],
["RECEIVED", "Recieved"],
["DESPATCHED", "Dispatched"],
["WPCOND", "Waiting Condition"],
    ]
);


const maintenanceMap = new Map([
["PM", "Preventive Maintenance"],
["CM", "Corrective Maintenance"],
["PD", "Predictive Maintenance"],
["BD", "Breakdown Maintenance"],
["WR", "Warranty Repair"],
["RP", "Repair Maintenance"],
]);

const StationList = {
jaipur:["REJN","AELN","DBLN","BAGN","SMPN","PMPN","FLN","SKNN","KSGN"],
ajmer:["SDHN","BGMN","HPRN","CNLN","MLND","JALN","BRLN","KVJN","BNSN","SRPN","SMIN"],
ahmedabad:["PNUN","CDQN","UMND","MSHN","GUSN","SAUN","SAUS","TBAN","CGYN","VDAN","MPRN"],
}
const storelocMap =new Map([
    ["REJ5","New Rewari"],
    ["SMP5","New Shri Madhopur"],
    ["SDH5","New Saradhana"],
    ["MJN5","New Marwar"],
    ["KVJ5","New Keshavganj"],
    ["PNU5","New Palanpur"],
    ["SAS5","New Sanand South"],
    ["MPR5","New Makarpura"],
]);
export const makeMaintenanceTimeData = function (data) {
    
    //filter 1 : status = completed or closed
    const filteredData = data.filter((wo) => wo.status === "COMP" || wo.status === "CLOSE");
    

    //filter 2 : group by asset class
    const distAssetClass = [...new Set(filteredData.map((wo) => wo.dfc_assetclass))].filter(Boolean);

    //filter 3 : calculate total duration for each asset class
    const newData = distAssetClass.map((assetClass, i) => {
        const totalDuration = filteredData.filter(({ dfc_assetclass }) => dfc_assetclass === assetClass).reduce((a, b) => a + 
        //b.actfinish - b.actstart dates in minutes
        ((new Date(b.actfinish) - new Date(b.actstart)) / (1000 * 60))
        , 0);
        return {
            label: assetClass,
            value: totalDuration,
        };
    });

    //sort data in descending order
    newData.sort((a, b) => b.value - a.value);

    //return top 5 data

    return newData.slice(0, 5);
};

export const makeOpenWOData = function (data) {

    const distStatus = [...new Set(data.map((wo) => wo.status))].filter(Boolean).filter((status) => statusMap.has(status));

    

    const newData = distStatus.map((stats, i) => ({
        label: statusMap.get(stats),
        value: data.filter(({ status }) => status === stats).length,
    }));

    newData.sort((a, b) => b.value - a.value);
    return newData;
};

const makeMaintenancePercentData = function (data) {

    const distStatus = [...new Set(data.map((wo) => wo.worktype))].filter(Boolean);
    const newData = distStatus.map((stats, i) => ({
        label: maintenanceMap.get(stats),
        value: data.filter(({ worktype }) => worktype === stats).length,
    }));

    newData.sort((a, b) => b.value - a.value);

    // var total = newData.reduce((a, b) => a + b.value, 0);
    // newData.forEach(d => d.value = ((d.value / total) * 100).toFixed(0));

    return newData;
};

export const makeWODueToStartData = function (data) {

    const sysDate = new Date();
    sysDate.setHours(0, 0, 0, 0);

    const filteredData = data.filter((wo) => {
        const woDate = new Date(wo.targstartdate);
        woDate.setHours(23, 59, 59, 999);

        if (woDate >= sysDate && woDate <= new Date(sysDate.getTime() + (3 * 24 * 60 * 60 * 1000))) {
            return true;
        }
    })


    const distStatus = [...new Set(filteredData.map((wo) => wo.worktype))].filter(Boolean);
    var newData = distStatus.map((stats, i) => ({
        label: stats,
        value: filteredData.filter(({ worktype }) => worktype === stats).length,
    }));
    if(newData.length==0)
        newData =[
            {label:"PM", value:0.0},
            {label:"CM", value:0.0},
            {label:"WR", value:0.0},
            {label:"RP", value:0.0},
            {label:"PD", value:0.0},
        ]
        

    return newData;
};


export const makeCriticalItemSafetyStockData = function (data) {
    
    const distLoc = ["REJ5","SMP5","SDH5","MJN5","KVJ5","PNU5","SAS5","MPR5"]

    //remove all elements where inventory is not in item or empty
    const filteredData=data.filter((item) => item.inventory!==undefined && item.inventory.length > 0);

    //for each distLoc, count such elements where curbal < minlevel and curbal>sstock

    const newData=distLoc.map((loc, i) => {
        //TODO : CHECK IF <= or < and >= or >
        const totalCount = filteredData.filter(({ location,inventory,curbal }) => location === loc 
        && curbal<inventory[0].minlevel && curbal>=inventory[0].sstock ).length;
        return {
            label: loc,//storelocMap.get(loc),
            value: totalCount,
        };
    });
    
    return newData;
};

export const makeOutstandingPRData = function (data) {
    const distLoc = ["REJ5","SMP5","SDH5","MJN5","KVJ5","PNU5","SAS5","MPR5"]

    //filter where prline is not undefined
    const prData=data.filter((pr) => pr.prline !== undefined);

    //for each element in prData, check if ponum parameter is not present in any element of prline array
    //count such elements for each location get from prline[0].storeloc
    const newData=distLoc.map((loc, i) => {
        //TODO : REVIEW THIS LOGIC
        const totalCount = prData.filter(({ prline }) => 
        prline.filter((prl) => prl.storeloc === loc && !prl.ponum).length === prline.length).length;
        return {
            label: loc,//storelocMap.get(loc),
            value: totalCount,
        };
    });
    
    return newData;
};

export const makeMaterialToRecieveData = function (data) {
    const distLoc = ["REJ5","SMP5","SDH5","MJN5","KVJ5","PNU5","SAS5","MPR5"]

    const sysDate = new Date();
    sysDate.setHours(0, 0, 0, 0);

    // const sysDate = new Date("2023-12-28");
    const getDiffInDays = function (date1, date2) {
        const diffTime = date1.getTime() - date2.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return diffDays;
    }
    // receipts = NONE or PARTIAL
    // reqdeliverydate-sysDate <=7
    // calculate count
    //filter where receipts is NONE or PARTIAL
    const filteredData=data.filter((po) => po.receipts === "NONE" || po.receipts === "PARTIAL");
    
    //filter where poline is not undefined
    const polineData=filteredData.filter((po) => po.poline !== undefined);
    
   
    // for each location, sum orderqty where reqdeliverydate is in sysdate+7days and receiptscomplete is false
    const newData=distLoc.map((loc, i) => {
        
        const totalCount = polineData.map(({ poline }) =>
        poline.filter((pol) => pol.storeloc === loc && (getDiffInDays(new Date(pol.reqdeliverydate),sysDate)<=7) && pol.receiptscomplete === false).length ).reduce((a, b) => a + b, 0);
        // const totalCount = polineData.filter(({ poline }) => 
        // poline.filter((pol) => pol.storeloc === loc && new Date(pol.reqdeliverydate) >= sysDate 
        // && new Date(pol.reqdeliverydate) <= endDate).length > 0).length;
        return {
            label: loc,//storelocMap.get(loc),
            value: totalCount/1,
        };
    });

    return newData;
};

export const makeMaterialNotRecievedData = function (data) {
    const distLoc = ["REJ5","SMP5","SDH5","MJN5","KVJ5","PNU5","SAS5","MPR5"]

    const sysDate = new Date();
    sysDate.setHours(0, 0, 0, 0);
//     receipts = NONE or PARTIAL
// calculate count

    //filter where receipts is NONE or PARTIAL
    const filteredData=data.filter((po) => po.receipts === "NONE" || po.receipts === "PARTIAL");
    //filter where poline is not undefined
    const polineData=filteredData.filter((po) => po.poline !== undefined);
    
    const newData=distLoc.map((loc, i) => {
        const totalCount = polineData.map(({ poline }) => 
        //TODO : Confirm receiptcomplete condition
        poline.filter(
            (pol) =>pol.storeloc === loc && sysDate>new Date(pol.reqdeliverydate) && pol.receiptscomplete ===false
            ).length ).reduce((a, b) => a + b, 0)
        return {
            label: loc,//storelocMap.get(loc),
            value: totalCount,
        };
    });
    return newData;
};

export const makeInventoryCostData = function (data) {
    const distLoc = ["REJ5","SMP5","SDH5","MJN5","KVJ5","PNU5","SAS5","MPR5"]

    //filter where invcost is empty
    const filteredData=data.filter((item) => item.invcost!==undefined && item.invcost.length > 0);


    //for each distLoc, group by item.abctype and sum invcost[0].totalcost
    

    const newData=distLoc.flatMap((loc, i) => {
        return  [
                {label:loc,/*storelocMap.get(loc),*/ category: "A", value: filteredData.filter(({ location,abctype }) => location === loc && abctype === "A").reduce((a, b) => a + b.invcost[0].stdcost, 0) },
                {label:loc,/*storelocMap.get(loc),*/ category: "B", value: filteredData.filter(({ location,abctype }) => location === loc && abctype === "B").reduce((a, b) => a + b.invcost[0].stdcost, 0) },
                {label:loc,/*storelocMap.get(loc),*/ category: "C", value: filteredData.filter(({ location,abctype }) => location === loc && abctype === "C").reduce((a, b) => a + b.invcost[0].stdcost, 0) },
            ]
        
    });
    
    return newData;
};


export const makeMaterialCountScrapData = function (data) {
       //get all data with status = PENDOBS
       const obsAssets=data.filter((item) => item.status === "PENDOBS");
       //get all data with status = PENDSCRAP 
          const scrapAssets=data.filter((item) => item.status === "PENDSCRAP");
          

          //get count of each status for each siteid
            // const distSite = [...new Set(obsAssets.map((item) => item.location))].filter(Boolean);
            const distSite = ["REJ5","SMP5","SDH5","MJN5","KVJ5","PNU5","SAS5","MPR5"]

            var newData=distSite.flatMap((loc, i) => {
                const obsCount = obsAssets.filter(({ location }) => location === loc).length;
                const scrapCount = scrapAssets.filter(({ location }) => location === loc).length;
                return [{label:loc,/*storelocMap.get(loc),*/ category: "Pending Obsolete", value: obsCount },
                {label:loc,/*storelocMap.get(loc),*/ category: "Pending Scrap", value: scrapCount }];
            }
            );
            

    return newData;
};

export const makeMonthwiseDowntimeData = function (data) {
    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const faultData=data.filter((wo) => ((wo.worktype === "PD" && wo.dfc_srpriority==="P1" ) || wo.worktype === "BD") && (wo.status === "COMP" || wo.status === "CLOSE"));

    //calculate total time for each month for all faults . time= actfinish - actstart
    //list of label and value
    const totalValues = labels.map((label, i) => {
        const fdata = faultData.filter(({ actfinish }) => new Date(actfinish).getMonth() === i);
        const totalTime=fdata.reduce((a, b) => a + ((new Date(b.actfinish) - new Date(b.actstart)) / (1000 * 60 * 60)), 0);
        return {
            label: label,
            value:totalTime,
        }
    });
    

    return totalValues;

}

export const makeTotalAssetFaultData = function (data) {
    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    

    //worktype pd and status = completed
    const pdData=data.filter((wo) => (wo.worktype === "PD" ) && (wo.status === "COMP" || wo.status === "CLOSE"));

    //worktype bd and status = completed
    const bdData=data.filter((wo) => (wo.worktype === "BD") && (wo.status === "COMP" || wo.status === "CLOSE"));
    
    const pdValues=[];
    const bdValues=[];
    //calculate frequency for each month
    for(var i=1;i<=12;i++){
        pdValues.push(pdData.filter((wo) => new Date(wo.reportdate).getMonth() === i).length);
        bdValues.push(bdData.filter((wo) => new Date(wo.reportdate).getMonth() === i).length);
    }
    const totalValues = pdValues.map((value, i) => value + bdValues[i]);
        


    const values = [
        {
            itemName: "Breakdown Alerts",
            values: bdValues
        },
        {
            itemName: "Predictive Alerts",
            values: pdValues
        },
        {
            itemName: "Total Alerts",
            values: totalValues
        },
    ]
    return {
        labels,
        values
    }

};

export const makeAssetFaultByAssetClassData = function (data) {
   
    //worktype pd or bd and status = completed 
    const faultData=data.filter((wo) => (wo.worktype === "PD" || wo.worktype === "BD") && (wo.status === "COMP"));
    //filter 2 : group by asset class
    const distAssetClass = [...new Set(faultData.map((wo) => wo.dfc_assetclass))].filter(Boolean);

    //filter 3 : calculate total count for each asset class
    const newData = distAssetClass.map((assetClass, i) => {
        const totalCount = faultData.filter(({ dfc_assetclass }) => dfc_assetclass === assetClass).length;
        return {
            label: assetClass,
            value: totalCount,
        };
    });
    
    //sort data in descending order
    newData.sort((a, b) => b.value - a.value);

    //return top 5 data
    newData.slice(0, 5);

    return newData;
};

const calculateDateDiffYears = function (date1, date2) {
    const diffTime = date1 - date2;
    const diffYears=diffTime / (1000 * 60 * 60 * 24*365);
    
    return diffYears;    
}

export const makeInventoryAgingData = function (data ) {
    const distLoc = ["REJ5","SMP5","SDH5","MJN5","KVJ5","PNU5","SAS5","MPR5"]

    const sysDate = new Date();

    const default_dfc_commissioningdate="2021-01-07T00:00:00+05:30";

    //Cleanup data
    const filteredData=data.filter((item) => item.itemnum  && distLoc.includes(item.location) );

    //groups , <1 , 1 to 3, 3 to 7 , >7
    //count for each group
    //{label:loc, category: "1 to 3", value: 10 },

    const newData=distLoc.flatMap((loc, i) => {
        return  [
                {label:loc,/*storelocMap.get(loc),*/ category: "<1", value: filteredData.filter(({ location,dfc_commissioningdate }) => location === loc && calculateDateDiffYears(sysDate , new Date(dfc_commissioningdate?dfc_commissioningdate:default_dfc_commissioningdate)) < 1).length },
                {label:loc,/*storelocMap.get(loc),*/ category: "3 to 7", value: filteredData.filter(({ location,dfc_commissioningdate }) => location === loc && calculateDateDiffYears(sysDate , new Date(dfc_commissioningdate?dfc_commissioningdate:default_dfc_commissioningdate)) >= 3 && calculateDateDiffYears(sysDate , new Date(dfc_commissioningdate?dfc_commissioningdate:default_dfc_commissioningdate)) <= 7).length },
                {label:loc,/*storelocMap.get(loc),*/ category: "1 to 3", value: filteredData.filter(({ location,dfc_commissioningdate }) => location === loc && calculateDateDiffYears(sysDate , new Date(dfc_commissioningdate?dfc_commissioningdate:default_dfc_commissioningdate)) >= 1 && calculateDateDiffYears(sysDate , new Date(dfc_commissioningdate?dfc_commissioningdate:default_dfc_commissioningdate)) <= 3).length },
                {label:loc,/*storelocMap.get(loc),*/ category: ">7", value: filteredData.filter(({ location,dfc_commissioningdate }) => location === loc && calculateDateDiffYears(sysDate , new Date(dfc_commissioningdate?dfc_commissioningdate:default_dfc_commissioningdate)) > 7).length },
            ]
        
    });
    return newData;

};

export const makeMeanMetricsData = function (data) {
    //calc mean of each metric using dfc_mttr,dfc_mtbf,dfc_frpcpy field for each
    //TODO: Refactor this method
    data=data.filter((item) => item.dfc_mttr!==undefined || item.dfc_mtbf!==undefined || item.dfc_frpcpy!==undefined);
    const mttrsum=data.reduce((a, b) => b.dfc_mttr!==undefined ? a + b.dfc_mttr : a , 0)
    const mtbfsum=data.reduce((a, b) => b.dfc_mtbf!==undefined ? a + b.dfc_mtbf : a , 0)
    const frpcpysum=data.reduce((a, b) => b.dfc_frpcpy!==undefined ? a + b.dfc_frpcpy : a , 0)

    const mttrmean=mttrsum / data.filter((x) => x.dfc_mttr!==undefined).length;
    const mtbfmean=mtbfsum / data.filter((x) => x.dfc_mtbf!==undefined).length;
    const frpcpymean=frpcpysum / data.filter((x) => x.dfc_frpcpy!==undefined).length;
    const newData = {
        mttr: mttrmean?mttrmean.toFixed(0):0,
        mtbf: mtbfmean?mtbfmean.toFixed(0):0,
        frpcpy: frpcpymean?frpcpymean.toFixed(0):0,
        }

    return newData;
};


const calcStationFaultData= function(data) {
    
    //filter 1 : worktype pd or bd and status = completed
    //CHANGED
    const faultData=data.filter((wo) => ((wo.worktype === "PD" && wo.dfc_srpriority==="P1" ) || wo.worktype === "BD") && (wo.status === "COMP" || wo.status === "CLOSE"));
    //count by siteid
    const distSite = [...new Set(faultData.map((wo) => wo.siteid))].filter(Boolean);
    //filter 3 : calculate total count for each asset class
    const newData = distSite.map((site, i) => {
        const totalCount = faultData.filter(({ siteid }) => siteid === site).length;
        return {
            label: site,
            value: totalCount,
        };
    });

    //sort data in descending order
    newData.sort((a, b) => b.value - a.value);

    //return top 3 data
    newData.slice(0, 3);

    //calc percentage of total
    var total = newData.reduce((a, b) => a + b.value, 0);
    newData.forEach(d => d.value = ((d.value / total) * 100).toFixed(0));

    return newData;

}

export const makeTopStationFaultData = function (data) {
   
    //Jaipur - ctp-1, Ajmer ctp-2, Ahmedabad ctp-3
    const newData={
        jaipur:calcStationFaultData(data.filter((wo) => StationList.jaipur.includes(wo.siteid))),
        ajmer:calcStationFaultData(data.filter((wo) => StationList.ajmer.includes(wo.siteid))),
        ahmedabad:calcStationFaultData(data.filter((wo) => StationList.ahmedabad.includes(wo.siteid))),
        // jaipur:calcStationFaultData(data.filter((wo) => wo.woeq3==="Jaipur")),
        // ajmer:calcStationFaultData(data.filter((wo) => wo.woeq3==="Ajmer")),
        // ahmedabad:calcStationFaultData(data.filter((wo) => wo.woeq3==="Ahmedabad")),
    }

    

    return newData;
}

const calcCompliance=function(data){
    const total = data.length;

    const compliant=data?.filter((wo) => !wo.dfc_isnoncompliant).length;
    return ((compliant/total)*100);

}

export const makeScheduleComplianceData= function(data){
    data=data.filter((wo)=> wo.dfc_isnoncompliant!==undefined);

    const jaipur = calcCompliance(data.filter((wo) => StationList.jaipur.includes(wo.siteid)));
    const ajmer = calcCompliance(data.filter((wo) => StationList.ajmer.includes(wo.siteid)));
    const ahmedabad = calcCompliance(data.filter((wo) => StationList.ahmedabad.includes(wo.siteid)));
    return{
        jaipur:jaipur?jaipur.toFixed(0):0,
        ajmer:ajmer?ajmer.toFixed(0):0,
        ahmedabad:ahmedabad?ahmedabad.toFixed(0):0,
    }
}

export const makeServiceInterruptionData = function (data) {
    //workorder dfc_srpriority_description = "Service Interrupting"
    //true/false in each siteid if one exists
//check if dfc_srpriority_description field is present in data

    const filteredData=data.filter((wo) => wo.dfc_srpriority!==undefined && wo.worktype === "BD" && (wo.dfc_srpriority==="SI" ||wo.dfc_srpriority==="NSI")&&
    wo.status !== "CAN" &&
    wo.status !== "CLOSE" &&
    wo.status !== "COMP");
    if (filteredData.length === 0) return [];
    const distSite = [...new Set(filteredData.map((wo) => wo.siteid))].filter(Boolean);
    const newData = distSite.map((site, i) => {
        const interrupting = filteredData.filter(({ siteid,dfc_srpriority,status }) => siteid === site && dfc_srpriority === "SI").length>0;
        return {
            label: site,
            value: interrupting,
        };
    });



    return newData;
};




export const modelData = function (woData,invData,invBalData,pr_data,po_data,assetData,filters) {
    // OLD
    // const data = getDataFromLocalStorage();

    //  console.log(data);
    if (!woData || !invData ||!invBalData || !pr_data || !po_data || !assetData) {
        console.log("Not Enough Data For Modeling");
        return false;
    }
    console.log("Modeling Data");

    const filteredWOData = filterWOData(woData, filters);//division station assetclass date
    
    const filteredWODataNonTime = filterWOData(woData,{...filters,startDate:"",endDate:""});//division station assetclass
    const filteredWODataNonLoc = filterWOData(woData,{...filters,division:[],site:[],block:[],assetClass:[]});//date

    // const filteredAssetData = filterData(assetData, filters);
    const filteredInvData = filterInvData(invData, filters);

    const filteredAssetData = filterAssetData(assetData, filters);
    //WORK ORDER 
    const openWOData = makeOpenWOData(filteredWOData); //division station assetclass date

    const maintenencePercentData = makeMaintenancePercentData(filteredWOData);//division station assetclass date

    const wODueToStartData = makeWODueToStartData(filteredWODataNonTime);//division station assetclass

    const maintenanceTimeData = makeMaintenanceTimeData(filteredWOData);//division station assetclass date

    const topStationFaultData = makeTopStationFaultData(filteredWODataNonLoc);//date


    const totalAssetFaultData = makeTotalAssetFaultData(filteredWODataNonTime);//division station assetclass
    const assetFaultByAssetClassData = makeAssetFaultByAssetClassData(filteredWOData);//division station assetclass date
    const serviceInterruptionData = makeServiceInterruptionData(filteredWOData);
    const scheduleComplianceData = makeScheduleComplianceData(filteredWODataNonLoc);//division  date
    const monthwiseDowntimeData = makeMonthwiseDowntimeData(filteredWODataNonTime); //division station assetclass ?date?

    //ASSET 
    const meanMetricsData = makeMeanMetricsData(filteredAssetData); //division station block assetclass

    //INVENTORY 
    const criticalItemSafetyStockData = makeCriticalItemSafetyStockData(invBalData);//division storeroom?
    const outstandingPRData = makeOutstandingPRData(pr_data);//division storeroom?
    const materialToRecieveData = makeMaterialToRecieveData(po_data);//division storeroom?
    const materialNotRecievedData = makeMaterialNotRecievedData(po_data);//division storeroom?
    const inventoryCostData = makeInventoryCostData(invData);//division storeroom?
    const materialCountScrapData = makeMaterialCountScrapData(invData);//division storeroom?
    const inventoryAgingData = makeInventoryAgingData(assetData);//division storeroom?



    return {

        maintenanceTimeData,
        openWOData,
        maintenencePercentData,
        wODueToStartData,
        
        topStationFaultData,
        meanMetricsData,
        monthwiseDowntimeData,
        totalAssetFaultData,
        assetFaultByAssetClassData,
        
        criticalItemSafetyStockData,
        outstandingPRData,
        materialToRecieveData,
        materialNotRecievedData,
        inventoryCostData,
        materialCountScrapData,
        inventoryAgingData,
        scheduleComplianceData,
        serviceInterruptionData
    }




}

export const modelWOData = function (woData,filters) {

    const filteredWOData = filterWOData(woData, filters);//division station assetclass date
    
    const filteredWODataNonTime = filterWOData(woData,{...filters,startDate:"",endDate:""});//division station assetclass
    const filteredWODataNonLoc = filterWOData(woData,{...filters,division:[],site:[],block:[],assetClass:[]});//date

    const openWOData = makeOpenWOData(filteredWOData); //division station assetclass date
    const maintenencePercentData = makeMaintenancePercentData(filteredWOData);//division station assetclass date
    const wODueToStartData = makeWODueToStartData(filteredWODataNonTime);//division station assetclass
    const maintenanceTimeData = makeMaintenanceTimeData(filteredWOData);//division station assetclass date
    const topStationFaultData = makeTopStationFaultData(filteredWODataNonLoc);//date
    const totalAssetFaultData = makeTotalAssetFaultData(filteredWODataNonTime);//division station assetclass
    const assetFaultByAssetClassData = makeAssetFaultByAssetClassData(filteredWOData);//division station assetclass date
    const serviceInterruptionData = makeServiceInterruptionData(filteredWOData);
    const scheduleComplianceData = makeScheduleComplianceData(filteredWODataNonLoc);//division  date
    const monthwiseDowntimeData = makeMonthwiseDowntimeData(filteredWODataNonTime); //division station assetclass ?date?

    return(
    {
        maintenanceTimeData,
        openWOData,
        maintenencePercentData,
        wODueToStartData,
        topStationFaultData,
        totalAssetFaultData,
        assetFaultByAssetClassData,
        scheduleComplianceData,
        serviceInterruptionData,
        monthwiseDowntimeData,
    });
}

export const modelAssetData = function (assetData,filters) {
    const filteredAssetData = filterAssetData(assetData, filters);


    const meanMetricsData = makeMeanMetricsData(filteredAssetData); //division station block assetclass
    const inventoryAgingData = makeInventoryAgingData(assetData);

    return(
    {
        meanMetricsData,
        inventoryAgingData,
    });
}

export const modelInventoryData = function (invData,filters) {
    // const filteredInvData = filterInvData(invData, filters);

    const inventoryCostData = makeInventoryCostData(invData);
    const materialCountScrapData = makeMaterialCountScrapData(invData);

    return(
    {
        inventoryCostData,
        materialCountScrapData,
    });
}

export const modelPOData = function (po_data,filters) {
    const materialToRecieveData = makeMaterialToRecieveData(po_data);
    const materialNotRecievedData = makeMaterialNotRecievedData(po_data);
    return(
    {
        materialToRecieveData,
        materialNotRecievedData,
    });
}

export const modelPRData = function (pr_data,filters) {
    const outstandingPRData = makeOutstandingPRData(pr_data);
    return(
    {
        outstandingPRData,
    });
}

export const modelInvBalData = function (invBalData,filters) {
    const criticalItemSafetyStockData = makeCriticalItemSafetyStockData(invBalData);
    return(
    {
        criticalItemSafetyStockData,
    });
}


