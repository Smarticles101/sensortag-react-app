import React, { Component } from "react";
import * as services from "./services";

export default class Sensortag extends Component {
  state = {
    connected: false,
    server: null
  };

  enableService = serviceObj =>
    this.server
      .getPrimaryService(serviceObj.uuid)
      .then(service => service.getCharacteristic(serviceObj.configuration))
      .then(characteristic =>
        serviceObj.name !== "movement"
          ? characteristic.writeValue(Uint8Array.of(1))
          : characteristic.writeValue(Uint16Array.of(0x007f))
      )
      .then(() => console.log(`enabled ${serviceObj.name}`));

  readCharacteristic = (serviceObj, characteristic) =>
    this.server
      .getPrimaryService(serviceObj.uuid)
      .then(service => service.getCharacteristic(serviceObj[characteristic]))
      .then(characteristic => characteristic.startNotifications());

  subscribeTo = (serviceObj, characteristicId, callback) =>
    this.readCharacteristic(serviceObj, characteristicId).then(
      characteristic => {
        characteristic.addEventListener("characteristicvaluechanged", evt => {
          var value = evt.target.value;

          callback(value);
        });
      }
    );

  subscribeToBarometerData = callback =>
    this.subscribeTo(services.barometer, "data", value =>
      callback({
        temp: (value.getUint32(0, true) & 0x00ffffff) / 100,
        pressure: ((value.getUint32(2, true) >> 8) & 0x00ffffff) / 100
      })
    );

  subscribeToHumidityData = callback =>
    this.subscribeTo(services.humidity, "data", value =>
      callback({
        temp: (value.getUint16(0, true) / 65536) * 165 - 40,
        humidity: ((value.getUint16(2, true) & ~0x0003) / 65536) * 100
      })
    );

  subscribeToInfaredData = callback =>
    this.subscribeTo(services.infared, "data", value =>
      callback({
        objectTemp: (value.getUint16(0, true) >> 2) * 0.03125,
        ambientTemp: (value.getUint16(2, true) >> 2) * 0.03125
      })
    );

  subscribeToOpticalData = callback =>
    this.subscribeTo(services.optical, "data", value => {
      var m = value.getUint16(0, true) & 0x0fff;
      var e = (value.getUint16(0, true) & 0xf000) >> 12;

      e = e === 0 ? 1 : 2 << (e - 1);

      callback({
        lux: m * (0.01 * e)
      });
    });

  subscribeToMovementData = callback =>
    this.subscribeTo(services.movement, "data", value =>
      callback({
        gyroX: value.getInt16(0, true) / (65536 / 500),
        gyroY: value.getInt16(2, true) / (65536 / 500),
        gyroZ: value.getInt16(4, true) / (65536 / 500),
        accX: value.getInt16(6, true) / (65536 / 500),
        accY: value.getInt16(8, true) / (65536 / 500),
        accZ: value.getInt16(10, true) / (65536 / 500),
        magX: (value.getInt16(12, true) * 4912.0) / 32768.0,
        magY: (value.getInt16(14, true) * 4912.0) / 32768.0,
        magZ: (value.getInt16(16, true) * 4912.0) / 32768.0
      })
    );

  connect = async () => {
    let device = await navigator.bluetooth.requestDevice({
      filters: [
        {
          name: "CC2650 SensorTag"
        }
      ],
      optionalServices: [
        services.humidity.uuid,
        services.barometer.uuid,
        services.infared.uuid,
        services.optical.uuid,
        services.movement.uuid
      ]
    });

    this.server = await device.gatt.connect();

    await this.enableService(services.infared);
    await this.enableService(services.barometer);
    await this.enableService(services.humidity);
    await this.enableService(services.optical);
    await this.enableService(services.movement);

    this.setState({ connected: true, server: this.server });
  };

  render() {
    return React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        connect: this.connect,
        enableService: this.enableService,
        readCharacteristic: this.readCharacteristic,
        server: this.state.server,
        connected: this.state.connected,
        subscribeToBarometerData: this.subscribeToBarometerData,
        subscribeToHumidityData: this.subscribeToHumidityData,
        subscribeToInfaredData: this.subscribeToInfaredData,
        subscribeToMovementData: this.subscribeToMovementData,
        subscribeToOpticalData: this.subscribeToOpticalData
      })
    );
  }
}
