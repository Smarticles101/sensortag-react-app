import React, { Component } from "react";
import Sensortag from "./components/wrapper/Sensortag";
import DataController from "./components/DataController";
import "./App.css";

class App extends Component {
  state = {};

  render() {
    return (
      <div className="App">
        <Sensortag>
          <DataController />
        </Sensortag>
      </div>
    );
  }
}

export default App;
