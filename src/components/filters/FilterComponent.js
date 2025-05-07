import React from "react";
import { Row, Col, Card, Form, FormGroup, FormLabel, FormControl, Button, FormSelect } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faRotateLeft, faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import { Link } from "react-router-dom";

import { divisionMap, siteMap, blockMap, assetClassMap } from "./FilterConfig";

import  { MultiSelect } from "react-multi-select-component";


import { GlobalStates } from "../../helpers/GlobalStates";


import "./css/FilterComponent.css"


function FilterComponent() {

    const [isOpen, setIsOpen] = React.useState(false);

    const [startDate, setStartDate] = React.useState("");
    const [endDate, setEndDate] = React.useState("");
    const [timespan, setTimespan] = React.useState("All");
    const [division, setDivision] = React.useState([]);
    const [site, setSite] = React.useState([]);
    const [block, setBlock] = React.useState([]);
    const [assetClass, setAssetClass] = React.useState([]);
    const [siteMapFiltered, setSiteMapFiltered] = React.useState([]);
    const [filterMode, setFilterMode]=React.useState("site");


    const [enableDatePicker, setEnableDatePicker] = React.useState(false);

    

    const {filter,setFilter} = React.useContext(GlobalStates).filterState;
    

    useEffect(() => {
        handleTimespanChange();
    }, [timespan]);

    // useEffect(() => {
    //     initFilter();
    // }, []);
   
    useEffect(() => {
        var div=division.map((item)=>item.value);
        var siteMapFiltered = siteMap.filter((item) => div.includes(item.division));
        setSiteMapFiltered(siteMapFiltered);
    }, [division]);


    const filterOnSubmit = (e) => {
        e.preventDefault();

        const divisionList = division;
        const siteList = site;
        const blockList = block;
        const assetClassList = assetClass;


        setFilter({
            startDate,
            endDate,
            timespan,
            division: divisionList,
            site: siteList,
            block: blockList,
            assetClass: assetClassList,
            filterMode
        });



    }

    useEffect(()=>{
        switch(filterMode){
            case "site":
                setBlock([]);
                break;
            case "block":
                setSite([]);
                break;
            default:
                break;
        }

    }, [filterMode]);


    useEffect(() => {
        initFilter();
    }, []);

    const initFilter = () => {
        
        if( filter.timespan==="Custom") 
        {setStartDate(filter.startDate);
        setEndDate(filter.endDate);}
        setTimespan(filter.timespan);
        setDivision(filter.division);
        setSite(filter.site);
        setBlock(filter.block);
        setAssetClass(filter.assetClass);
        handleTimespanChange();
    }
    const resetFilter = () => {
        setStartDate("");
        setEndDate("");
        setTimespan("All");
        setDivision([]);
        setSite([]);
        setBlock([]);
        setAssetClass([]);
        handleTimespanChange();
    }



    const handleTimespanChange = () => {
        setEnableDatePicker(timespan === "Custom");
        if (timespan === "Custom" || timespan === "All") {
            setStartDate("");
            setEndDate("");
            return;
        }

        const timespanMap = {
            "Day": 0,
            "Week": 7,
            "Month": 30,
            "3 Months": 90,
            "6 Months": 180,
            "Year": 365

        }

        setStartDate(new Date(new Date().setDate(new Date().getDate() - timespanMap[timespan])).toISOString().slice(0, 10));
        setEndDate(new Date().toISOString().slice(0, 10));


    }

    

    return (
        <>
            <Row >
                <Col xs={12}>
                    <Row><span className="filter-title" onClick={() => setIsOpen(!isOpen)}>
                        <FontAwesomeIcon icon={faFilter} />
                        &nbsp; FILTER &nbsp;&nbsp;
                        <FontAwesomeIcon icon={isOpen ? faArrowUp : faArrowDown} />

                        </span>
                        </Row>

                        {isOpen &&
                    <Card className={
                        "filter-card" 
                    }>
                        <Card.Header >
                            <span>Categories</span>

                            <div className="right">
                                <FontAwesomeIcon icon={isOpen ? faArrowUp : faArrowDown} />
                            </div>

                        </Card.Header>
                        
                            <Card.Body className="no-gutters">
                                <Form onSubmit={filterOnSubmit} onReset={resetFilter} className="filter-form">
                                    {/* start date and end date */}
                                    <Row className="h-100">
                                        <Col xs={4} className="divider-right">
                                            <Row className="h-100">
                                                <Col xs={4} className="d-flex align-items-center">
                                                    <FormGroup className="w-100" >
                                                        <FormLabel>Start Date</FormLabel>
                                                        <FormControl type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} disabled={!enableDatePicker}  />
                                                    </FormGroup>
                                                </Col>
                                                <Col xs={4} className="d-flex align-items-center">
                                                    <FormGroup className="w-100" >
                                                        <FormLabel>End Date</FormLabel>
                                                        <FormControl type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} disabled={!enableDatePicker} />
                                                    </FormGroup>
                                                </Col>
                                                <Col xs={4} className="d-flex align-items-center">
                                                    <FormGroup className="w-100" >
                                                        <FormLabel>Time Span</FormLabel>
                                                        <FormSelect value={timespan}
                                                            onChange={(e) => {
                                                                setTimespan(e.target.value);
                                                            }} 
                                                            >
                                                            <option>All</option>
                                                            <option>Day</option>
                                                            <option>Week</option>
                                                            <option>Month</option>
                                                            <option>3 Months</option>
                                                            <option>6 Months</option>
                                                            <option>Year</option>
                                                            <option>Custom</option>
                                                        </FormSelect>
                                                    </FormGroup>
                                                </Col>

                                            </Row>
                                        </Col>
                                        <Col xs={5} className="divider-right">
                                            {/* division , site , block   Dropdown */}
                                            <Row className="h-100">
                                                <Col xs={4} className="d-flex align-items-center">
                                                    <FormGroup className="w-100" >
                                                        <FormLabel>Division</FormLabel>
                                                        {/* <div className="form-input">
                                                        <MultiSelect  className="p-multiselect" value={division} onChange={(e) => setDivision(e.value)} options={divisionMap} optionLabel="name" 
                                                            placeholder="Select Divisions" maxSelectedLabels={3}  />
                                                        </div> */}
                                                        <MultiSelect
                                                           
                                                            options={divisionMap}
                                                            value={division}
                                                            onChange={setDivision}
                                                            
                                                        />
                                                        
                                                    </FormGroup>
                                                </Col>
                                                <Col xs={4} className="d-flex align-items-center">
                                                    <FormGroup className="w-100" >
                                                        <FormLabel>Site</FormLabel>
                                                        <MultiSelect
                                                           
                                                            options={siteMapFiltered}
                                                            value={site}
                                                            onChange={(value)=>{
                                                                setFilterMode("site")
                                                                setSite(value)
                                                            }}
                                                            
                                                        />
                                                       
                                                    </FormGroup>
                                                </Col>
                                                <Col xs={4} className="d-flex align-items-center">
                                                    <FormGroup className="w-100" >
                                                        <FormLabel>Block</FormLabel>
                                                        <MultiSelect
                                                           
                                                            options={blockMap}
                                                            value={block}
                                                            onChange={(value)=>{
                                                                setFilterMode("block")
                                                                setBlock(value)
                                                            }}
                                                            
                                                            
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>

                                        </Col>
                                        <Col xs={3}>
                                            {/* asset class , reset button , search button*/}
                                            
                                            <Row className="h-100"> 
                                                <Col xs={7} className="d-flex align-items-center">
                                                    <FormGroup className="w-100" >
                                                        <FormLabel>Asset Class</FormLabel>
                                                        <MultiSelect
                                                            className="asset-class-select"
                                                            options={assetClassMap}
                                                            value={assetClass}
                                                            onChange={setAssetClass}
                                                    
                                                            
                                                            
                                                        />
                                                    
                                                    </FormGroup>
                                                </Col>
                                                <Col xs={2} className="h-100">
                                                    <div className="d-flex align-items-center h-100">

                                                <Button variant="secondary" className="reset-filter-button" type="reset">
                                                        <FontAwesomeIcon icon={faRotateLeft} />
                                                    </Button>
                                                    </div>
                                                    </Col>

                                                <Col xs={3} className="h-100">
                                                    <div className="d-flex align-items-center h-100">
                                                    {/* <FormGroup> */}

                                                    <Button className="submit-filter-button" type="submit"><span>Search</span></Button>
                                                    </div>
                                                    {/* </FormGroup> */}
                                                </Col>
                                                </Row>

                                        </Col>

                                    </Row>
                                </Form>
                            </Card.Body>
                    </Card>
                        }
                </Col>

                {/* <Col xs={1} >
                    <div className={
                        "open-am-button-container " +
                        (isOpen ? "open" : "")
                    }>
                        <Button className="open-am-button" href="http://117.250.150.91:9080/maximo" ><span>Open AM</span></Button>
                    </div>
                </Col> */}

            </Row>
        </>
    );
}

export default FilterComponent;