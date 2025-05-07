import Keycloak from "keycloak-js";
// const keycloak = new Keycloak({
//  url: "http://localhost:8080/",
//  realm: "react",
//  clientId: "react-auth",
// });
const keycloak = new Keycloak({
  url: "https://10.130.254.90:8443/",
  realm: "WDFC",
  clientId: "UDD",
});

export default keycloak;
