import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {
  
  @Output()
  finished: EventEmitter<any> = new EventEmitter<any>();

  @Input() //(1 * 60 * 1000)
  duration: any = (10 * 60 * 1000);

  private subscription: Subscription;
  
  dateNow = new Date();
  dDay: Date;
  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  SecondsInAMinute  = 60;

  timeDifference = 0;
  secondsToDday = 0;
  minutesToDday = 0;
  hoursToDday = 0;
  daysToDday = 0;


  private getTimeDifference () {
    this.timeDifference = this.dDay.getTime() - new  Date().getTime();
    
    if(this.timeDifference > 0) {
      this.allocateTimeUnits(this.timeDifference);
    } else {
      this.finished.emit();
      this.subscription.unsubscribe();
    }
  }

  private allocateTimeUnits (timeDifference) {
    this.secondsToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute);
    this.minutesToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute);
    this.hoursToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay);
    this.daysToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute * this.hoursInADay));
  }

  ngOnInit() {
    this.dDay = new Date(this.dateNow.getTime() + this.duration);
    this.subscription = interval(1000)
        .subscribe(x => {
          this.getTimeDifference();
        });
  }

 ngOnDestroy() {
    this.subscription.unsubscribe();
 }
}
