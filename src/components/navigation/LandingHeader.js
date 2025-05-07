import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavLink, Container, Button } from 'react-bootstrap';

import "./css/NavbarComponent.css";

//placeholder for avatar
import avatar from "../../assets/avatar.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDisplay, faWrench, faFileLines, faBrain } from '@fortawesome/free-solid-svg-icons'
import Image from 'react-bootstrap/Image'
import hitachiLogo from "../../assets/logo-hitachi-dark.png";

import { useKeycloak } from "@react-keycloak/web";

import { NavDropdown } from "react-bootstrap";

import dfccilLogo from "../../assets/logo-dfccil-dark.png";


function LandingHeader() {


  

  return (
    <Navbar className="bg-body-primary navbar" >

      <Container fluid className="navbar-container">
        <Nav>
        <Navbar.Brand className="navbar-brand"><Image src={hitachiLogo} alt="logo" className="navbar-logo-hitachi" />
          <span className="navbar-separator">|</span>
          <Image src={dfccilLogo} alt="logo" className="navbar-logo-dfccil" />
          <span className="navbar-brand-text">Dedicated Freight Corridor</span>
          </Navbar.Brand>
          </Nav>
        
       
      </Container>
    </Navbar>
  );
}
export default LandingHeader;