import React, { Component } from "react";
import { Line as LineChart } from "react-chartjs-2";

export default class DataController extends Component {
  state = {
    temp: {
      labels: [],
      datasets: [
        {
          label: "Temp",
          data: [],
          backgroundColor: "rgba(75,192,192,0.4)"
        }
      ]
    },
    pressure: {
      labels: [],
      datasets: [
        {
          label: "Pressure",
          data: [],
          backgroundColor: "rgba(75,192,192,0.4)"
        }
      ]
    }
  };
  connect = () =>
    this.props.connect().then(() => {
      this.props.subscribeToBarometerData(barometer => {
        let date = new Date();
        this.setState({
          temp: {
            labels: [
              ...this.state.temp.labels,
              `${date.getMinutes()}:${date.getSeconds()}`
            ],
            datasets: [
              {
                ...this.state.temp.datasets[0],
                data: [...this.state.temp.datasets[0].data, barometer.temp]
              }
            ]
          },
          pressure: {
            labels: [
              ...this.state.pressure.labels,
              `${date.getMinutes()}:${date.getSeconds()}`
            ],
            datasets: [
              {
                ...this.state.pressure.datasets[0],
                data: [
                  ...this.state.pressure.datasets[0].data,
                  barometer.pressure
                ]
              }
            ]
          }
        });
      });
    });

  render() {
    return (
      <>
        {!this.props.connected ? (
          <button onClick={this.connect}>Connect!</button>
        ) : (
          <div>
            <LineChart data={this.state.temp} />
            <LineChart data={this.state.pressure} />
          </div>
        )}
      </>
    );
  }
}
