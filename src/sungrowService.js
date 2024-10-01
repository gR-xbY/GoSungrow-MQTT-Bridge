import Config from './config.js';
import Logger from './logger.js';
import CommandExecutor from './commandExecutor.js';
import MQTTClient from './mqttClient.js';

class SungrowApplication {
  constructor() {
    this.config = new Config();
    this.logger = new Logger();
    this.commandExecutor = new CommandExecutor(this.logger);
    this.mqttClient = new MQTTClient(this.config, this.logger);
    this.startCommandCycle();
  }

  isWithinAllowedTime() {
    const currentHour = new Date().getHours();
    return currentHour >= this.config.options.startHour && currentHour < this.config.options.endHour;
  }

  async processCommand(command) {
    try {
      const output = await this.commandExecutor.execute(`GoSungrow api get ${command.endpoint} '{"ps_id":"${this.config.options.sungrowPsId}"}'`);
      const data = JSON.parse(output);
      const filteredOutput = command.filter ? command.filter.reduce((acc, prop) => {
        if (data[prop]) acc[prop] = data[prop];
        return acc;
      }, {}) : data;

      const payload = JSON.stringify(filteredOutput);
      this.logger.log('INFO', `${command.endpoint}: ${payload}`);
      this.mqttClient.publish(`${this.config.options.mqttTopic}/${command.topic ?? command.endpoint}`, payload);
    } catch (error) {
      this.logger.log('ERROR', `Error during processCommand: ${error.message}`);
    }
  }

  async startCommandCycle() {
    this.logger.log('INFO', 'Starting command cycle');

    const doCycle = async () => {
      if (!this.isWithinAllowedTime()) {
        this.logger.log('WARNING', 'Outside allowed time. Cycle will be postponed');
        return;
      }

      for (const command of this.config.commands) {
        await this.processCommand(command);
      }
    };

    await doCycle();

    this.logger.log('INFO', `Next execution: ${new Date(Date.now() + this.config.options.fetchInterval).toLocaleString()}`)
    setInterval(doCycle, this.config.options.fetchInterval);
  }
}

export default SungrowApplication;
