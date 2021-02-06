import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { StockInventory } from '../../models/master';

@Component({
  selector: 'app-stock-movement',
  templateUrl: './stock-movement.component.html',
  styleUrls: ['./stock-movement.component.scss']
})
export class StockMovementComponent implements OnInit {
  getStocks: any[] = [];
  stocks: any
  code: string

  constructor(public sm: ProductService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.code = this.route.snapshot.paramMap.get('code');
    this.getStockMovement()
  }

  getStockMovement() {
    this.sm.getStockMovement(this.code).pipe().subscribe(async res => {
      this.getStocks = await res
      for (const stockMovement of this.getStocks) {
        this.stocks = stockMovement
        console.log(this.stocks)
      }

    })
  }
}
