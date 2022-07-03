import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MedicalHistoryService } from 'src/app/utils/services/mpi/medical-history.service';
import { AllergiesComponent } from '../../medical-history/allergies/allergies.component';

@Component({
  selector: 'app-allergy-modal',
  templateUrl: './allergy-modal.component.html',
  styleUrls: ['./allergy-modal.component.scss']
})
export class AllergyModalComponent implements OnInit {

  @Output()
  reschedule: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('allergy', {static: true})
  allergyComponent: AllergiesComponent;

  @Input()
  patientID: any;

  modal = false;
  processing = false;

  constructor(
    private service: MedicalHistoryService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
  }

  onOpen() {
    this.processing = false;
    this.allergyComponent.editMode = true;
    this.allergyComponent.modal = true;
    this.modal = true;
  }

  onClose() {
    this.modal = false;
  }
}
