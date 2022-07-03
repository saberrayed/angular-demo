import { TimeagoClock } from 'ngx-timeago';
import { Observable, interval } from 'rxjs';
 
// ticks every 20s
export class TimeagoClockInterval extends TimeagoClock {
  tick(then: number): Observable<number> {
    return interval(60000);
  }
}