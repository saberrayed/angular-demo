import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormArray, Validators } from '@angular/forms';
import { MunicipalityService } from 'src/app/utils/services/utilities/municipality.service';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss']
})
export class AddressesComponent implements OnInit {
  @Input()
  patientForm: FormGroup;

  @Input()
  disableFields = false;

  @Input()
  patient: any;

  @Input()
  validations: any;

  countries: any;
  provinces: any;
  municipalities: any;
  barangays: any;

  constructor(private addressService: MunicipalityService) {}

  ngOnInit(): void {
    this.listCountries();
    this.listProvinces();
  }

  listCountries() {
    const queryParams: any = {};
    queryParams.order = 'name';
    queryParams.perPage = 'all';

    this.addressService.getCountries(queryParams).subscribe((response: any) => {
      this.countries = response;
    });
  }

  listProvinces() {
    const queryParams: any = {};
    queryParams.order = 'display';
    queryParams.perPage = 'all';

    this.addressService.getProvinces(queryParams).subscribe((response: any) => {
      this.provinces = response;
    });
  }

  listMunicipalities(index, empty = true) {
    const queryParams: any = {};
    queryParams.province_code = this.patientForm.value.addresses[
      index
    ].state_province_code;
    queryParams.order = 'display';
    queryParams.perPage = 'all';

    this.patientForm.get('addresses.' + index + '.cities').setValue(null);

    if (empty) {
      this.patientForm.get('addresses.' + index + '.city_code').setValue(null);
      this.patientForm
        .get('addresses.' + index + '.barangay_code')
        .setValue(null);
    }

    this.addressService
      .getMunicipality(queryParams)
      .subscribe((response: any) => {
        this.municipalities = response;
        this.patientForm
          .get('addresses.' + index + '.cities')
          .setValue(response);
      });
  }

  listBarangay(index, empty = true) {
    const queryParams: any = {};
    queryParams.municipal_code = this.patientForm.value.addresses[
      index
    ].city_code;
    queryParams.order = 'display';
    queryParams.perPage = 'all';

    this.patientForm.get('addresses.' + index + '.barangays').setValue(null);

    if (empty) {
      this.patientForm
        .get('addresses.' + index + '.barangay_code')
        .setValue(null);
    }

    this.addressService.getBarangay(queryParams).subscribe((response: any) => {
      this.barangays = response;
      this.patientForm
        .get('addresses.' + index + '.barangays')
        .setValue(response);
    });
  }

  // getProvinceUrl() {
  //     const queryParams: any = {};
  //     queryParams.includes = 'municipalities.barangays';
  //   return this.provinceService.getProvinceUrl(queryParams);
  // }

  get addressArray(): FormArray {
    return this.patientForm.get('addresses') as FormArray;
  }

  updatePermantentAdderess() {
    const addresses: any = this.addressArray;
    const presentAddress = addresses.at(0);
    const permantentAddress = addresses.at(1);

    if (permantentAddress.value.is_same_present) {
      const newValue = Object.assign({}, presentAddress.value);
      newValue.is_same_present = true;
      newValue.type_code = 'permanent';
      permantentAddress.patchValue(newValue);
    } else {
      permantentAddress.reset();
      permantentAddress.get('type_code').setValue('permanent');
      permantentAddress.get('is_same_present').setValue(false);
    }
  }

  isRequired(rules: string) {
    return rules ? rules.includes('required') : false;
  }

  getControl(control) {
    return this.patientForm.get(control);
  }

}
