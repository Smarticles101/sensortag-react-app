import React, { Component } from "react";

export default class DataController extends Component {
  state = {
    barometer: {
      temp: 0,
      pressure: 0
    }
  };
  connect = () =>
    this.props.connect().then(() => {
      this.props.subscribeToBarometerData(barometer =>
        this.setState({ barometer })
      );
    });

  render() {
    return (
      <>
        {!this.props.connected ? (
          <button onClick={this.connect}>Connect!</button>
        ) : (
          <div>
            temp: {this.state.barometer.temp}
            <br />
            pressure: {this.state.barometer.pressure}
          </div>
        )}
      </>
    );
  }
}
