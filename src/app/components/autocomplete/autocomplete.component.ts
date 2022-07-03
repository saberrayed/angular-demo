import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DoctorService } from 'src/app/utils/services/doctor/doctor.service';
import { HospitalMastersService } from 'src/app/utils/services/doctor/hospital-masters.service';
import { HospitalService } from 'src/app/utils/services/doctor/hospital.service';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnInit {
  
  @Output() search: EventEmitter<any> = new EventEmitter<any>();

  @Output() clear: EventEmitter<any> = new EventEmitter<any>();

  @Output() select: EventEmitter<any> = new EventEmitter<any>();

  @Output() unselect: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  results: any;

  @Input()
  field: any;

  @Input()
  selectedResult: any;

  @Input()
  isMultiple = true;

  @Input()
  forceSelection = true;

  @Input()
  placeholder = 'Enter description';

  constructor() {}

  ngOnInit(): void {}

  onSearch(obj) {
    this.search.emit(obj.query);
  }

  onClear(item) {
    this.clear.emit(item);
  }

  onUnselect(item) {
    this.unselect.emit(item);
  }

  onSelect(item) {
    this.select.emit(item);
  }
}
