import { Component, AfterViewInit, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from 'ng-chartist';
import { UserService } from '../../services';
import { first } from 'rxjs/operators';
import * as shape from 'd3-shape';
import { DatePipe } from '@angular/common';
declare var require: any;

let data: any = require('./data.json');

export interface Chart {
  type: ChartType;
  data: Chartist.IChartistData;
  options?: any;
  responsiveOptions?: any;
  events?: ChartEvent;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard1.component.html',
  styleUrls: ['./dashboard1.component.scss'],
  providers: [DatePipe]
})


export class Dashboard1Component implements OnInit {
  testngx: any[];
  dateData: any[];
  dateDataWithRange: any[];
  range = false;
  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  tooltipDisabled = false;
  // xAxisLabel = 'Country';
  showYAxisLabel = true;
  // yAxisLabel = 'GDP Per Capita';
  showGridLines = true;
  innerPadding = 0;
  autoScale = true;
  timeline = false;
  barPadding = 8;
  groupPadding = 0;
  roundDomains = false;
  maxRadius = 10;
  minRadius = 3;
  showLabels = true;
  explodeSlices = false;
  doughnut = false;
  arcWidth = 0.25;
  rangeFillOpacity = 0.15;
  length = 10;

  // colorScheme = {
  //   domain: ['#1e88e5', '#2ECC71', '#26c6da', '#ffc65d', '#d96557', '#ba68c8']
  // };
  schemeType = 'ordinal';


  selectedValue: string = '';
  clients: number;
  orders: number;
  not_confirmed_order: number;
  pending_order: number;

  // Barchart
  barChart1: Chart = {
    type: 'Bar',
    data: data['order_by_date'],
    options: {
      showLabel: true,
      seriesBarDistance: 5,
      high: 12,

      axisX: {
        showGrid: true,
        offset: 20
      },
      axisY: {
        showGrid: true,
        offset: 40
      },
      height: 330
    },

    responsiveOptions: [
      [
        'screen and (min-width: 640px)',
        {
          axisX: {
            labelInterpolationFnc: function (
              value: number,
              index: number
            ): string {
              return index % 1 === 0 ? `${value}` : null;
            }
          }
        }
      ]
    ]
  };

  barChart2: Chart = {
    type: 'Bar',
    data: data['order_amount_by_date'],
    options: {
      showLabel: true,
      seriesBarDistance: 5,
      high: 12,

      axisX: {
        showGrid: true,
        offset: 20
      },
      axisY: {
        showGrid: true,
        offset: 40
      },
      height: 330
    },

    responsiveOptions: [
      [
        'screen and (min-width: 640px)',
        {
          axisX: {
            labelInterpolationFnc: function (
              value: number,
              index: number
            ): string {
              return index % 1 === 0 ? `${value}` : null;
            }
          }
        }
      ]
    ]
  };

  donuteChart1: Chart = {
    type: 'Pie',
    data: data['order_status'],
    options: {
      donut: true,
      height: 250,
      showLabel: true,
      donutWidth: 70
    }
  };

  orderByCarrier: Chart = {
    type: 'Pie',
    data: data['orderByCarrier'],
    options: {
      donut: true,
      height: 250,
      showLabel: true,
      donutWidth: 70
    }
  };

  orderAmount: Chart = {
    type: 'Pie',
    data: data['orderAmount'],
    options: {
      donut: true,
      height: 250,
      showLabel: true,
      donutWidth: 70
    }
  };

  orderByDistant: Chart = {
    type: 'Pie',
    data: data['orderByDistant'],
    options: {
      donut: true,
      height: 250,
      showLabel: true,
      donutWidth: 70
    }
  };

  orderPendingByDistant: Chart = {
    type: 'Pie',
    data: data['orderPendingByDistant'],
    options: {
      donut: true,
      height: 250,
      showLabel: true,
      donutWidth: 70
    }
  };
  Month: any;
  newDate = new Date().toLocaleString();


  constructor(private userService: UserService, public datepipe: DatePipe) {

  }
  ngOnInit(): void {
    this.userService.getPeriod().pipe(first()).subscribe(period => {
      this.Month = period
      console.log(this.Month)
    })
    this.newDate = this.datepipe.transform(this.newDate, 'yyyy-MM')
    this.selectedValue = this.newDate
    this.refreshData();
  }

  curve = shape.curveLinear;

  refreshData() {
    this.userService.getDashboard(this.selectedValue).pipe(first()).subscribe(
      items => {
        // this.orders = items;
        // data = items;
        console.log({ 'item': items });
        // this.clients = items['clients'];
        this.clients = items['clients'];
        this.orders = items['orders'];
        this.not_confirmed_order = items['not_confirmed_orders'];
        this.pending_order = items['pending_order'];
        this.barChart1.data = items.order_by_date.series;
        this.barChart2.data = items.order_amount_by_date.series_order_amount;
        this.barChart1.options.high = items['order_by_date_max_qty'];
        this.donuteChart1.data = items.order_status;
        this.orderByCarrier.data = items.orderByCarrier;
        this.orderAmount.data = items.orderAmount;
        this.orderByDistant.data = items['orderByDistant'];
        this.orderPendingByDistant.data = items['orderPendingByDistant'];
      },
      error => {
        console.log({ 'error': error });
      });

  }
}
