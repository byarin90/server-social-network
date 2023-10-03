import chalk from 'chalk'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class Logger {
  private static formatMessage (level: string, message: string, object?: any): string {
    let formattedMessage = `${level}: ${message}`
    if (object) {
      formattedMessage += ` ${JSON.stringify(object)}`
    }
    return formattedMessage
  }

  public static warning (message: string, object?: any): void {
    const level = chalk.bold.yellow('WARNING')
    console.log(this.formatMessage(level, message, object))
  }

  public static debug (message: string, object?: any): void {
    const level = chalk.bold.blue('DEBUG')
    console.log(this.formatMessage(level, chalk.blue(message), object))
  }

  public static info (message: string, object?: any): void {
    const level = chalk.bold.green('INFO')
    console.log(this.formatMessage(level, message, object))
  }

  public static error (message: string, object?: any): void {
    const level = chalk.bold.red('ERROR')
    console.log(this.formatMessage(level, message, object))
  }
}

export default Logger
