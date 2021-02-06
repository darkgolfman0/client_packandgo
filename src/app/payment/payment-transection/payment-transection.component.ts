import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { UserService } from '../../services';
import { DatePipe } from '@angular/common';
import { PaymentService } from '../../services/payment.service';
import { Router } from '@angular/router';
import { ngxCsv } from 'ngx-csv/ngx-csv';

@Component({
  selector: 'app-payment-transection',
  templateUrl: './payment-transection.component.html',
  styleUrls: ['./payment-transection.component.scss'],
  providers: [DatePipe]
})
export class PaymentTransectionComponent implements OnInit {
  orders: any;
  paymentData: any;
  searchKeyword: string;
  Month: any;
  newDate = new Date().toLocaleString();

  selectedValue: string = '';
  customerOrg: any;
  constructor(private router: Router, private userService: UserService, public datepipe: DatePipe, private p: PaymentService) { }

  async ngOnInit() {
    this.customerOrg = JSON.parse(localStorage.getItem('userProfile'));
    const roles = this.customerOrg.groups.split(",");
    if (roles.indexOf('pgc_managers') > -1) {
    } else {
      this.router.navigate(['login']);
    }
    this.userService.getPeriod().pipe(first()).subscribe(period => {
      this.Month = period
    })
    this.newDate = this.datepipe.transform(this.newDate, 'yyyy-MM')
    this.selectedValue = this.newDate
    this.refreshData();
  }

  exportCsv() {
    this.p.getpTransaction(this.selectedValue).subscribe(res => {
      this.paymentData = res
    })
    var options = {
      title: 'Your title',
      headers: ["Order ID", "Customer Type", "Urgent Order", "Picked", "Packed", "Pick Cost", "Pack Cost", "FTE Cost", "FTE Full Cost", "Extra Material", "Packaging"]
    };
    new ngxCsv(this.paymentData, 'paymentTransaction', options);
  }

  refreshData() {
    console.log(this.selectedValue)
    this.p.getpTransaction(this.selectedValue).subscribe(res => {
      console.log({ 'res': res })
      this.paymentData = res
    })
  }

}
