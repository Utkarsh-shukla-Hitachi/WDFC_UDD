import React from "react";
import { Container } from "react-bootstrap";
import NavbarComponent from "../navigation/NavbarComponent";
import Footer from "../navigation/Footer";
import "../../App.css";

function DashboardLayout({children}) {

    return(
        <>
            <NavbarComponent />
            <Container fluid className='content-container'>
                {children}
            </Container>
            <Footer />
        </>
            
    );
}

export default DashboardLayout;