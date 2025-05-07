import React from "react";
import Footer from "../navigation/Footer";
import "../../App.css";

function LandingLayout({children}) {

    return(
        <div >
            {children}
            <Footer />
        </div>
            
    );
}

export default LandingLayout;