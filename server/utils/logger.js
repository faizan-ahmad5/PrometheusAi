// Simple logger utility (can be replaced with Winston/Pino in production)

const LogLevels = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

const colorCodes = {
  ERROR: "\x1b[31m", // Red
  WARN: "\x1b[33m", // Yellow
  INFO: "\x1b[36m", // Cyan
  DEBUG: "\x1b[90m", // Gray
  RESET: "\x1b[0m", // Reset
};

class Logger {
  constructor(component = "APP") {
    this.component = component;
    this.logLevel = process.env.LOG_LEVEL || "INFO";
  }

  #shouldLog(level) {
    return LogLevels[level] <= LogLevels[this.logLevel];
  }

  #format(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const color = colorCodes[level];
    const reset = colorCodes.RESET;

    let output = `${color}[${timestamp}] [${this.component}] ${level}: ${message}${reset}`;

    if (data) {
      output += `\n${JSON.stringify(data, null, 2)}`;
    }

    return output;
  }

  error(message, data = null) {
    if (this.#shouldLog("ERROR")) {
      console.error(this.#format("ERROR", message, data));
    }
  }

  warn(message, data = null) {
    if (this.#shouldLog("WARN")) {
      console.warn(this.#format("WARN", message, data));
    }
  }

  info(message, data = null) {
    if (this.#shouldLog("INFO")) {
      console.log(this.#format("INFO", message, data));
    }
  }

  debug(message, data = null) {
    if (this.#shouldLog("DEBUG")) {
      console.log(this.#format("DEBUG", message, data));
    }
  }
}

// Create loggers for different components
export const createLogger = (component) => new Logger(component);

export default {
  createLogger,
  LogLevels,
};
