import { Injectable, OnModuleInit } from '@nestjs/common';
import { Subject, Observable, interval } from 'rxjs';
import { CustomLoggerService } from '../../logger/logger.service';

interface RequestEvent {
  accessKey: string;
  timestamp: Date;
}

@Injectable()
export class RequestTrackerService implements OnModuleInit {
  private requestStream = new Subject<RequestEvent>();
  private requestMap = new Map<string, Date[]>();

  constructor(private readonly logger: CustomLoggerService) {}

  onModuleInit() {
    // Subscribe to request events
    this.requestStream.subscribe(event => {
      this.addRequest(event.accessKey, event.timestamp);
    });

    // Clean up old requests every minute
    interval(60000).subscribe(() => {
      this.cleanupOldRequests();
    });
  }

  private addRequest(accessKey: string, timestamp: Date) {
    const requests = this.requestMap.get(accessKey) || [];
    requests.push(timestamp);
    this.requestMap.set(accessKey, requests);
  }

  private cleanupOldRequests() {
    const oneMinuteAgo = new Date(Date.now() - 60000);
    
    for (const [accessKey, requests] of this.requestMap.entries()) {
      const recentRequests = requests.filter(time => time > oneMinuteAgo);
      if (recentRequests.length === 0) {
        this.requestMap.delete(accessKey);
      } else {
        this.requestMap.set(accessKey, recentRequests);
      }
    }
  }

  trackRequest(accessKey: string) {
    this.requestStream.next({
      accessKey,
      timestamp: new Date()
    });
  }

  getRequestCount(accessKey: string): number {
    const oneMinuteAgo = new Date(Date.now() - 60000);
    const requests = this.requestMap.get(accessKey) || [];
    return requests.filter(time => time > oneMinuteAgo).length;
  }

  getRequestStream(): Observable<RequestEvent> {
    return this.requestStream.asObservable();
  }
} 