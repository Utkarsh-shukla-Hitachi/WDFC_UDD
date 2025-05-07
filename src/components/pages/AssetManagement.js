import React from "react";
import { Container } from "react-bootstrap";
import FilterComponent from "../filters/FilterComponent"
import D3Chart from "../graphs/D3Chart";
import { useEffect } from "react";
import { Row, Col, Card, CardBody } from 'react-bootstrap';
import ResponsiveSVG from "../graphs/ResponsiveSVG";

import { GlobalStates } from '../../helpers/GlobalStates';


import LoadingScreen from "../loading/LoadingScreen";


function AssetManagement() {

    const { dataModelsState, dataLoadState, appConfig } = React.useContext(GlobalStates);


    const [monthwiseDowntimeData, setMonthwiseDowntimeData] = React.useState([]);
    const [totalAssetFaultData, setTotalAssetFaultData] = React.useState();
    const [assetFaultByAssetClassData, setAssetFaultByAssetClassData] = React.useState([]);
    const [topStationFaultData, setTopStationFaultData] = React.useState({})
    const [meanMetrics, setMeanMetrics] = React.useState({ mttr: 0, mtbf: 0, frpcpy: 0 })

    useEffect(() => {
        const assetData = dataModelsState.dataModels.assetModel;
        const woData = dataModelsState.dataModels.woModel;
        if (woData) {
            setMonthwiseDowntimeData([...woData.monthwiseDowntimeData]);
            setTotalAssetFaultData(woData.totalAssetFaultData);
            setAssetFaultByAssetClassData([...woData.assetFaultByAssetClassData]);
            setTopStationFaultData(woData.topStationFaultData);
        }
        if (assetData) {
            setMeanMetrics(assetData.meanMetricsData);
        }

    }, [dataModelsState.dataModels]);

    const OpenMaximoAssetURL = () => {
        window.open(appConfig?.MAX_ASSET_URL, "_blank");
    }
    const OpenMaximoWOURL = () => {
        window.open(appConfig?.MAX_WO_URL, "_blank");
    }

    // const hourFormatter = (d) => {
    //     //days and hours
    //     const days = Math.floor(d / (24 * 60));
    //     const hours = Math.floor(d % (24 * 60) / 60);

    //     if (days === 0) {
    //         return hours + " H";
    //     }
    //     return days + " D " + hours + " H";
    // };

    const hourConverter = (d) => {
        //days and hours
        const days = Math.floor(d / (24 * 60));
        const hours = Math.floor(d % (24 * 60) / 60);
        
        if (days === 0) {
            return [hours + " H"];
        }
        return [days + " D", hours + " H"];
    };

    return (
        <Container fluid className="container-side-padding">
            <Row className="g-0">
                <FilterComponent />

            </Row>
            <hr className="content-seperator" />
            <Row className="cardgroup-row" >

                <Col xs={6}>
                    <Row>
                        <div className="card-title-heading">Top 3 Station(associated ALH) highest fault%</div>
                    </Row>
                    <Row >
                        <Col xs={6}>
                            <Card className="cardgroup-card2" onClick={OpenMaximoWOURL}>
                                <Card.Header className="d-flex justify-content-center">Jaipur</Card.Header>
                                <CardBody>
                                    <LoadingScreen isLoading={dataLoadState.isLoading?.woData}>

                                        <div className="compliance-cardbody-div">

                                            <D3Chart type="pie" data={topStationFaultData.jaipur} options={{
                                                height: 500,
                                                width: 560,
                                                innerRadius: 0,
                                                outerRadius: 170,
                                                fillcolor: ["#F2D43D", "#5373C2", "#BA4E56"],
                                                valueLabelOuterFontSize: "38px",
                                                valueLabelOuterDistance: 45,
                                                legendFontSize: "3rem",
                                                legendCircleRadius: 25,
                                                legendPadding: 70,
                                                legendSpacing: 50,
                                                legendLinebreakPadding: 20,
                                                tooltipContent: (d, color) => `<span style="color:${color};">` + d.data.label + "</span> : " + d.data.value + "%",
                                                valueLabelContent: (d, color) => d.value + "%",
                                                chartY: 230}} />
                                        </div>
                                    </LoadingScreen>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xs={6} >
                            <Card className="cardgroup-card2" onClick={OpenMaximoWOURL}>
                                <Card.Header className="d-flex justify-content-center" >Ajmer</Card.Header>
                                <CardBody>
                                    <LoadingScreen isLoading={dataLoadState.isLoading?.woData}>
                                        <div className="compliance-cardbody-div">
                                            <D3Chart type="pie" data={topStationFaultData.ajmer} options={{
                                                height: 500,
                                                width: 560,
                                                innerRadius: 0,
                                                outerRadius: 170,
                                                fillcolor: ["#F2D43D", "#5373C2", "#BA4E56"],
                                                valueLabelOuterFontSize: "38px",
                                                valueLabelOuterDistance: 45,
                                                legendFontSize: "3rem",
                                                legendCircleRadius: 25,
                                                legendPadding: 70,
                                                legendSpacing: 50,
                                                legendLinebreakPadding: 20,
                                                tooltipContent: (d, color) => `<span style="color:${color};">` + d.data.label + "</span> : " + d.data.value + "%",
                                                valueLabelContent: (d, color) => d.value + "%",
                                                chartY: 230}} />
                                        </div>
                                    </LoadingScreen>
                                </CardBody>
                            </Card>
                        </Col>

                    </Row>
                </Col>

                <Col xs={6}>

                    <Row>
                        <Col xs={6} />
                        <Col xs={6}>
                            <div className="card-title-heading"> MTTR, MTBF, FRPCPY</div>
                        </Col>

                    </Row>
                    <Row>
                        <Col xs={6}  >
                            <Card className="cardgroup-card2" onClick={OpenMaximoWOURL}>
                                <Card.Header className="d-flex justify-content-center">Ahmedabad</Card.Header>
                                <CardBody>
                                    <LoadingScreen isLoading={dataLoadState.isLoading?.woData}>
                                        <div className="compliance-cardbody-div">

                                            <D3Chart type="pie" data={topStationFaultData.ahmedabad} options={{
                                                height: 500,
                                                width: 560,
                                                innerRadius: 0,
                                                outerRadius: 170,
                                                fillcolor: ["#F2D43D", "#5373C2", "#BA4E56"],
                                                valueLabelOuterFontSize: "38px",
                                                valueLabelOuterDistance: 45,
                                                legendFontSize: "3rem",
                                                legendCircleRadius: 25,
                                                legendPadding: 70,
                                                legendSpacing: 50,
                                                legendLinebreakPadding: 20,
                                                tooltipContent: (d, color) => `<span style="color:${color};">` + d.data.label + "</span> : " + d.data.value + "%",
                                                valueLabelContent: (d, color) => d.value + "%",
                                                chartY: 230,
                                            }} />
                                        </div>
                                    </LoadingScreen>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xs={6}  >
                            <Card className="cardgroup-card2" onClick={OpenMaximoAssetURL}>
                                <Card.Body>
                                    <LoadingScreen isLoading={dataLoadState.isLoading?.assetData}>
                                        <div className="compliance-cardbody-div">

                                            <ResponsiveSVG height={220} width={530} top={30} left={-30} divStyle={{ width: "100%", height: "100%" }}>
                                                <line x1={0} y1={80} x2={480} y2={80} className="grid-line" strokeWidth={2} />
                                                <line x1={335} y1={100} x2={335} y2={235} className="grid-line" strokeWidth={2} />
                                                <line x1={145} y1={100} x2={145} y2={235} className="grid-line" strokeWidth={2} />
                                                <g>
                                                    <text x={15} y={65} fontSize={24} fontWeight={"bold"}>
                                                        MTTR
                                                    </text>
                                                    <circle r={70} cx={50} cy={170} fill="#69b3a2" />
                                                    <text x={50} y={170} fontSize={27} className="svg-text-secondary" textAnchor="middle" alignmentBaseline="middle">
                                                        {hourConverter(meanMetrics?.mttr).map
                                                            ((d, i) => <tspan key={i} x={50} dy={i === 0 ? 0 : 30}>{d}</tspan>)}
                                                            
                                                    </text>
                                                </g>

                                                <g>
                                                    <text x={210} y={65} fontSize={24} fontWeight={"bold"}>
                                                        MTBF
                                                    </text>
                                                    <circle r={70} cx={240} cy={170} fill="#69b3a2" />
                                                    <text x={240} y={170} fontSize={27} className="svg-text-secondary" textAnchor="middle" alignmentBaseline="middle">
                                                        {hourConverter(meanMetrics?.mtbf).map
                                                            ((d, i) => <tspan key={i} x={240} dy={i === 0 ? 0 : 30}>{d}</tspan>)}

                                                    </text>
                                                </g>

                                                <g>
                                                    <text x={380} y={65} fontSize={24} fontWeight={"bold"}>
                                                        FRPCPY %
                                                    </text>
                                                    <circle r={70} cx={430} cy={170} fill="#69b3a2" />
                                                    <text x={430} y={165} fontSize={27} className="svg-text-secondary" textAnchor="middle" alignmentBaseline="middle">
                                                        {meanMetrics?.frpcpy}%
                                                    </text>
                                                </g>
                                            </ResponsiveSVG>
                                        </div>
                                    </LoadingScreen>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                </Col>

            </Row>

            <Row className="cardgroup-row">
                <Col xs={6}>
                    <Card className="cardgroup-card" onClick={OpenMaximoAssetURL}>
                        <Card.Header >
                            Monthwise total downtime reported

                        </Card.Header>
                        <Card.Body>
                            <LoadingScreen isLoading={dataLoadState.isLoading?.woData}>
                                <D3Chart type="bar-vertical" data={monthwiseDowntimeData} options={{
                                    height: 260,
                                    width: 1100,
                                    padding: 0.5,
                                    fillcolor: "#BA4E56",
                                    yLabel: "Downtime (Hours) →",
                                    valueLabelContent: (d) => d.value.toFixed(0),
                                    valueLabelFontSize: "1rem",
                                    yLabelYOffset: 10,
                                    yLabelXOffset: 0,
                                    margin: { top: 20, right: 20, bottom: 40, left: 60 },
                                    yLabelMargin: 25,
                                    tickFontSize: "1.2rem",
                                    yLabelFontSize: "1.2rem",


                                }} />
                            </LoadingScreen>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={6}>
                    <Card className="cardgroup-card" onClick={OpenMaximoAssetURL}>
                        <Card.Header >
                            Top 5 major contributors of Asset Fault by Asset Class
                        </Card.Header>
                        <Card.Body>
                            <LoadingScreen isLoading={dataLoadState.isLoading?.woData}>
                                <D3Chart type="bar-vertical" data={assetFaultByAssetClassData} options={{
                                    height: 260,
                                    width: 1100,
                                    padding: 0.8,
                                    fillcolor: "#DCA0C8",
                                    yLabel: "Fault Count →",
                                    valueLabelContent: (d) => d.value.toFixed(0),
                                    valueLabelFontSize: "1.2rem",

                                    yLabelYOffset: 20,
                                    yLabelXOffset: 0,
                                    yLabelMargin: 40,
                                    axisLabelLineFormat: (d) => [d],
                                    margin: { top: 20, right: 20, bottom: 40, left: 40 },
                                    tickFontSize: "1.3rem",
                                    xLabelFontSize: "1.1rem",
                                    yLabelFontSize: "1.2rem",
                                }} />
                            </LoadingScreen>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="cardgroup-row">

                <Col xs={12}>
                    <Card className="cardgroup-card" onClick={OpenMaximoAssetURL}>
                        <Card.Header >
                            Total asset fault trend for last 12 months

                        </Card.Header>
                        <Card.Body>
                            <LoadingScreen isLoading={dataLoadState.isLoading?.woData}>
                                <D3Chart type="line" data={totalAssetFaultData} options={{
                                    height: 250,
                                    width: 2200,
                                    fillcolor: "blue",
                                    padding: 0.5,
                                    lineColors: ["#BA4E56", "#404080", "#69b3a2"],
                                    valuePointColors: ["#BA4E56", "#404080", "#69b3a2"],
                                    margin: { top: 10, right: 30, bottom: 30, left: 50 },
                                    yLabel: "Fault Count →",
                                    maxValuePadding: 1,
                                    tickWholeValues: true,
                                    legendX: 2000,
                                    legendFontSize: "1.2rem",
                                    legendCircleRadius: 7,
                                    legendMargin: 13,
                                    yLabelYOffset: 20,
                                    yLabelXOffset: 10,
                                    yLabelFontSize: "1.3rem",
                                    ticksCount: 3,
                                }} />
                            </LoadingScreen>
                        </Card.Body>
                    </Card>

                </Col>
            </Row>
        </Container>
    );
}

export default AssetManagement;