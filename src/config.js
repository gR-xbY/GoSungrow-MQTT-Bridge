import fs from 'fs';
import dotenv from 'dotenv';

class Config {
  constructor() {
    this.commands = this.loadCommands();
    this.options = this.loadOptions();
  }

  loadCommands() {
    return JSON.parse(fs.readFileSync('api.json', 'utf8'));
  }

  loadOptions() {
    dotenv.config();

    return {
      mqttBrokerUrl: process.env.MQTT_BROKER,
      mqttBrokerOptions: {
        username: process.env.MQTT_USERNAME,
        password: process.env.MQTT_PASSWORD,
        clientId: process.env.MQTT_CLIENT_ID || 'Sungrow',
        connectTimeout: parseInt(process.env.CONNECT_TIMEOUT) || 10 * 1000,
        reconnectPeriod: parseInt(process.env.RECONNECT_PERIOD) || 60 * 1000,
      },
      mqttTopic: process.env.MQTT_TOPIC || 'sungrow/gR-xbY',
      sungrowPsId: process.env.SUNGROW_PS_ID,
      fetchInterval: parseInt(process.env.FETCH_INTERVAL) || 60000,
      startHour: parseInt(process.env.APP_START_HOUR) || 0,
      endHour: parseInt(process.env.APP_END_HOUR) || 24,
    };
  }
}

export default Config;