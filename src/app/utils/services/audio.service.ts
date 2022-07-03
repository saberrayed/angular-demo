import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  constructor() {}

  notify() {
    const sound = new Audio('assets/sounds/notifications/sound-2.mp3');
    return sound.play();
  }

  newAppointment() {
    const sound = new Audio('assets/sounds/notifications/sound-5.mp3');
    return sound.play();
  }

  ringInstance(isLoop = false): HTMLAudioElement {
    const sound = new Audio('assets/sounds/ringing.mp3');
    sound.volume = 0.1;
    sound.loop = isLoop;

    sound.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
    });

    return sound;
  }
  
  endCallInstance(isLoop = false): HTMLAudioElement {
    const sound = new Audio('assets/sounds/end.mp3');
    sound.volume = 0.1;
    return sound;
  }
}
