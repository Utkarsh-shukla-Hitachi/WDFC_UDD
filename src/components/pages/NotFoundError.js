import React from "react";

import errorImage from "../../assets/pagenotfound.png";

import { Link } from 'react-router-dom';
import { Button, Col, Container, Row } from "react-bootstrap";

function NotFoundError(){
    return(
        <Container className="not-found-error">
            <Col xs={12} style={{textAlign:"center" ,justifyContent:"center",alignItems:"center",display:"flex",flexDirection:"column",marginTop:"100px"}}>
            
            <h3>Page Not Found !</h3>
            <br/>
            <br/>
            
            
            <img src={errorImage} alt="error" style={{
                width:"200px",
                height:"200px",
                objectFit:"contain"
            
            }} />
            <br/>
            <br/>
            <br/>
            
            <Button className="btn btn-hitachi-red" as={Link} to="/" ><h6>Let's Take You To Home</h6></Button>
            <br/>
            </Col>
        </Container>

    )
}

export default NotFoundError;