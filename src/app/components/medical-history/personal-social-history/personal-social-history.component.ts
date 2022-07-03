import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MedicalHistoryService } from 'src/app/utils/services/mpi/medical-history.service';

@Component({
  selector: 'app-personal-social-history',
  templateUrl: './personal-social-history.component.html',
  styleUrls: ['./personal-social-history.component.scss']
})
export class PersonalSocialHistoryComponent implements OnInit {

  @Input()
  patientID: any;

  editMode = false;
  processing = true;
  item: any;
  form: FormGroup;

  constructor(
    private service: MedicalHistoryService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.get();
  }

  createForm(item = null) {
    this.form = this.fb.group({
      id: [item?.id],
      smoking: [item?.smoking || 0 ],
      sticks_day: [item?.sticks_day],
      years_of_smoking: [item?.years_of_smoking],
      pack_years: [item?.pack_years],
      alcohol: [item?.alcohol],
      drugs: [item?.drugs],
      diet: [item?.diet],
      physical_activity: [item?.physical_activity],
      remarks: [item?.remarks],
    });
  }

  reset(name) {
    this.form.get(name).reset();
  }

  updatePackYears() {
    this.form.patchValue({
      pack_years: (this.form.value?.sticks_day/20) * this.form.value?.years_of_smoking
    })
  }

  get() {
    this.service.getSocialHistory(this.patientID)
    .subscribe((response: any) => {
      this.createForm(this.item = response);
      this.processing = false;
    }, (err) => {
      this.processing = false;
    })
  }

  save() {
    this.processing = true;
    this.service.saveSocialHistory(this.patientID, this.form.value)
    .subscribe((response: any) => {
      this.editMode = false;
      
      this.createForm(this.item = response);

      this.processing = false;
      this.toastr.success("Successfully updated the social history");
    }, (err) => {
      this.processing = false;
    });
  }

  cancel() {
    this.editMode = false
    this.createForm(this.item);
  }
}
