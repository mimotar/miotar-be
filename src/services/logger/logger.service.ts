import { ConsoleLogger, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { promises as fsPromises } from 'fs';
import * as path from 'path';

@Injectable()
export class LoggerService extends ConsoleLogger {
  async log(message: any, context?: string) {
    const entry = `${context}\t${JSON.stringify(message)}`;
    await this.logToFile(entry);
    super.log(message, context);
  }

  async error(message: any, stackOrContext?: string) {
    const entry = `${stackOrContext}\t${JSON.stringify(message)}`;
    await this.logToFile(entry);
    super.log(message, stackOrContext);
  }

  async logToFile(entry: any) {
    const formattedEntry = `${Intl.DateTimeFormat('en-US', {
      dateStyle: 'short',
      timeStyle: 'short',
      timeZone: 'Europe/London',
    }).format(new Date())}\t${entry}\n`;

    try {
      if (!fs.existsSync(path.join(__dirname, '..', '..', 'logs'))) {
        await fsPromises.mkdir(path.join(__dirname, '..', '..', 'logs'));
      }
      await fsPromises.appendFile(
        path.join(__dirname, '..', '..', 'logs', 'app.log'),
        formattedEntry,
      );
    } catch (e) {
      if (e instanceof Error) console.error(e.message);
    }
  }
}
