import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { first } from 'rxjs/operators';
import { ngxCsv } from 'ngx-csv';
import { MonthlyreportService } from '../../services/monthlyreport.service';

@Component({
  selector: 'app-summary-sale-report',
  templateUrl: './summary-sale-report.component.html',
  styleUrls: ['./summary-sale-report.component.scss'],
  providers: [DatePipe]
})
export class SummarySaleReportComponent implements OnInit {
  customerOrg: any;
  userProfile: any;
  Month: any;
  newDate = new Date().toLocaleString();
  selectedValue: string = '';
  getSummary: any;
  csvData: any

  constructor(private userService: UserService, private route: Router, public datepipe: DatePipe, private summary: MonthlyreportService) { }

  async ngOnInit() {
    this.customerOrg = JSON.parse(localStorage.getItem('orgCustomers'));
    this.userProfile = JSON.parse(localStorage.getItem('userProfile'));
    // const roles = await this.userProfile.groups.split(",");
    // console.log(roles)
    // if ((roles.indexOf('pg_operators') > -1)) {
    // } else {
    //   this.route.navigate(['/login'])
    // }
    this.userService.getPeriod().pipe(first()).subscribe(period => {
      this.Month = period
    })
    this.newDate = this.datepipe.transform(this.newDate, 'yyyy-MM')
    this.selectedValue = this.newDate
    console.log(this.selectedValue)
    this.getSummaryRepory()
    this.summary.getCsvData(this.selectedValue).subscribe(data => {
      this.csvData = data
    });
  }

  exportCsv() {
    var options = {
      title: 'Your title',
      headers: ["Order ID", "Customer Type", "Customer Name", "Date Transfer", "Value Transfer", "Delivery Fee", "Delivery Type","Seller", "Product Code", "Product", "Net Sale", "Order Quntity"]
    };
    new ngxCsv(this.csvData, 'Clinet Summary Sale Report', options);
  }

  getSummaryRepory() {
    this.summary.getSumarySale(this.selectedValue).subscribe(data => {
      this.getSummary = data
      console.log('data', this.getSummary)
    });
  }
}
