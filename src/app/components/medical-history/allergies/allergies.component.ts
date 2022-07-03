import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ACTIVE } from 'src/app/utils/items/active';
import { ALLERGY, BIOLOGIC, ENVIRONMENT, FOOD, INTOLERANCE, MEDICATION } from 'src/app/utils/items/allergy';
import { AllergyService } from 'src/app/utils/services/mpi/allergy.service';
import { MedicalHistoryService } from 'src/app/utils/services/mpi/medical-history.service';

@Component({
  selector: 'app-allergies',
  templateUrl: './allergies.component.html',
  styleUrls: ['./allergies.component.scss']
})
export class AllergiesComponent implements OnInit {

  @Output()
  saved: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  patientID: any;

  @Input()
  modal: any;

  @Input()
  editMode = false;
  
  processing = true;
  items: any;
  form: FormGroup;

  types = [
    {
      uid: ALLERGY,
      text: "Allergy"
    },
    {
      uid: INTOLERANCE,
      text: "Intolerance"
    }
  ]

  allergy = {
    food: {
      uid: FOOD,
      text: "FOOD"
    },
    medication: {
      uid: MEDICATION,
      text: "FOOD"
    },
    environment: {
      uid: ENVIRONMENT,
      text: "FOOD"
    },
    biologic: {
      uid: BIOLOGIC,
      text: "FOOD"
    }
  }

  toDelete = [];

  constructor(
    private service: MedicalHistoryService,
    private toastr: ToastrService,
    private allergyService: AllergyService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createForm();

    this.allergyService.allergiesSubject.subscribe((response: any) => {
      if(response) {
        this.items = response;
        this.processing = false;
        this.transform();
      }
    });
  }

  getAllergyCategory() {
    return [
      {
        uid: FOOD,
        text: "FOOD",
        title: "FOOD ALLERGY",
      },
      {
        uid: MEDICATION,
        text: "MEDICATION",
        title: "MEDICATION/DRUG ALLERGY",
      },
      {
        uid: ENVIRONMENT,
        text: "ENVIRONMENT",
        title: "ENVIRONMENT ALLERGY",
      },
      {
        uid: BIOLOGIC,
        text: "BIOLOGIC",
        title: "BIOLOGIC ALLERGY",
      }
    ];
  }

  createForm() {
    this.form = this.fb.group({
      allergies: this.fb.array([])
    });
  }

  add(category) {
    this.allergies.push(this.create({
      allergy_category_uid: category
    }));
  }

  remove(control: FormGroup) {
    
    if(control?.value?.id) {
      this.toDelete.push(control?.value?.id);
    }

    control.patchValue({
      id: -1
    });

    const index = this.allergies.value?.findIndex((item) => +item?.id === -1);

    if(index > -1) {
      this.allergies.removeAt(index);
    }
  }

  create(item = null) {
    return this.fb.group({
      id: item?.id,
      allergy_type_uid: item?.allergy_type_uid || ALLERGY,
      allergy_category_uid: item?.allergy_category_uid,
      substance: item?.substance,
      reaction: '-',
      clinical_status_uid: ACTIVE,
    });
  }

  get allergies() {
    return this.form.get('allergies') as FormArray;
  }

  getAllergyByCategory(category) {
    return this.items?.filter((item: any) => +item?.allergy_category_uid === +category);
  }

  getAllergyControlByCategory(category) {
    return this.allergies?.controls.filter((item: any) => +item?.value?.allergy_category_uid === +category);
  }

  transform() {
    this.allergies.clear();

    this.items?.forEach((item) => {
      this.allergies.push(this.create(item));
    });

    if(this.getAllergyByCategory(this.allergy?.food?.uid)?.length < 1) {
      this.add(this.allergy?.food?.uid);
    }

    if(this.getAllergyByCategory(this.allergy?.medication?.uid)?.length < 1) {
      this.add(this.allergy?.medication?.uid);
    }

    if(this.getAllergyByCategory(this.allergy?.environment?.uid)?.length < 1) {
      this.add(this.allergy?.environment?.uid);
    }

    if(this.getAllergyByCategory(this.allergy?.biologic?.uid)?.length < 1) {
      this.add(this.allergy?.biologic?.uid);
    }
  }

  getType(id) {
    return this.types?.find((item) => +item?.uid === +id)?.text;
  }

  list() {
    this.service.getAllergies({
      order: 'allergy_category_uid',
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
    const data = Object.assign({}, this.form.value?.allergies?.filter((item) => item?.substance ));

    this.processing = true;
    this.service.saveAllergies(this.patientID, {
      allergies: data,
      to_delete: this.toDelete
    })
    .subscribe((response: any) => {
      this.editMode = false;
      this.toDelete = [];

      this.items = response;
      this.transform();
      this.allergyService.setallergies(this.items);

      this.processing = false;
      this.toastr.success("Successfully updated the patient allergies");

      if(this.modal) {
        this.saved.emit();
      }
    }, (err) => {
      this.processing = false;
    });
  }

  cancel() {
    this.editMode = false
    this.toDelete = [];
    this.transform();
  }

}
