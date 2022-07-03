import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {

  @Output()
  agree: EventEmitter<any> = new EventEmitter<any>();

  userAgree = false;
  
  constructor() { }

  ngOnInit(): void {
  }

  agreeTerms() {
    this.agree.emit();
  }
}
