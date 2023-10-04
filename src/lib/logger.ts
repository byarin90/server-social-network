import chalk from 'chalk'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class Logger {
  private static formatMessage (level: string, message: string, object?: any): string {
    let formattedMessage = `${level}: ${message}`
    if (object) {
      formattedMessage += `\n${chalk.gray(JSON.stringify(object))}`
    }
    return formattedMessage + '\n'
  }

  public static warning (message: string, object?: any): void {
    const level = chalk.yellow('WARNING')
    console.log(this.formatMessage(level, chalk.gray(message), object))
  }

  public static debug (message: string, object?: any): void {
    const level = chalk.blue('DEBUG')
    console.log(this.formatMessage(level, chalk.gray(message), object))
  }

  public static info (message: string, object?: any): void {
    const level = chalk.green('INFO')
    console.log(this.formatMessage(level, chalk.gray(message), object))
  }

  public static error (message: string, object?: any): void {
    const level = chalk.red('ERROR')
    console.log(this.formatMessage(level, chalk.gray(message), object))
  }
}

const logger = Logger

export default logger
