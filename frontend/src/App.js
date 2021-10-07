import "./App.css";
import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Homepage from "./components/Homepage";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" component={Homepage} exact />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
