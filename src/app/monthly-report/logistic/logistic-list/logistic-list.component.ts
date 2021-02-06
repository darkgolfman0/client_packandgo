import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Sort } from '@angular/material';
import { ngxCsv } from 'ngx-csv';
import { LogisticRecord } from '../../../models/transaction';
import { TransactionService } from '../../../services/transaction.service';

@Component({
  selector: 'app-logistic-list',
  templateUrl: './logistic-list.component.html',
  styleUrls: ['./logistic-list.component.scss'],
  providers: [DatePipe]
})
export class LogisticListComponent implements OnInit {
  public sortedData: LogisticRecord[] = [];
  customerOrg: any;
  Month: any;
  newDate = new Date().toLocaleString();
  selectedValue: string = '';
  record: boolean
  totalAmount: number;

  constructor(private userService: UserService,
    public datepipe: DatePipe, private router: Router,
    private transactionService: TransactionService) {
  }

  async ngOnInit() {
    this.record = true
    this.customerOrg = await JSON.parse(localStorage.getItem('orgCustomers'));
    this.userService.getPeriod().pipe(first()).subscribe(period => {
      this.Month = period
    })
    this.newDate = this.datepipe.transform(this.newDate, 'yyyy-MM')
    this.selectedValue = this.newDate
    console.log('selectedValue', this.selectedValue)
    this.refreshData()
  }

  refreshData() {
    this.transactionService.getlogisticRecordList(this.record, this.selectedValue).pipe(first()).subscribe(items => {
      console.log('item', items)
      this.totalAmount = 0;
      items.forEach(element => {
        this.totalAmount += element.amount;
      });
      this.sortedData = items;
    },
      error => {
        console.log({ 'error': error });
      });
  }

  createRecord() {
    this.router.navigate(['transaction/lrnew']);
  }

  sortData(sort: Sort) {
    const data = this.sortedData.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'date': return compare(+a.created_time, +b.created_time, isAsc);
        case 'id': return compare(a.delivery_method_id, b.delivery_method_id, isAsc);
        case 'method': return compare(a.delivery_method, b.delivery_method, isAsc);
        case 'amount': return compare(+a.amount, +b.amount, isAsc);
        case 'note': return compare(a.note, b.note, isAsc);
        default: return 0;
      }
    });
  }

  // removeItemClick(id: number, index: number) {
  //   if (confirm('Are you sure?') == true) {
  //     this.transactionService.deleteLogisticRecord(String(id)).pipe(first()).subscribe(
  //       data => {
  //         this.sortedData.splice(index, 1);
  //         console.log('Delete record successful ', data);
  //       },
  //       error => {
  //         console.log('Error ', error);
  //         throw new Error('Delete failed.');
  //       });
  //   }
  // }

  async exportCsv(record: boolean) {
    this.transactionService.getlogisticRecordList(record, this.selectedValue).subscribe(res => {
      this.sortedData = res
    });
    var options = {
      title: 'Your title',
      headers: ["Date", "DeliveryID", "DeliveryMethod", "Amount", "Note"]
    };
    new ngxCsv(this.sortedData, 'Monthly Detail Report', options);
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
