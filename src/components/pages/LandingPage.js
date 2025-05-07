import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import dfccilLogo from "../../assets/logo-dfccil.png";
import Image from 'react-bootstrap/Image'
import "./css/LandingPage.css"
import { Link,NavLink } from "react-router-dom";

import landingBg from "../../assets/landingBg.png"


function LandingPage() {
  return (
    <Container fluid className="landing-page-container" style={{
        backgroundImage: `url(${landingBg})`,
        backgroundSize: "cover",
    }}>
        <Row style={{padding:"0px"}}>
           

            <Col xs={9} className="landing-page-left" >
                {/* <Image src={backgroundImage} alt="background" className="landing-page-background-image" style={{height:"100vh",width:"100%"}}
                 /> */}
            </Col>

            <Col xs={3} className="landing-page-right">

                    <Col xs={12} className="landing-page-title-block">
                        <Image src={dfccilLogo} alt="logo" className="landing-page-logo" />
                        <span className="landing-page-title">Welcome To <b>DFCCIL</b></span>
                        <span className="landing-page-subtitle">Smart Maintenance Operation</span>
                    </Col>
                    
                    <Col xs={12} className="landing-page-button-block">
                        <Button className="landing-page-button btn-hitachi-red" as={Link} to="/work" >Dashboard</Button>
                        <Button className="landing-page-button btn-hitachi-red" as={Link} to="/" >Asset Management</Button>
                        <Button className="landing-page-button btn-hitachi-red" as={Link} to="/" >IRMS</Button>

                        </Col>


                    

            </Col>


            
            </Row>


    </Container>

  );
}

export default LandingPage;