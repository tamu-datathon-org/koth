import React from "react";
import { AppProps } from "next/app";
import { UserProvider } from "../components/UserProvider";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css"; // Import the CSS
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar } from "../components/Navbar";

const App = ({ Component, pageProps }: AppProps): React.ReactElement => {
  return (
    <UserProvider>
      <>
        <Navbar />
        <Component {...pageProps} />
      </>
    </UserProvider>
  );
};

export default App;
