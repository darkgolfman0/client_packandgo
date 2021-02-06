import { Component, AfterViewInit, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from 'ng-chartist';
import { UserService } from '../services';
import { first } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
declare var require: any;

// const data: any = require('./data.json');

export interface Chart {
    type: ChartType;
    data: Chartist.IChartistData;
    options?: any;
    responsiveOptions?: any;
    events?: ChartEvent;
}

@Component({
    selector: 'app-dashboard-order',
    templateUrl: './dashboard-order-list.component.html',
    styleUrls: ['./dashboard-order-list.component.scss'],
    providers: [DatePipe]
})
export class DashboardOrderListComponent implements OnInit {

    orders: any = [];
    searchKeyword: string;
    Month: any;
    newDate = new Date().toLocaleString();

    selectedValue: string = '';
    customerOrg: any;
    orgName: string;
    tokent: any = [];
    valueToken: string;

    constructor(private userService: UserService, public datepipe: DatePipe) {

    }
    async ngOnInit() {
        this.customerOrg = await JSON.parse(localStorage.getItem('userProfile'));
        this.userService.getPeriod().pipe(first()).subscribe(period => {
            this.Month = period
            console.log(this.Month)
        })
        this.newDate = this.datepipe.transform(this.newDate, 'yyyy-MM')
        this.selectedValue = this.newDate
        this.refreshData();
    }

    refreshData() {
        this.userService.getOrder(this.selectedValue).pipe(first()).subscribe(
            items => {
                this.orders = items;
                console.log(this.orders)
                if (this.customerOrg.org_id == '359b5fe6-6016-11e9-adee-063146639dcc') {
                    this.orgName = 'babykiss';
                } else if (this.customerOrg.org_id == '191de800-bc11-11e9-8cd8-b8e8563b2ce4') {
                    this.orgName = 'b2s';
                }
            },
            error => {
                console.log({ 'error': error });
            });

    }

}
