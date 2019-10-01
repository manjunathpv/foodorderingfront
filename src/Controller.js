import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./screens/home/Home";
// import Profile from "./screens/profile/Profile";
import Details from "./screens/details/Details";
// import Checkout from "./screens/checkout/Checkout";


class Controller extends Component {

    constructor() {
        super();
        this.baseUrl = "http://localhost:8080/api";
    }

    render() {
        return(
            <Router>
                <div className="main-container">
                  <Route exact path='/' render={(props) => <Home {...props} />} />
                  <Route path='/restaurant/:id' render={(props) => <Details {...props} />} />
                  {/* <Route path='/checkout' render={(props) => <Checkout {...props} />} /> */}
                  {/* <Route path='/profile' render={(props) => <Profile {...props} />} /> */}
                </div>
            </Router>
        )
    }
}

export default Controller;