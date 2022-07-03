import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { getMasterByName } from 'src/app/utils/helper/utilities';
import { ACTIVE } from 'src/app/utils/items/active';
import { MedicalHistoryService } from 'src/app/utils/services/mpi/medical-history.service';

@Component({
  selector: 'app-family-medical-history',
  templateUrl: './family-medical-history.component.html',
  styleUrls: ['./family-medical-history.component.scss']
})
export class FamilyMedicalHistoryComponent implements OnInit {

  @Input()
  patientID: any;

  editMode = false;
  processing = true;
  items: any;
  form: FormGroup;
  relationships: any;

  toDelete = [];

  constructor(
    private service: MedicalHistoryService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.relationships = getMasterByName('Relationship');
    this.createForm();
    this.list();
  }

  createForm() {
    this.form = this.fb.group({
      family_histories: this.fb.array([])
    });
  }

  add() {
    this.familyHistories.push(this.create());
  }

  remove(index) {
    if(this.familyHistories.at(index)?.value?.id) {
      this.toDelete.push(this.familyHistories.at(index)?.value?.id);
    }
    this.familyHistories.removeAt(index);
  }

  create(item = null) {
    return this.fb.group({
      id: item?.id,
      relationship_uid: item?.relationship_uid,
      condition: item?.condition,
      remarks: item?.remarks
    });
  }

  get familyHistories() {
    return this.form.get('family_histories') as FormArray;
  }

  transform() {
    this.familyHistories.clear();

    if(this.items?.data?.length < 1) {
      this.familyHistories.push(this.create());
    } else {
      this.items?.data?.forEach((item) => {
        this.familyHistories.push(this.create(item));
      });
    }
  }

  list() {
    this.service.getFamilyHistories({
      patient_id: this.patientID
    })
    .subscribe((response: any) => {
      this.items = response;
      this.processing = false;
      this.transform();
    }, (err) => {
      this.processing = false;
    })
  }

  save() {
    this.processing = true;
    this.service.saveFamilyHistories(this.patientID, {
      family_histories: this.form.value?.family_histories?.filter((item) => item?.relationship_uid && item?.condition),
      to_delete: this.toDelete
    })
    .subscribe((response: any) => {
      this.editMode = false;
      this.toDelete = [];
      
      this.items.data = response;
      this.transform();

      this.processing = false;
      this.toastr.success("Successfully updated the family medical history");
    }, (err) => {
      this.processing = false;
    });
  }

  getRelationship(id) {
    return this.relationships?.details?.find((item) => +item?.uid === +id)?.text;
  }

  cancel() {
    this.editMode = false
    this.toDelete = [];
    this.transform();
  }
}
