import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';;
import { extendMoment } from 'moment-range';
import * as _moment from 'moment';
import { ChartDataSets, Chart } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import * as ChartAnnotation from 'chartjs-plugin-annotation';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { getStorage } from 'src/app/utils/helper/storage';
import { CURRENT_USER } from 'src/app/utils/items/storage-names';

@Component({
  selector: 'app-vital-signs',
  templateUrl: './vital-signs.component.html',
  styleUrls: ['./vital-signs.component.scss']
})
export class VitalSignsComponent implements OnInit {
  @Output()
  onUpdate: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  key: any = false;

  @Input()
  withGraph: any = false;

  @Input()
  withAction: any = true;

  @Input()
  patient: any = null;

  @Input()
  documentTemplate: any = null;

  @Input()
  visit: any = null;

  @Input()
  parentFormGroup: any = null;

  @ViewChild(BaseChartDirective, { static: false })
  chart: any;

  graphVitalSigns: any = null;
  vitalSigns: any = null;
  subscriptions: Subscription[] = [];
  formGroup: FormGroup = null;
  adding: boolean = false;
  user: any = null;
  maximize: boolean = false;

  perPage = 2;
  page = 1;

  plugins = [ChartAnnotation];
  chartLabels = [
    '12AM',
    '4AM',
    '8AM',
    '12PM',
    '4PM',
    '8PM',
    '12AM',
    '4AM',
    '8AM',
    '12PM',
    '4PM',
    '8PM',
    '12AM',
    '4AM',
    '8AM',
    '12PM',
    '4PM',
    '8PM',
    '12AM',
  ];
  chartOptions = {
    plugins: this.plugins,
    responsive: true,
    legend: {
      display: false,
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          drawTime: 'beforeDatasetsDraw',
          mode: 'horizontal',
          scaleID: 'left-y-axis',
          value: 37.5,
          borderColor: '#d42436',
          borderWidth: 3,
          label: {
            enabled: true,
            content: '37.5 °C',
            position: 'left',
            fontSize: 10,
          },
          zIndex: -1,
        },
      ],
    },
    scales: {
      xAxes: [
        {
          id: 'upper-x-axis',
          type: 'time',
          distribution: 'linear',
          time: {
            unit: 'day',
            unitStepSize: 1,
          },
          ticks: {
            stepSize: 4,
            z: -1,
          },
          position: 'top',
          gridLines: {
            display: true,
            lineWidth: 3,
            color: '#707070',
            drawBorder: false,
          },
        },
        {
          id: 'bottom-x-axis',
          type: 'time',
          distribution: 'linear',
          time: {
            unit: 'hour',
            unitStepSize: 4,
          },
          ticks: {
            stepSize: 4,
            z: -1,
          },
          display: true,
          position: 'bottom',
          scaleLabel: {
            display: true,
            labelString: 'Hours of the Day',
          },
          gridLines: {
            display: true,
            color: '#707070',
            drawBorder: false,
          },
        },
      ],
      yAxes: [
        {
          id: 'left-y-axis',
          type: 'linear',
          display: true,
          position: 'left',
          ticks: {
            stepSize: 1,
            suggestedMin: 30,
            suggestedMax: 45,
            z: -1,
          },
          scaleLabel: {
            display: true,
            labelString: 'Temperature °C',
          },
        },
      ],
    },
  };
  chartData: ChartDataSets[] = [
    {
      data: [],
      label: 'Temperature °C',
      fill: false,
      lineTension: 0,
      pointRadius: 10,
      borderColor: 'rgba(18,85,143,1)',
      xAxisID: 'bottom-x-axis',
      yAxisID: 'left-y-axis',
    },
  ];
  lineChartColors = [
    {
      backgroundColor: 'rgb(18, 85, 143)',
      borderColor: 'rgb(18, 85, 143)',
      pointBackgroundColor: 'rgb(18, 85, 143)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(103, 58, 183, .8)',
    },
    // ...colors for additional data sets
  ];

  constructor(private fb: FormBuilder) {
    this.user = getStorage(CURRENT_USER,true);
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (let propName in changes) {
      if (propName === 'withGraph') {
        setTimeout(() => {
          this.updateGraph();
        }, 100);
      }
    }
  }

  ngOnInit() {
    this.createForm();
  }

  updateGraph(views = 3) {
    const moment = extendMoment(_moment);
    if (this.withGraph) {
      this.chart.chart.config.data.datasets[0].data = [];

      this.chart.chart.config.data.datasets[0].data = this.vitals?.value
        ?.filter((vital: any) => {
          return !vital?.deleted_datetime;
        })
        .map((vital: any) => {
          return {
            x: vital.performed_datetime,
            y: vital.temperature_c,
          };
        });

      if (this.vitals?.value?.length > 0) {
        if (+views < 1) {
          views = moment(this.vitals?.value[this.vitals?.value?.length - 1].performed_datetime).diff(moment(this.visit.admission_datetime), 'days') + 2;
        }

        this.updateGraphDistance(views);
      }

      this.chart.chart.update();
      this.chart.chart.render();
    }
  }

  updateGraphDistance(views) {
    const moment = extendMoment(_moment);
    this.chart.chart.options.scales.xAxes[0].ticks.min = moment(this.visit.admission_datetime).startOf('day').valueOf();
    this.chart.chart.options.scales.xAxes[0].ticks.max = moment(this.visit.admission_datetime).add(views, 'days').startOf('day').valueOf();
    this.chart.chart.options.scales.xAxes[1].ticks.min = moment(this.visit.admission_datetime).startOf('day').valueOf();
    this.chart.chart.options.scales.xAxes[1].ticks.max = moment(this.visit.admission_datetime).add(views, 'days').startOf('day').valueOf();
  }

  createForm() {
    const moment = extendMoment(_moment);

    this.formGroup = this.fb.group({
      patient_id: [this.visit?.patient_id],
      visit_id: [this.visit?.visit_id],
      document_id: [null],
      form_id: [null],
      group_id: [null],
      page_id: [null],
      shift_id: [null],
      systolic: [null],
      systolic_flag: [120],
      diastolic: [null],
      diastolic_flag: [80],
      heart_rate: [null],
      heart_rate_flag: [100],
      respiratory_rate: [null],
      respiratory_rate_flag: [20],
      temperature_c: [null],
      temperature_f: [null],
      temperature_flag: [37.5],
      pain: [null,[Validators.max(10)]],
      oxygen_saturation: [null],
      capillary_blood_glucose: [null],
      remarks: [null],
      note: [null],
      deleted: [null],
      deleted_datetime: [null],
      deleted_reason: [null],
      deleted_by_uid: [null],
      deleted_by_initial: [null],
      deleted_by: [null],
      deleted_by_did: [null],
      recorded_datetime: [moment().format('YYYY-MM-DDTHH:mm'), Validators.required,],
      recorded_by: [null],
      recorded_by_did: [null],
      performed_datetime: [moment().format('YYYY-MM-DDTHH:mm'), Validators.required,],
      performed_by: [null],
      performed_by_did: [null],
      is_locked: [0],
      is_active: [1],
      updated_at: [moment().format('YYYY-MM-DDTHH:mm'), Validators.required],
      created_at: [moment().format('YYYY-MM-DDTHH:mm'), Validators.required],
      created_by_uid: this.user?.id,
      created_by_initial: this.user?.initial,
      created_by: this.user?.display,
      modified_by_uid: this.user?.id,
      modified_by_initial: this.user?.initial,
      modified_by: this.user?.display,
    });
  }

  add() {
    this.vitals?.insert(0, this.fb.group(this.formGroup?.value));
    this.page = 1;
    this.onUpdate.emit();
    this.updateGraph();
    this.createForm();
  }

  update(vital, index) {
    vital.updating = true;
    const moment = extendMoment(_moment);
    const start = +this.perPage * (+this.page - 1);
    const data = {
      performed_datetime: moment((<HTMLInputElement>document.getElementById('edit_datetime_' + index))?.value).format('YYYY-MM-DD HH:mm:ss'),
      systolic: (<HTMLInputElement>(document.getElementById('edit_systolic_' + index)))?.value,
      diastolic: (<HTMLInputElement>(document.getElementById('edit_diastolic_' + index)))?.value,
      temperature_c: (<HTMLInputElement>(document.getElementById('edit_temperature_' + index)))?.value,
      heart_rate: (<HTMLInputElement>(document.getElementById('edit_pr_' + index)))?.value,
      respiratory_rate: (<HTMLInputElement>(document.getElementById('edit_rr_' + index)))?.value,
      note: (<HTMLInputElement>document.getElementById('edit_note_' + index))?.value,
      pain: (<HTMLInputElement>document.getElementById('edit_pain_' + index))?.value,
      oxygen_saturation: (<HTMLInputElement>document.getElementById('edit_oxygen_saturation_' + index))?.value,
      capillary_blood_glucose: (<HTMLInputElement>document.getElementById('edit_capillary_blood_glucose_' + index))?.value,
      remarks: (<HTMLInputElement>document.getElementById('edit_remarks_' + index))?.value,
      updated_at: moment().format('YYYY-MM-DDTHH:mm'),
      modified_by_uid: this.user?.id,
      modified_by_initial: this.user?.initial,
      modified_by: this.user?.display,
    };

    this.vitals.at(+index + +start).patchValue(data);
    this.vitals.at(+index + +start)?.updateValueAndValidity();
    this.updateGraph();

    vital.updating = false;
    vital.edit = false;
    this.onUpdate.emit();
  }

  toggleLock(index) {
    this.vitals.at(index).get('is_locked').setValue(!this.vitals?.at(index)?.value?.is_locked);
  }

  delete(vital, index) {

    if (confirm('Are you sure you want to delete this?')) {
      vital.deleting = true;

      const start = +this.perPage * (+this.page - 1);
      this.vitals.removeAt(+index + +start);
      this.updateGraph();

      vital.deleting = false;

      if(this.paginated()?.length < 1 && this.page > 0) {
        this.page--;
      }

      this.onUpdate.emit();
    }
  }

  get vitals() {
    return this.parentFormGroup.get(this.key) as FormArray;
  }

  convertToLocale(date) {
    const moment = extendMoment(_moment);
    return moment(date).format('YYYY-MM-DDTHH:mm');
  }

  onEdit(vital) {
    vital.edit = true;
  }

  onCancelEdit(vital) {
    vital.edit = false;
  }

  toggleMaxMin() {
    this.maximize = !this.maximize;
    if (!this.maximize) {
      this.updateGraph();
      this.resetZoom();
    }
  }

  reverse() {
    return this.vitals?.value?.reverse();
  }

  zoomOut() {
    if (this.chart.chart.options.scales.yAxes[0].ticks.suggestedMin > 30) {
      this.chart.chart.options.scales.yAxes[0].ticks.suggestedMin = this.chart.chart.options.scales.yAxes[0].ticks.suggestedMin - 1;
    }

    if (this.chart.chart.options.scales.yAxes[0].ticks.suggestedMax < 45) {
      this.chart.chart.options.scales.yAxes[0].ticks.suggestedMax = this.chart.chart.options.scales.yAxes[0].ticks.suggestedMax + 1;
    }

    this.chart.chart.update();
    this.chart.chart.render();
  }

  zoomIn() {
    if (this.chart.chart.options.scales.yAxes[0].ticks.suggestedMin < 36) {
      this.chart.chart.options.scales.yAxes[0].ticks.suggestedMin = this.chart.chart.options.scales.yAxes[0].ticks.suggestedMin + 1;
    }
    if (this.chart.chart.options.scales.yAxes[0].ticks.suggestedMax > 38) {
      this.chart.chart.options.scales.yAxes[0].ticks.suggestedMax = this.chart.chart.options.scales.yAxes[0].ticks.suggestedMax - 1;
    }
    this.chart.chart.update();
    this.chart.chart.render();
  }

  resetZoom() {
    this.chart.chart.options.scales.yAxes[0].ticks.suggestedMin = 30;
    this.chart.chart.options.scales.yAxes[0].ticks.suggestedMax = 45;
    this.chart.chart.update();
    this.chart.chart.render();
  }

  paginated() {
    const start = +this.perPage * (+this.page - 1);
    return this.vitals?.value?.slice(start, start + this.perPage);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
