import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ACTIVE } from 'src/app/utils/items/active';
import { MedicalHistoryService } from 'src/app/utils/services/mpi/medical-history.service';
import { AutocompleteComponent } from '../../autocomplete/autocomplete.component';

@Component({
  selector: 'app-obgyne-history',
  templateUrl: './obgyne-history.component.html',
  styleUrls: ['./obgyne-history.component.scss']
})
export class ObgyneHistoryComponent implements OnInit {

  @Input()
  patientID: any;

  @ViewChild('autocomp', {static: false})
  autocomp: AutocompleteComponent;

  editMode = false;
  processing = true;
  item: any;
  form: FormGroup;

  contraceptives: any = [
    {text: "Condom" },
    {text: "Oral Contraceptive Pill" },
    {text: "Intrauterine Device (IUD)" },
    {text: "Contraceptive Implant" },
    {text: "Contraceptive Injection" },
    {text: "Emergency Contraception Pill (The 'Morning After' Pill)" },
    {text: "Contraceptive Ring" },
    {text: "Caps or Diaphragm" },
  ];

  results: any = [];
  selectedContraceptives: any = [];

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
      clinical_status_uid: [item?.clinical_status_uid ?? ACTIVE],
      gravida: [item?.gravida],
      para: [item?.para],
      term: [item?.term],
      premature_births: [item?.premature_births],
      abortions: [item?.abortions],
      living_children: [item?.living_children],
      menarche: [item?.menarche],
      menopause: [item?.menopause],
      is_regular: [item?.is_regular],
      interval: [item?.interval],
      duration: [item?.duration],
      amount: [item?.amount],
      pain: [item?.pain],
      lnmp: [item?.lnmp],
      pmp: [item?.pmp],
      last_pap_smear: [item?.last_pap_smear],
      vaginal_discharge: [item?.vaginal_discharge],
      vaginal_bleeding: [item?.vaginal_bleeding],
      sexual_status_activities: [item?.sexual_status_activities],
      contraceptives_used: [item?.contraceptives_used]
    });
  }

  updateContraceptives() {
    this.form.patchValue({
      contraceptives_used: this.autocomp?.selectedResult?.map((item) => item?.text)?.join(',')
    });
  }

  startEdit() {
    this.editMode = true;
    setTimeout(() => {
      this.autocomp.selectedResult = this.item?.contraceptives_used?.split(',').map((item) => {
        return { text: item };
      });
    }, 1);
  }

  search(val) {
    this.results = this.contraceptives?.filter((item) => item?.text.toLowerCase()?.includes(val.toLowerCase()));
    if(this.results?.length < 1) {
      this.results.push({
        text: val
      });
    }
  }

  reset(name) {
    this.form.get(name).reset();
  }

  get() {
    this.service.getObgyneHistory(this.patientID)
    .subscribe((response: any) => {
      this.createForm(this.item = response);
      this.processing = false;
    }, (err) => {
      this.processing = false;
    })
  }

  save() {
    this.processing = true;
    this.service.saveObgyneHistory(this.patientID, this.form.value)
    .subscribe((response: any) => {
      this.editMode = false;
      
      this.createForm(this.item = response);

      this.processing = false;
      this.toastr.success("Successfully updated the OB/GYNE History");
    }, (err) => {
      this.processing = false;
    });
  }

  cancel() {
    this.editMode = false
    this.createForm(this.item);
  }
}
