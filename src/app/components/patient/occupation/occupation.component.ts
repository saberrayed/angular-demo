import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UtilitiesService } from 'src/app/utils/services/utilities/utilities.service';
import { AutocompleteComponent } from '../../autocomplete/autocomplete.component';

@Component({
  selector: 'app-occupation',
  templateUrl: './occupation.component.html',
  styleUrls: ['./occupation.component.scss']
})
export class OccupationComponent implements OnInit {

  @ViewChild('industryAutoComp', {static: false})
  industryAutoComp: AutocompleteComponent;

  @Input()
  patient: any;

  @Input()
  patientForm: any;

  industries: any[] = [];
  industrySearchComponent: any;
  validations: any;

  constructor(
    private service: UtilitiesService
  ) {}

  ngOnInit(): void {}

  initializeIndustry() {
    if(this.patient?.occupation?.industry_type) {
      this.industries.push(
        this.patient?.occupation?.industry_type
      );
      this.industryAutoComp.selectedResult = this.patient?.occupation?.industry_type;
    }
  }

  searchIndustry(term) {
    const queryParams: any = {};
    queryParams.value_set_code = 109;
    queryParams.query = term;
    queryParams.order = 'text';

    this.service.getValueDetail(queryParams).subscribe((response: any) => {
      this.industries = response?.data;
    });
  }

  updateIndustry(value) {
    this.patientForm.get('occupation').get('industry').setValue(value?.uid);
    this.patientForm.get('occupation').get('industry').updateValueAndValidity();
  }

  isRequired(rules: string) {
    return rules ? rules.includes('required') : false;
  }

  getControl(control) {
    return this.patientForm.get(control);
  }

  getMasterByCodecode(code) {
    return JSON.parse(localStorage.getItem('value_master')).find((item) => {
      return item?.code === code;
    });
  }
}
