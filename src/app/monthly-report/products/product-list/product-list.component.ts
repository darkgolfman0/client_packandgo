import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MasterService } from '../../../services/master.service';
import { Product } from '../../../models/product';

@Component({
  selector: 'app-products-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  public searchKeyword: string;

  constructor(
    private router: Router,
    private masterService: MasterService,
  ) { }

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    this.masterService.getProductAll().pipe(first()).subscribe(products => {
      this.products = products;
      console.log(this.products)
    });
  }
}
