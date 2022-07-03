import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'tbody[skeleton-loader]',
  templateUrl: './skeleton-table-loading.component.html',
  styleUrls: ['./skeleton-table-loading.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SkeletonTableLoadingComponent implements OnInit {

  @Input() rows = 5;
  @Input() columns = 5;
  @Input() processing = false;

  constructor() { }

  ngOnInit(): void {
  }

  counter(i: number) {
    return new Array(i);
  }

}
