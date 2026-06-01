/**
 * Utilitário de Logging
 * 
 * Centraliza todos os logs da aplicação
 * Facilita debug em desenvolvimento e monitoramento em produção
 */

enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export class Logger {
  private static formatTimestamp(): string {
    return new Date().toISOString();
  }

  private static format(
    level: LogLevel,
    module: string,
    message: string,
    data?: any
  ): string {
    let log = `[${this.formatTimestamp()}] [${level}] [${module}] ${message}`;
    if (data) {
      log += ` ${JSON.stringify(data)}`;
    }
    return log;
  }

  static debug(module: string, message: string, data?: any): void {
    console.log(this.format(LogLevel.DEBUG, module, message, data));
  }

  static info(module: string, message: string, data?: any): void {
    console.log(this.format(LogLevel.INFO, module, message, data));
  }

  static warn(module: string, message: string, data?: any): void {
    console.warn(this.format(LogLevel.WARN, module, message, data));
  }

  static error(module: string, message: string, error?: any): void {
    console.error(
      this.format(
        LogLevel.ERROR,
        module,
        message,
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : error
      )
    );
  }
}

export default Logger;
