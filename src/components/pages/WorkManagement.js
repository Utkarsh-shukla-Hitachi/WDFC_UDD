import React, { useEffect } from "react";
import { Card, Container } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";

import FilterComponent from "../filters/FilterComponent";
import D3Chart from "../graphs/D3Chart";
import ResponsiveSVG from "../graphs/ResponsiveSVG";


import { GlobalStates } from '../../helpers/GlobalStates';

import LoadingScreen from "../loading/LoadingScreen";

function WorkManagement() {


    const [scheduleComplianceData, setScheduleComplianceData] = React.useState({
        jaipur: 65,
        ajmer: 72,
        ahmedabad: 90
    });

    const { dataModelsState, dataLoadState, appConfig } = React.useContext(GlobalStates);







    const [openWOData, setOpenWOData] = React.useState([]);
    const [maintenanceTimeData, setMaintenanceTimeData] = React.useState([]);
    const [wODueToStartData, setWODueToStartData] = React.useState([]);
    const [maintenencePercentData, setMaintenencePercentData] = React.useState([]);


    useEffect(() => {
        const data = dataModelsState.dataModels.woModel;
        if (!data) return;



        setOpenWOData([...data.openWOData]);
        setMaintenanceTimeData([...data.maintenanceTimeData]);
        setWODueToStartData([...data.wODueToStartData]);
        setMaintenencePercentData([...data.maintenencePercentData]);
        setScheduleComplianceData({ ...data.scheduleComplianceData });

    }, [dataModelsState.dataModels]);

    const getScheduleComplianceColor = (value) => {
        if (value >= 90) {
            return "#17A948FF";
        } else if (value >= 70) {
            return "#F49D1AFF";
        } else {
            return "#FF2B91FF";
        }
    }

    const OpenMaximoURL = () => {
        window.open(appConfig?.MAX_WO_URL, "_blank");
    }



    return (
        <Container fluid className="container-side-padding">
            <Row className="g-0">
                <FilterComponent />
            </Row>

            <hr className="content-seperator" />
            <Row className="cardgroup-row">
                <Col xs={6}>
                    <Card className="cardgroup-card" onClick={OpenMaximoURL}>
                        <Card.Header >Schedule Compliance</Card.Header>
                        <Card.Body>
                            <LoadingScreen isLoading={dataLoadState.isLoading?.woData} >
                                <div className="compliance-cardbody-div">
                                    <ResponsiveSVG height={240} width={700} top={0} left={-50} divStyle={{ width: "100%", height: "100%" }}>
                                        {/* Add Horizontal legends with small circle and text to indicate color with percent  */}
                                        <circle id="legend1" r={8} cx={101} cy={220} fill="#17A948FF" />
                                        <text x={115} y={227} fontSize={20}>
                                            {"> 90%"}
                                        </text>
                                        <circle id="legend2" r={7} cx={250} cy={220} fill="#F49D1AFF" />
                                        <text x={265} y={227} fontSize={20}>
                                            {"70% - 90%"}
                                        </text>
                                        <circle id="legend3" r={7} cx={430} cy={220} fill="#FF2B91FF" />
                                        <text x={445} y={227} fontSize={20}>
                                            {"< 70%"}
                                        </text>
                                        <g>
                                            <circle id="jaipur" r={70} cx={40} cy={80} fill={getScheduleComplianceColor(scheduleComplianceData.jaipur)} />
                                            <text
                                                x={40}
                                                y={80}
                                                style={{ fontSize: 35 }}
                                                className="svg-text-secondary"
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                {scheduleComplianceData.jaipur}%
                                            </text>
                                            <text x={40} y={185} fontSize={20} textAnchor="middle">
                                                Jaipur
                                            </text>
                                        </g>

                                        <g>
                                            <circle id="ajmer" r={70} cx={300} cy={80} fill={getScheduleComplianceColor(scheduleComplianceData.ajmer)} />
                                            <text
                                                x={300}
                                                y={80}
                                                style={{ fontSize: 30 }}
                                                className="svg-text-secondary"
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                {scheduleComplianceData.ajmer}%
                                            </text>
                                            <text x={300} y={185} fontSize={20} textAnchor="middle">
                                                Ajmer
                                            </text>
                                        </g>

                                        <g>
                                            <circle id="ahmedabad" r={70} cx={560} cy={80} fill={getScheduleComplianceColor(scheduleComplianceData.ahmedabad)} />
                                            <text
                                                x={560}
                                                y={80}
                                                style={{ fontSize: 30 }}
                                                className="svg-text-secondary"
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                {scheduleComplianceData.ahmedabad}%
                                            </text>
                                            <text x={560} y={185} fontSize={20} textAnchor="middle">
                                                Ahmedabad
                                            </text>
                                        </g>

                                    </ResponsiveSVG>
                                </div>
                            </LoadingScreen>

                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={6}>
                    <Card className="cardgroup-card" onClick={OpenMaximoURL}>
                        <Card.Header >Open Work Order by Status</Card.Header>
                        <Card.Body>
                            <LoadingScreen isLoading={dataLoadState.isLoading?.woData} >
                                <div className="compliance-cardbody-div">

                                    <D3Chart type="pie" data={openWOData} options={{
                                        height: 510,
                                        width: 600,
                                        innerRadius: 120,
                                        outerRadius: 190,
                                        fillcolor: ["#e4bf80", "#e9d78e",
                                            "#e2975d", "#e16552", "#993767",
                                            "#9163b6", "#e279a3", "#e0598b",
                                            "#7c9fb0", "#5698c4"].reverse(),
                                        valueLabelOuterDistance: 33,
                                        valueLabelOuterFontSize: "1.7rem",
                                        //    valueLabelInner : true,
                                        legendY: 50,
                                        legendX: 450,
                                        legendFontSize: "2.7rem",
                                        legendCircleRadius: 17,
                                        legendPadding: 40,
                                        legendSpacing: 40,
                                        legendLinebreakPadding: 11,
                                        chartX: -100,
                                        chartY: 270,
                                        legendLinebreakEnd: 450,
                                        showTotal: true,
                                        totalFormat: (d) => "Total: " + d,
                                        totalFontSize: "2.4rem",
                                    }} />
                                </div>
                            </LoadingScreen>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="cardgroup-row">
                <Col xs={6}>
                    <Card className="cardgroup-card" onClick={OpenMaximoURL}>
                        <Card.Header >Percentage of Total Maintenance</Card.Header>
                        <Card.Body>
                            <LoadingScreen isLoading={dataLoadState.isLoading?.woData} >
                                <div className="compliance-cardbody-div">

                                    <D3Chart type="pie" data={maintenencePercentData} options={{
                                        height: 500,
                                        width: 600,
                                        innerRadius: 120,
                                        outerRadius: 190,
                                        valueLabelContent: (d) => d.data.value,
                                        valueLabelOuterDistance: 30,
                                        valueLabelOuterFontSize: "1.7rem",
                                        showTotal: true,
                                        totalFormat: (d) => "Total: " + d,
                                        totalFontSize: "2.4rem",
                                        // valueLabelInner : true,
                                        valueAsPercent: true,
                                        valuePercentPrecision: 0,
                                        tooltipContent: (d, color) => `<span style="color:${color};">` + d.data.label + "</span> : " + d.data.value + "%",
                                        legendY: 70,
                                        legendX: 450,
                                        legendFontSize: "2.7rem",
                                        legendCircleRadius: 17,
                                        legendPadding: 44,
                                        legendSpacing: 40,
                                        legendLinebreakPadding: 15,
                                        chartX: -100,
                                        chartY: 250,
                                        legendLinebreakEnd: 530,
                                    }} />

                                </div>
                            </LoadingScreen>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={6}>
                    <Card className="cardgroup-card" onClick={OpenMaximoURL}>
                        <Card.Header >WO due to start in Next 3 days</Card.Header>
                        <Card.Body>
                            <LoadingScreen isLoading={dataLoadState.isLoading?.woData} >
                                <D3Chart type="bar-vertical" data={wODueToStartData} options={{
                                    height: 250,
                                    width: 1000,
                                    padding: 0.7,
                                    fillcolor: "#5373c2",
                                    yLabel: "Count →",
                                    yLabelYOffset: 20,
                                    yLabelXOffset: 0,
                                    yLabelFontSize: "1.4rem",
                                    tickFontSize: "1.2rem",
                                    xLabelFontSize: "1.2rem",

                                    valueLabelContent: (d) => d.value.toFixed(0),
                                    margin: { top: 15, right: 20, bottom: 50, left: 30 },

                                }} />
                            </LoadingScreen>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="cardgroup-row">
                <Col xs={12}>
                    <Card className="cardgroup-card" onClick={OpenMaximoURL}>
                        <Card.Header >Total Maintenance Time for Top 5 Asset Classes</Card.Header>
                        <Card.Body>
                            <LoadingScreen isLoading={dataLoadState.isLoading?.woData} >
                                <D3Chart type="bar-vertical" data={maintenanceTimeData} options={{
                                    height: 250,
                                    width: 2000,
                                    padding: 0.85,
                                    fillcolor: "#5373c2",
                                    yLabel: "Duration of Work  →",

                                    yLabelYOffset: 10,
                                    yLabelXOffset: 0,
                                    axisLabelLineFormat: (d) => [d],
                                    yLabelFontSize: "1.2rem",
                                    xLabelFontSize: "1.2rem",
                                    tickFontSize: "1.1em",
                                    ticksCount: 5,
                                    tickFactor: 60,
                                    margin: { top: 10, right: 20, bottom: 50, left: 70 },
                                    yLabelMargin: 40,
                                    valueLabelFontSize: "1.1rem",
                                    //format to days, hours, minutes
                                    valueLabelContent: (d) => {
                                        let hours = Math.floor(d.value / 60);
                                        let minutes = Math.floor(d.value % 60);
                                        let days = Math.floor(hours / 24);
                                        hours = hours % 24;

                                        if (days === 0 && minutes == 0 && hours == 0) {
                                            return 0;
                                        }

                                        //auto show days if more than 1 day and hours if more than 1 hour
                                        if (days > 0) {
                                            return days + "D " + hours + "H";
                                        } else if (hours > 0 && minutes > 0) {
                                            return hours + "H " + minutes + "M";
                                        }
                                        if (hours > 0) {
                                            return hours + "H";
                                        }
                                        else {
                                            return minutes + "M";
                                        }
                                    },

                                    tickLabelContent: (d) => {
                                        let hours = Math.floor(d / 60);
                                        let minutes = Math.floor(d % 60);
                                        let days = Math.floor(hours / 24);
                                        hours = hours % 24;
                                        if (days === 0 && minutes == 0 && hours == 0) {
                                            return 0;
                                        }
                                        //auto show days if more than 1 day and hours if more than 1 hour
                                        if (days > 0) {
                                            return days + "D " + hours + "H";
                                        } else if (hours > 0 && minutes > 0) {
                                            return hours + "H " + minutes + "M";
                                        }
                                        if (hours > 0) {
                                            return hours + "H";
                                        }
                                        else {
                                            return minutes + "M";
                                        }
                                    }


                                }} />

                            </LoadingScreen>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default WorkManagement;