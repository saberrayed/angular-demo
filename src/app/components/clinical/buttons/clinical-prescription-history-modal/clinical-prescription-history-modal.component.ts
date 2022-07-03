import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FormService } from 'src/app/utils/services/forms/forms.service';
import { MedicalHistoryService } from 'src/app/utils/services/mpi/medical-history.service';

@Component({
  selector: 'app-clinical-prescription-history-modal',
  templateUrl: './clinical-prescription-history-modal.component.html',
  styleUrls: ['./clinical-prescription-history-modal.component.scss']
})
export class ClinicalPrescriptionHistoryModalComponent implements OnInit {

  @Output()
  return: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  patientID: any;

  @Input()
  document: any;

  @Input()
  form: FormGroup;

  @Input()
  formValidator: FormGroup;

  modal = false;
  identifier: any;

  processing = true;
  items: any;

  page = 1;
  perPage = 10;

  selectAll = false;

  constructor(
    private service: MedicalHistoryService,
    private formService: FormService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
  }

  onOpen(name) {
    this.modal = true;
    this.identifier = name;
    this.selectAll = false;
    this.list();
  }

  list(page = 1) {
    this.processing = true;
    this.formService.getPatientPrescriptions(this.patientID, {
      page: this.page = page,
      perPage: this.perPage,
      sort: 'desc',
      excluded: this.document?.id,
      patient_id: this.patientID
    })
    .subscribe((response: any) => {
      this.items = response;
      this.processing = false;
    }, (err) => {
      this.processing = false;
    })
  }

  getSelected() {
    return this.items?.data?.filter((item) => item?.selected);
  }

  toggleSelectAll() {
    this.items?.data?.forEach((item) => {
      item.selected = this.selectAll;
    });
  }

  toggleSelection() {
    this.selectAll = false;

    this.items?.data?.forEach((item) => {
      if(item?.selected) {
        this.selectAll = true;
      }
    });
  }

  copy() {

    const arr = (this.form.get(this.identifier) as FormArray);

    // Remove last instance if empty
    if(arr?.value?.length > 0) {
      const last = arr?.at(arr?.length - 1);
      let hasValue = false;

      Object.keys(last?.value).forEach((key) => {
        if(last?.value[key]) {
          hasValue = true;
        }
      });

      if(!hasValue) {
        arr?.removeAt(arr?.length - 1);
      }
    }

    this.getSelected()?.forEach((item) => {
      return arr?.push(
        this.fb.group({
          e_prescription_section_brand_name: [item?.brand_name, this.formValidator['e_prescription_section_brand_name']],
          e_prescription_section_generic_name: [item?.generic_name, this.formValidator['e_prescription_section_generic_name']],
          e_prescription_section_quantity: [item?.quantity, this.formValidator['e_prescription_section_quantity']],
          e_prescription_section_signa: [item?.signa, this.formValidator['e_prescription_section_signa']],
          e_prescription_section_start_on: [item?.start_on, this.formValidator['e_prescription_section_start_on']],
          e_prescription_section_strength_dosage_form: [item?.strength_dosage_form, this.formValidator['e_prescription_section_strength_dosage_form']]
        })
      )
    });

    this.onClose();
    this.toastr.success(`Successfully copied ${this.getSelected()?.length} medication/s`);
  }

  onClose() {
    this.modal = false
  }
}
