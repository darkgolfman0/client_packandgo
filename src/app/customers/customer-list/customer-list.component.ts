import { Component, OnInit } from '@angular/core';
import { Customer } from '../../models/customer';
import { CustomerService } from '../../services';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
// import { FormBuilder } from '@angular/forms';
// import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {

  customers: Customer[] = [];
  userName: any
  public searchKeyword: string;
  retriveAll: boolean;
  disableButton: boolean

  constructor(
    private router: Router,
    private customerService: CustomerService,
    // private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.customerService.salePermission('customer_list', 'pg_client').subscribe(res => {
      if (res.perm == "read_only") {
        this.disableButton = true
      }
      else {
        this.disableButton = false
      }
    })
    this.retriveAll = false;
    this.refreshData();
  }

  refreshData() {
    // console.log(this.retriveAll)
    let pageSize = 300;
    if (this.retriveAll == true) {
      pageSize = 0;
    }
    this.customerService.getAll(pageSize, '').pipe(first()).subscribe(customers => {
      this.customers = customers;
      console.log(this.customers)
    });
  }

  searchKeywords() {
    let pageSize = 300;
    if (this.retriveAll == true) {
      pageSize = 0;
    }
    this.customers = []
    this.customerService.getAll(pageSize, this.searchKeyword).pipe(first()).subscribe(async customers => {
      this.customers = await customers;
    });
    this.searchKeyword = ''
  }

  resetKeywords() {
    this.customers = []
    this.searchKeyword = ''
    this.refreshData();
  }

  onToggleFab() {
    this.router.navigate(['cnew']);
  }
}
