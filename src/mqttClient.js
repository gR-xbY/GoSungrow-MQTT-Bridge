import mqtt from 'mqtt';

class MQTTClient {
  constructor(config, logger) {
    this.config = config;
    this.logger = logger;
    this.client = this.connect();
  }

  connect() {
    const client = mqtt.connect(this.config.options.mqttBrokerUrl, this.config.options.mqttBrokerOptions);
    
    client.on('connect', () => {
      this.logger.log('SUCCESS', 'Connected to MQTT Broker');
    });
    client.on('error', (err) => {
      this.logger.log('ERROR', `MQTT connection error: ${err.message}`);
    });
    client.on('reconnect', () => {
      this.logger.log('INFO', 'Attempting to reconnect to MQTT broker...');
    });
    client.on('offline', () => {
      this.logger.log('WARN', 'MQTT client is offline');
    });
    client.on('close', () => {
      this.logger.log('WARN', 'MQTT broker connection closed');
    });
    client.on('end', () => {
      this.logger.log('INFO', 'MQTT client disconnected');
    });
    return client;
  }

  publish(topic, message) {
    this.client.publish(topic, message, () => {
      this.logger.log('SUCCESS',  `Data published to MQTT topic "${topic}"`);
    });
  }
}

export default MQTTClient;
