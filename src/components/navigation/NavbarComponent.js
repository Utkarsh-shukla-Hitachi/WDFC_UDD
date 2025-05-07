import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavLink, Container, Button } from 'react-bootstrap';

import "./css/NavbarComponent.css";
import { useLocation } from "react-router-dom";

//placeholder for avatar
import avatar from "../../assets/avatar.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDisplay, faWrench, faFileLines, faBrain,faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons'
import Image from 'react-bootstrap/Image'
import hitachiLogoLight from "../../assets/logo-hitachi-light.png";
import hitachiLogoDark from "../../assets/logo-hitachi-dark.png";


import { useKeycloak } from "@react-keycloak/web";

import { NavDropdown } from "react-bootstrap";

import dfccilLogoLight from "../../assets/logo-dfccil-light.png";
import dfccilLogoDark from "../../assets/logo-dfccil-dark.png";

import { Row, Col } from "react-bootstrap";
import { GlobalStates } from "../../helpers/GlobalStates";

function NavbarComponent() {

  const location = useLocation();

  const { keycloak } = useKeycloak();

  const [activePage, setActivePage] = React.useState("work");
  const {appConfig,theme} = useContext(GlobalStates);

  const [hitachiLogo, setHitachiLogo] = React.useState(hitachiLogoLight);
  const [dfccilLogo, setDfccilLogo] = React.useState(dfccilLogoLight);

  useEffect(() => {
    setHitachiLogo(theme.currentTheme === "dark" ? hitachiLogoLight : hitachiLogoDark);
    setDfccilLogo(theme.currentTheme === "dark" ? dfccilLogoLight : dfccilLogoDark);
  }, [theme.currentTheme]);






  useEffect(() => {
    setActivePage(location.pathname.split("/")[1]);
  }, [location.pathname]);

  return (
    <Navbar className="bg-body-primary navbar-container "  >

      <Row className="navbar-row g-0">
        <Col xs={2} className="navbar-column left">
          <Nav>

            <Navbar.Brand className="navbar-brand"><Image src={hitachiLogo} alt="logo" className="navbar-logo-hitachi" />
              <span className="navbar-separator">|</span>
              <Image src={dfccilLogo} alt="logo" className="navbar-logo-dfccil" />
              {/* <span className="navbar-brand-text">Dedicated Freight Corridor</span> */}
            </Navbar.Brand>
          </Nav>
        </Col>
        <Col xs={7} className="navbar-column">

          <Nav className=" navbar-links" >
            <NavLink
              className={`navlink ${activePage === "work" || activePage === "" ? "active" : ""}`}
              onClick={() => setActivePage("work")}
              as={Link}
              to="/work"

            >
              <FontAwesomeIcon icon={faDisplay} className="navlink-icon" />

              <span>Work Management</span>


            </NavLink>
            <NavLink
              className={`navlink ${activePage === "asset" ? "active" : ""}`}
              onClick={() => setActivePage("asset")}
              as={Link}
              to="/asset"
            >
              <FontAwesomeIcon icon={faWrench} className="navlink-icon" />
              <span>Asset Management</span>
            </NavLink>
            <NavLink
              className={`navlink ${activePage === "inventory" ? "active" : ""}`}
              onClick={() => setActivePage("inventory")}
              as={Link}
              to="/inventory"
            >
              <FontAwesomeIcon icon={faFileLines} className="navlink-icon" />
              <span>Inventory Management</span>
            </NavLink>
            <NavLink
              className={`navlink ${activePage === "intelligent" ? "active" : ""}`}
              onClick={() => setActivePage("intelligent")}
              as={Link}
              to="/intelligent"
            >
              <FontAwesomeIcon icon={faBrain} className="navlink-icon" />
              <span>Intelligent Monitoring</span>
            </NavLink>

          </Nav>

        </Col>
        <Col xs={3} className="navbar-column right">
{ appConfig?.THEMING_ENABLED === true &&
        <Button variant="outline-*" className="theme-toggle" onClick={() => theme.setCurrentTheme(theme.currentTheme === "dark" ? "light" : "dark")}>
            <FontAwesomeIcon icon={faCircleHalfStroke} className="theme-toggle-icon" />
          </Button>    }       

            <NavDropdown
              title={
                <div className="d-inline">
                  <Image
                    src={avatar}
                    className="avatar"
                    roundedCircle
                  />

                  {/* <span className="username">{keycloak.tokenParsed.name}</span>  */}
                  {/* keycloak.tokenParsed.preferred_username */}
                </div>
              }
              id="dropdown-menu-drop-left"
              className="user-dropdown"
              //only spawn on left
              align={{ xs: 'start' }}

            >
              <NavDropdown.Item href={appConfig?.EAM_URL} target="_blank">
                Open EAM
              </NavDropdown.Item>
              <NavDropdown.Item href={appConfig?.IRMS_URL} target="_blank">
                Open IRMS
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => keycloak.logout()}
              >
                Logout
              </NavDropdown.Item>
            </NavDropdown>

        </Col>
      </Row>
    </Navbar>
  );
}
export default NavbarComponent;