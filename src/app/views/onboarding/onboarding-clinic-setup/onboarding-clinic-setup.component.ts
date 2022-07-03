import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClinicService } from 'src/app/utils/services/doctor/clinic.service';
import { MunicipalityService } from 'src/app/utils/services/utilities/municipality.service';
import { CURRENT_USER } from 'src/app/utils/items/storage-names';
import { getStorage } from 'src/app/utils/helper/storage';
import { ClinicCitiesService } from 'src/app/utils/services/doctor/clinic-cities.service';
import { Router } from '@angular/router';
import { DoctorService } from 'src/app/utils/services/doctor/doctor.service';
import { ScheduleService } from 'src/app/utils/services/schedule/schedule.service';
import { CONSULT_LATER, CONSULT_NOW } from 'src/app/utils/items/service-items';
import { week } from 'src/app/utils/items/week';
import { extendMoment } from 'moment-range';
import * as _moment from 'moment';
import { split } from 'moment-range-split';
import { UserService } from 'src/app/utils/services/cas/users.service';
import { VCON } from 'src/app/utils/items/service-type';
import { AppService } from 'src/app/utils/services/app.service';

@Component({
  selector: 'app-onboarding-clinic-setup',
  templateUrl: './onboarding-clinic-setup.component.html',
  styleUrls: ['./onboarding-clinic-setup.component.scss']
})
export class OnboardingClinicSetupComponent implements OnInit {
  activePage: string = 'settings';
  municipality: any = null;


  selectedIntervalMon: any = '15';
  optionsTimeInterval: any = [
    {label: 'Every 15 minutes', value: .25},
    {label: 'Every 30 minutes', value: .5},
    {label: 'Every hour', value: 1},
    {label: 'Every 2 hours', value: 2}
  ];
  optionsDayStart: any = [
    {label: '08:00 AM', value: '0800'},
    {label: '09:00 AM', value: '0900'},
    {label: '10:00 AM', value: '1000'},
    {label: '11:00 AM', value: '1100'},
    {label: '12:00 PM', value: '1200'},
  ];

  loading = false;
  processing = false;
  user: any = null;
  doctor: any = null;
  form: FormGroup;
  selectedCities: any = [];

  week = week;

  constructor(
    public municipalityService: MunicipalityService,
    private appService: AppService,
    public userService: UserService,
    private doctorService: DoctorService,
    private scheduleService: ScheduleService,
    private fb: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.user = getStorage(CURRENT_USER,true);
    this.getDoctor();
  }

  getDoctor() {
    this.loading = true;
    this.doctorService.getDoctorByUser(this.user?.id, {
      includes: 'clinics.resource.services.schedules.slots'
    })
    .subscribe((response: any) => {
      this.doctor = response;
      this.createForm();
      this.getMunicipality();
    }, (err) => {
      this.loading = false;
    });
  }

  createForm() {
    this.form = this.fb.group({
      cater_from: ['anywhere'],
      service: this.fb.array([
        this.fb.group({
          service_item_code: [CONSULT_NOW],
          price: [0, [Validators.required]],
          auto_accept: [1],
          is_on_call: [1],
          is_on_call_toggleable: [1],
          is_auto_booking: [1],
          payment_required: [1]
        }),
        this.fb.group({
          service_item_code: [CONSULT_LATER],
          service_type_code: [],
          service_module_code: [],
          price: [0, [Validators.required]],
          auto_accept: [0],
          is_on_call: [0],
          is_on_call_toggleable: [0],
          is_auto_booking: [0],
          payment_required: [1]
        })
      ]),
      schedules: this.fb.array([], [Validators.required, Validators.minLength(1)]),
      consultation_fee: [null, [Validators.required]]
    });
  }

  get schedules() {
    return this.form.get('schedules') as FormArray;
  }

  addSchedule(day, value: any = null) {

    if(value) {
      this.schedules.push(this.createSchedule(day));
    } else {
      const index = this.getDayIndex(day);
      if(index > -1) {
        this.schedules.removeAt(index);
      }
    }
  }

  addSlot(index) {
    const slots = this.schedules.at(index).get('slots') as FormArray;

    slots.push(this.createSlot());
  }

  removeSlot(index, slotIndex) {
    const slots = this.schedules.at(index).get('slots') as FormArray;
    slots.removeAt(slotIndex);
  }

  generateTimeBlock(index) {
    const moment = extendMoment(_moment);

    const schedule = this.schedules.at(index);
    let slots = schedule.get('slots') as FormArray;
    slots.clear();

    const startDatestring = moment().utc().format("YYYY-MM-DD") + " " + schedule?.value?.schedule_start_time + ':00';
    const endtDatestring = moment().utc().format("YYYY-MM-DD") + " " + schedule?.value?.schedule_end_time + ':00';

    let start = moment(new Date(startDatestring));
    let end = moment(new Date(endtDatestring));
    let datesBetween = [];

    while(start.isBefore(end,'minutes')) {
      // start = moment(start).add(schedule?.value?.interval,'hour');
      const startSlot = start.clone();
      
      start.add(schedule?.value?.interval,'hour');

      const endSlot = start.clone();

      slots.push(this.fb.group({
        slot_type: ['generic'],
        slot_start_time: [startSlot.format("HH:mm"), Validators.required],
        slot_end_time: [endSlot.format("HH:mm"), Validators.required],
        slot_duration: [schedule?.value?.interval],
        slot_notes: [],
        number_of_bookings: [1],
        allow_overbooking: [0],
        override_generic: [0],
      }));
    }
  }

  createSchedule(day) {
    return this.fb.group({
      schedule_type: ['generic'],
      service_type_code: [VCON, Validators.required],
      schedule_day: [day, Validators.required],
      schedule_start_time: [],
      schedule_end_time: [],
      remarks: [],
      interval: [.25],
      slots: this.fb.array([], [Validators.minLength(1)])
    })
  }

  createSlot() {
    return this.fb.group({
      slot_type: ['generic'],
      slot_start_time: [null, Validators.required],
      slot_end_time: [null, Validators.required],
      slot_duration: [null],
      slot_notes: [],
      number_of_bookings: [1],
      allow_overbooking: [0],
      override_generic: [0],
    });
  }

  getDayIndex(day) {
    return this.schedules?.value?.findIndex((item) => item?.schedule_day === day);
  }

  getControl(value) {
    return this.form.get(value);
  }

  getScheduleControl(index) {
    return this.schedules.at(index);
  }

  resetLocation() {
    this.selectedCities = [];
  }

  save() {
    let data = Object.assign({}, this.form.value);
    data.cities = [];

    this.selectedCities.forEach((value) => {
      data.cities.push({
        city: value,
        md_id: this.user?.doctor?.md_id
      });
    });

    this.processing = true;
    this.doctorService.registerVirtualClinic(this.user?.id, data)
    .subscribe((response: any) => {

      data.resource = {
        resource_id: response?.id,
        resource_type: response?.resource_type,
        resource_code: response?.name_code,
        resource_text: this.user?.doctor?.primary_name?.full,
        resource_fixed: 1,
        resource_display: this.user?.doctor?.primary_name?.full
      };

      this.generateSchedule(data);

    }, (err) => {
      this.processing = false;
    });
  }

  generateSchedule(data) {
    this.scheduleService.generateSchedule(data)
    .subscribe((response: any) => {
      this.router.navigate(['/onboarding/successful']);
    }, (err) => {
      this.processing = false;
    });
  }

  getMunicipality() {
    this.loading = true;
    this.municipalityService.getMunicipality({
      includes: 'province'
    })
    .subscribe((response: any) => {
      this.loading = false;
      this.municipality = response?.data
    },(err) => {
      this.loading = false;
    });
  }

  virtualClinic() {
    this.activePage = 'settings';
  }
}
