import React from "react";
import { Container } from "react-bootstrap";
import FilterComponent from "../filters/FilterComponent"
import { Row, Col, Card } from 'react-bootstrap';
import { useEffect } from "react";
import D3Chart from "../graphs/D3Chart";
import Button from "react-bootstrap/Button";


import { GlobalStates } from '../../helpers/GlobalStates';


import LoadingScreen from "../loading/LoadingScreen";


function InventoryManagement() {



    const { dataModelsState, dataLoadState, appConfig } = React.useContext(GlobalStates);




    const [inventoryCostData, setInventoryCostData] = React.useState({});
    const [criticalItemSafetyStockData, setCriticalItemSafetyStockData] = React.useState({});
    const [outstandingPRData, setOutstandingPRData] = React.useState({});
    const [materialToRecieveData, setMaterialToRecieveData] = React.useState({});
    const [materialNotRecievedData, setMaterialNotRecievedData] = React.useState({});
    const [materialCountScrapData, setMaterialCountScrapData] = React.useState([]);
    const [inventoryAgingData, setInventoryAgingData] = React.useState({});

    useEffect(() => {
        const invData = dataModelsState.dataModels.inventoryModel;
        const invBalData = dataModelsState.dataModels.invBalModel;
        const prData = dataModelsState.dataModels.prModel;
        const assetData = dataModelsState.dataModels.assetModel;

        const poData = dataModelsState.dataModels.poModel;


        if (invData) {
            setInventoryCostData(invData.inventoryCostData);
            setMaterialCountScrapData([...invData.materialCountScrapData]);
        }

        if (invBalData) {
            setCriticalItemSafetyStockData([...invBalData.criticalItemSafetyStockData]);
        }


        if (prData) {
            setOutstandingPRData([...prData.outstandingPRData]);
        }
        if (poData) {
            setMaterialToRecieveData([...poData.materialToRecieveData]);
            setMaterialNotRecievedData([...poData.materialNotRecievedData]);
        }

        if (assetData) {
            setInventoryAgingData(assetData.inventoryAgingData);
        }



    }, [dataModelsState.dataModels]);


    const OpenMaximoInvURL = () => {
        window.open(appConfig?.MAX_INVENTORY_URL, "_blank");
    }


    return (

        <Container fluid className="container-side-padding">
            {/* <Row className="g-0">
                <Col xs={12}>
                    <FilterComponent />
                </Col>
                
            </Row> */}
            {/* <hr className="content-seperator" /> */}
            <Row className="cardgroup-row">
                <Col xs={6}>
                    <Card className="cardgroup-card3" onClick={OpenMaximoInvURL}>
                        <Card.Header style={{ fontSize: "12px" }}>Critical items Balance below Min and above Safety Stock</Card.Header>
                        <Card.Body>
                            <LoadingScreen isLoading={dataLoadState.isLoading?.invBalData} >
                                <D3Chart type="bar-vertical" data={criticalItemSafetyStockData} options={{
                                    height: 250,
                                    width: 1000,
                                    padding: 0.5,
                                    fillcolor: "#f55",
                                    tickFontSize: "1rem",
                                    labelFontSize: "1rem",
                                    xTickOffsetY: 5,
                                    valueLabelFontSize: "1rem",
                                    valueLabelContent: (d) => d.value.toFixed(0),
                                    maxValuePadding: 0.2,
                                    valueLabelOffsetY: -10,
                                    margin: { top: 20, right: 20, bottom: 30, left: 40 },

                                    yLabel: "Count →",
                                    yLabelFontSize: "1rem",
                                    yLabelXOffset: 0,
                                    yLabelYOffset: 30,

                                }} />
                            </LoadingScreen>

                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={6}>
                    <Card className="cardgroup-card3" onClick={OpenMaximoInvURL}>
                        <Card.Header > Outstanding PR where no PO created</Card.Header>
                        <Card.Body>
                            <LoadingScreen isLoading={dataLoadState.isLoading?.prData} >
                                <D3Chart type="bar-vertical" data={outstandingPRData} options={{
                                    height: 250,
                                    width: 1000,
                                    padding: 0.5,
                                    fillcolor: "#69b3a2",
                                    tickFontSize: "1rem",
                                    labelFontSize: "1rem",
                                    xTickOffsetY: 5,
                                    valueLabelFontSize: "1rem",
                                    valueLabelContent: (d) => d.value.toFixed(0),
                                    maxValuePadding: 0.2,
                                    valueLabelOffsetY: -10,
                                    margin: { top: 20, right: 20, bottom: 30, left: 40 },

                                    yLabel: "Count →",
                                    yLabelFontSize: "1rem",
                                    yLabelXOffset: 0,
                                    yLabelYOffset: 30,
                                }} />
                            </LoadingScreen>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="cardgroup-row">
                <Col xs={6}>
                    <Card className="cardgroup-card3" onClick={OpenMaximoInvURL}>
                        <Card.Header >Material due for receiving in next 7 days</Card.Header>
                        <Card.Body>
                            <LoadingScreen isLoading={dataLoadState.isLoading?.poData} >
                                <D3Chart type="bar-vertical" data={materialToRecieveData} options={{
                                    height: 250,
                                    width: 1000,
                                    padding: 0.5,
                                    fillcolor: "#f55",
                                    tickFontSize: "1rem",
                                    labelFontSize: "1rem",
                                    xTickOffsetY: 5,
                                    valueLabelFontSize: "1rem",
                                    valueLabelContent: (d) => d.value.toFixed(0),
                                    maxValuePadding: 0.2,
                                    valueLabelOffsetY: -10,
                                    margin: { top: 20, right: 20, bottom: 30, left: 40 },

                                    yLabel: "Count →",
                                    yLabelFontSize: "1rem",
                                    yLabelXOffset: 0,
                                    yLabelYOffset: 30,
                                }} />
                            </LoadingScreen>

                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={6}>
                    <Card className="cardgroup-card3" onClick={OpenMaximoInvURL}>
                        <Card.Header >Material Count not recieved by delivery date</Card.Header>
                        <Card.Body>
                            <LoadingScreen isLoading={dataLoadState.isLoading?.poData} >
                                <D3Chart type="bar-vertical" data={materialNotRecievedData} options={{
                                    height: 250,
                                    width: 1000,
                                    padding: 0.5,
                                    fillcolor: "#f55",
                                    tickFontSize: "1rem",
                                    labelFontSize: "1rem",
                                    xTickOffsetY: 5,
                                    valueLabelFontSize: "1rem",
                                    valueLabelContent: (d) => d.value.toFixed(0),
                                    maxValuePadding: 0.2,
                                    valueLabelOffsetY: -10,
                                    margin: { top: 20, right: 20, bottom: 30, left: 40 },

                                    yLabel: "Count →",
                                    yLabelFontSize: "1rem",
                                    yLabelXOffset: 0,
                                    yLabelYOffset: 30,
                                }} />
                            </LoadingScreen>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="cardgroup-row" >
                <Col xs={6}>
                    <Card className="cardgroup-card3" onClick={OpenMaximoInvURL}>
                        <Card.Header >Inventory Cost as per ABC Classification</Card.Header>
                        <Card.Body>
                            <LoadingScreen isLoading={dataLoadState.isLoading?.inventoryData} >
                                <D3Chart type="stacked-bar-vertical" data={inventoryCostData} options={{
                                    height: 250,
                                    width: 1000,
                                    padding: 0.5,
                                    fillcolors: ["#F57", "#357", "#ff8000"],
                                    legendX: 0,
                                    legendY: 15,
                                    ticksCount: 5,
                                    tickFontSize: "1rem",

                                    valueLabelContent: (d) => d.value.toFixed(0),
                                    maxValuePadding: 0.2,
                                    margin: { top: 0, right: 20, bottom: 30, left: 60 },

                                    yLabel: "Inventory Value →",
                                    yLabelFontSize: "1rem",
                                    yLabelMargin: 20,
                                    yLabelYOffset: 20,
                                    xTickOffsetY: 5,

                                    legendCircleRadius: 6,
                                    legendFontSize: "1rem",

                                }} />
                            </LoadingScreen>

                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={6}>
                    <Card className="cardgroup-card3" onClick={OpenMaximoInvURL}>
                        <Card.Header >Material/asset count due for scrap/obsolescence</Card.Header>
                        <Card.Body>
                            <LoadingScreen isLoading={dataLoadState.isLoading?.inventoryData} >
                                <D3Chart type="bar-multi-vertical" data={materialCountScrapData} options={{
                                    height: 250,
                                    width: 1000,
                                    paddingCategories: 0.3,
                                    paddingLabels: 0.1,
                                    legendFontSize: "1.2rem",
                                    tickFontSize: "1rem",
                                    labelFontSize: "1rem",
                                    xTickOffsetY: 5,
                                    valueLabelFontSize: "1rem",
                                    valueLabelContent: (d) => d.value.toFixed(0),
                                    maxValuePadding: 0.2,
                                    valueLabelOffsetY: -10,
                                    margin: { top: 0, right: 30, bottom: 30, left: 30 },

                                    yLabel: "Count →",
                                    yLabelFontSize: "1rem",
                                    yLabelXOffset: 0,
                                    yLabelYOffset: 0,
                                    legendPositionOffsetY: 20,
                                    legendPositionOffsetX: -50,

                                    legendRectSize: 15,
                                    legendFontSize: "0.9rem",
                                }} />
                            </LoadingScreen>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="cardgroup-row">
                <Col xs={12}>
                    <Card className="cardgroup-card3" onClick={OpenMaximoInvURL}>
                        <Card.Header >Rotating Asset Inventory Aging Status</Card.Header>
                        <Card.Body>
                            <LoadingScreen isLoading={dataLoadState.isLoading?.assetData} >
                                <D3Chart type="stacked-bar-vertical" data={inventoryAgingData} options={{
                                    height: 250,
                                    width: 2000,
                                    padding: 0.8,
                                    fillcolors: ["#F57", "#357", "#ff8000"],
                                    legendX: 0,
                                    legendY: 15,
                                    ticksCount: 5,
                                    tickFontSize: "1rem",

                                    valueLabelContent: (d) => d.value.toFixed(0),
                                    maxValuePadding: 0.2,
                                    margin: { top: 0, right: 20, bottom: 35, left: 40 },

                                    yLabel: "Count →",
                                    yLabelFontSize: "1rem",

                                    yLabelXOffset: 0,
                                    yLabelMargin: 30,
                                    yLabelYOffset: 30,
                                    legendCircleRadius: 6,
                                    legendFontSize: "0.9rem",

                                }} />
                            </LoadingScreen>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default InventoryManagement;