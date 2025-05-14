import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CustomLoggerService implements LoggerService {
  private readonly isDevelopment: boolean;
  private readonly logDir: string;
  private currentLogFile: string;

  constructor(private readonly configService: ConfigService) {
    this.isDevelopment = this.configService.get('NODE_ENV') === 'development';
    this.logDir = path.join(process.cwd(), 'logs');
    this.ensureLogDirectory();
    this.currentLogFile = this.getLogFilePath();
  }

  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private getLogFilePath(): string {
    const date = new Date().toISOString().split('T')[0];
    return path.join(this.logDir, `app-${date}.log`);
  }

  private writeToFile(message: string): void {
    const logFile = this.getLogFilePath();
    
    // If the date has changed, update the current log file
    if (logFile !== this.currentLogFile) {
      this.currentLogFile = logFile;
    }

    fs.appendFileSync(this.currentLogFile, message + '\n');
  }

  private formatMessage(message: string, context?: string): string {
    const timestamp = new Date().toISOString();
    return context ? `[${timestamp}] [${context}] ${message}` : `[${timestamp}] ${message}`;
  }

  private logToConsole(message: string, color: string): void {
    console.log(`\x1b[${color}m%s\x1b[0m`, message);
  }

  log(message: string, context?: string): void {
    const formattedMessage = this.formatMessage(message, context);
    this.logToConsole(formattedMessage, '32'); // Green
    this.writeToFile(formattedMessage);
  }

  error(message: string, trace?: string, context?: string): void {
    const formattedMessage = this.formatMessage(message, context);
    this.logToConsole(formattedMessage, '31'); // Red
    this.writeToFile(formattedMessage);
    
    if (trace && this.isDevelopment) {
      this.logToConsole(trace, '31'); // Red
      this.writeToFile(trace);
    }
  }

  warn(message: string, context?: string): void {
    const formattedMessage = this.formatMessage(message, context);
    this.logToConsole(formattedMessage, '33'); // Yellow
    this.writeToFile(formattedMessage);
  }

  debug(message: string, context?: string): void {
    if (this.isDevelopment) {
      const formattedMessage = this.formatMessage(message, context);
      this.logToConsole(formattedMessage, '36'); // Cyan
      this.writeToFile(formattedMessage);
    }
  }

  verbose(message: string, context?: string): void {
    if (this.isDevelopment) {
      const formattedMessage = this.formatMessage(message, context);
      this.logToConsole(formattedMessage, '35'); // Magenta
      this.writeToFile(formattedMessage);
    }
  }
} 