import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { OrderHeader } from '../../models/order';
import { Customer } from '../../models/customer';
import { first } from 'rxjs/operators';
import { UserService } from '../../services';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-orders-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  providers: [DatePipe]
})

export class OrderListComponent implements OnInit {

  orders: OrderHeader[] = [];
  public searchKeyword: string;
  activeOnly: boolean;
  Month: any;
  newDate = new Date().toLocaleString();

  selectedValue: string = '';

  constructor(
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    public datepipe: DatePipe
  ) { }

  ngOnInit() {
    this.userService.getPeriod().pipe(first()).subscribe(period => {
      this.Month = period
      console.log(this.Month)
    })
    this.newDate = this.datepipe.transform(this.newDate, 'yyyy-MM')
    this.selectedValue = this.newDate
    this.activeOnly = true;
    this.refreshData();
  }

  refreshData() {
    this.orderService.getAll(this.activeOnly, this.selectedValue).pipe(first()).subscribe(items => {
      this.orders = items;
      console.log(this.orders)
    });
  }

}
