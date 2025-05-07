import { useKeycloak } from "@react-keycloak/web";
import { redirect } from "react-router-dom";

const PrivateRoute = ({ children ,redirectto}) => {
 const { keycloak ,initialized} = useKeycloak();
 
    if (!initialized) {
      // return children;
      return <div className="app-text-secondary">Loading...</div>;
    }

 const isLoggedIn = keycloak.authenticated;
 

    if (isLoggedIn) return children;

    keycloak.login();
    redirect(redirectto);
};

export default PrivateRoute;