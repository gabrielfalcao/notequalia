import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";

import "bootswatch/dist/litera/bootstrap.min.css";
import "font-awesome/css/font-awesome.css";
//import "bootswatch/dist/minty/bootstrap.min.css";
//import "bootswatch/dist/journal/bootstrap.min.css";
//import "bootswatch/dist/cosmo/bootstrap.min.css";
//import "bootswatch/dist/sandstone/bootstrap.min.css";
//import "bootswatch/dist/lux/bootstrap.min.css";
import store from "./store";

ReactDOM.render(
    <Provider store={store}>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </Provider>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
