class Logger {
  log(level, message) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] [${level}] ${message}`);
  }
}

export default Logger;