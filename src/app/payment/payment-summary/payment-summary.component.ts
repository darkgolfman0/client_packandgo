import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { UserService } from '../../services';
import { DatePipe } from '@angular/common';
import { PaymentService } from '../../services/payment.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-payment-summary',
  templateUrl: './payment-summary.component.html',
  styleUrls: ['./payment-summary.component.scss'],
  providers: [DatePipe]
})
export class PaymentSummaryComponent implements OnInit {
  orders: any;
  paymentData: any;
  searchKeyword: string;
  Month: any;
  newDate = new Date().toLocaleString();

  selectedValue: string = '';
  customerOrg: any;
  filter: any[]

  constructor(private router: Router, private userService: UserService, public datepipe: DatePipe, private p: PaymentService) { }

  async ngOnInit() {
    this.customerOrg = JSON.parse(localStorage.getItem('userProfile'));
    // const roles = this.customerOrg.groups.split(",");
    // if (roles.indexOf('pgc_managers') > -1) {
    // } else {
    //   this.router.navigate(['login']);
    // }

    this.userService.getPeriod().pipe(first()).subscribe(period => {
      this.Month = period
    })
    this.newDate = this.datepipe.transform(this.newDate, 'yyyy-MM')
    this.selectedValue = this.newDate
    this.refreshData()
  }

  async refreshData() {
    console.log(this.selectedValue)
    await this.p.getpSumary(this.selectedValue).subscribe(res => {
      this.paymentData = res
      console.log(this.paymentData)
    })
  }

}