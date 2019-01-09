import React, { Component } from 'react';
import './App.css';

const infaredTempService = {
  name: 'infared',
  uuid: 'f000aa00-0451-4000-b000-000000000000',
  data: 'f000aa01-0451-4000-b000-000000000000',
  notification: '00002902-0000-1000-8000-00805f9b34fb',
  configuration: 'f000aa02-0451-4000-b000-000000000000',
  period: 'f000aa03-0451-4000-b000-000000000000',
}

const humidityService = {
  name: 'humidity',
  uuid: 'f000aa20-0451-4000-b000-000000000000',
  data: 'f000aa21-0451-4000-b000-000000000000',
  notification: '00002902-0000-1000-8000-00805f9b34fb',
  configuration: 'f000aa22-0451-4000-b000-000000000000',
  period: 'f000aa23-0451-4000-b000-000000000000',
}

const barometerService = {
  name: 'barometer',
  uuid: 'f000aa40-0451-4000-b000-000000000000',
  data: 'f000aa41-0451-4000-b000-000000000000',
  notification: '00002902-0000-1000-8000-00805f9b34fb',
  configuration: 'f000aa42-0451-4000-b000-000000000000',
  period: 'f000aa44-0451-4000-b000-000000000000',
}

const opticalService = {
  name: 'optical',
  uuid: 'f000aa70-0451-4000-b000-000000000000',
  data: 'f000aa71-0451-4000-b000-000000000000',
  notification: '00002902-0000-1000-8000-00805f9b34fb',
  configuration: 'f000aa72-0451-4000-b000-000000000000',
  period: 'f000aa73-0451-4000-b000-000000000000',
}

class App extends Component {

  state = {}

  enableService = (serviceObj) => 
    this.server.getPrimaryService(serviceObj.uuid)
      .then(service => service.getCharacteristic(serviceObj.configuration))
      .then(characteristic => characteristic.writeValue(Uint8Array.of(1)))
      .then(() => console.log(`enabled ${serviceObj.name}`))

  readCharacteristic = (serviceObj, characteristic) => 
    this.server.getPrimaryService(serviceObj.uuid)
      .then(service => service.getCharacteristic(serviceObj[characteristic]))
      .then(characteristic => characteristic.startNotifications())

  render() {
    return (
      <div className="App">
        <header className="App-header">

          {Object.keys(this.state).map(key => 
            <div>
              <h3>{key}</h3>
              {Object.keys(this.state[key]).map(k => 
                <p>{k} : {this.state[key][k]}</p>
              )}
            </div>
          )}

          <button onClick={() => {
            navigator.bluetooth.requestDevice({ 
              acceptAllDevices: true, 
              optionalServices: [
                humidityService.uuid,
                barometerService.uuid,
                infaredTempService.uuid,
                opticalService.uuid,
              ] 
            })
            .then(device => device.gatt.connect())
            .then(server => this.server = server)
            .then(() => {
              this.enableService(infaredTempService)
              this.enableService(barometerService)
              this.enableService(humidityService)
              this.enableService(opticalService)
            })
          }}>connect!</button>

          <button
            onClick={() => {
              this.readCharacteristic(infaredTempService, 'data')
              .then(characteristic => {
                characteristic.addEventListener('characteristicvaluechanged',
                evt => {
                  var value = evt.target.value
                  const SCALE_LSB = 0.03125
                  
                  this.setState({ infared: {
                    objectTemp: (value.getUint16(0, true) >> 2) * SCALE_LSB,
                    ambientTemp: (value.getUint16(2, true) >> 2) * SCALE_LSB
                  }})
                });
              })
            }}
          >
            read infared
          </button>

          <button
            onClick={() => {
              this.readCharacteristic(humidityService, 'data')
              .then(characteristic => {
                characteristic.addEventListener('characteristicvaluechanged',
                evt => {
                  var value = evt.target.value
                  
                  this.setState({ humidity: {
                    temp: (value.getUint16(0, true) / 65536) * 165 - 40,
                    humidity: ((value.getUint16(2, true) & ~0x0003) / 65536) * 100
                  }})
                });
              })
            }}
          >
            read humidity sensor
          </button>

          <button
            onClick={() => {
              this.readCharacteristic(barometerService, 'data')
              .then(characteristic => {
                characteristic.addEventListener('characteristicvaluechanged',
                evt => {
                  var value = evt.target.value
                  
                  this.setState({ barometer: {
                    temp: (value.getUint32(0, true) & 0x00ffffff) / 100,
                    pressure: ((value.getUint32(2, true) >> 8) & 0x00ffffff) / 100
                  }})
                });
              })
            }}
          >
            read barometer
          </button>

          <button
            onClick={() => {
              this.readCharacteristic(opticalService, 'data')
              .then(characteristic => {
                characteristic.addEventListener('characteristicvaluechanged',
                evt => {
                  var value = evt.target.value
                  var m = value.getUint16(0, true) & 0x0FFF
                  var e = (value.getUint16(0, true) & 0xF000) >> 12
  
                  e = (e === 0) ? 1 : 2 << (e - 1)
  
                  this.setState({ optical: { lux: m * (0.01 * e)} })
                });
              })
            }}
          >
            read optical
          </button>
        </header>
      </div>
    );
  }
}

export default App;
