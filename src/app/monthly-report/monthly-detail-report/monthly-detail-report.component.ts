import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { first } from 'rxjs/operators';
import { ngxCsv } from 'ngx-csv';
import { MonthlyreportService } from '../../services/monthlyreport.service';

@Component({
  selector: 'app-monthly-detail-report',
  templateUrl: './monthly-detail-report.component.html',
  styleUrls: ['./monthly-detail-report.component.scss'],
  providers: [DatePipe]
})
export class MonthlyDetailReportComponent implements OnInit {
  customerOrg: any;
  userProfile: any;
  Month: any;
  newDate = new Date().toLocaleString();
  selectedValue: string = '';
  getDetail:any
  constructor(private userService: UserService, private route: Router, public datepipe: DatePipe, private mDetail: MonthlyreportService) { }

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
    this.getMonthlyDetail()
  }

  getMonthlyDetail() {
    this.mDetail.getMonthlyDetail(this.selectedValue).subscribe(res => {
      console.log(res)
      this.getDetail = res
    });
  }

  async exportCsv() {
    this.mDetail.getSumarySale(this.selectedValue).subscribe(res => {
      this.getDetail = res
    });
    var options = {
      title: 'Your title',
      headers: ["Order Date", "Order ID", "Customer Code", "Customer Name", "Product Code", "Product",
        "Order Quntity", "IT/CS", "Promotion", "Sale Value", "Discount", "Net Sale", "Brand",
        "Category", "Address", "Telephone", "Confirm", "Picked", "Packed", "Shipped", "Note", "Customer Type", "Delivery Fee",
        "Delivery Type", "Paid Status", "Tracking Number", "Sale+Shipping Fee", "Seller", "Date Transfer", "Value Transfer", "Urgent Order"]
    };
    new ngxCsv(this.getDetail, 'Monthly Detail Report', options);
    await this.getMonthlyDetail()
  }
}
