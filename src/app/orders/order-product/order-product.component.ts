import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {first} from 'rxjs/operators';
import {OrderDetail} from '../../models/order';
import {MasterService} from '../../services/master.service';
import {Product} from '../../models/product';
import {ProductService} from '../../services/product.service';
import {StockInventory} from '../../models/master';

export interface OrderProductData {
  item: OrderDetail;
}

@Component({
  selector: 'app-order-product',
  templateUrl: './order-product.component.html',
  styleUrls: ['./order-product.component.scss']
})
export class DialogOrderProduct {

  constructor(
    private refMaster: MasterService,
    private productService: ProductService,
    public dialogRef: MatDialogRef<DialogOrderProduct>,
    @Inject(MAT_DIALOG_DATA) public data: OrderProductData) {}

  products: Product[];
  totalOnHand: number;
  stockInventory: StockInventory[];
  selectedBatch: StockInventory;
  blockBatchSelect: boolean;
  disableSave: boolean;
  addingItem: OrderDetail;
  addingProduct: Product;
  allowSelectBatch: boolean;
  public isCollapsed = false;

  ngOnInit() {
    this.addingItem = new OrderDetail();
    this.allowSelectBatch = false;
    this.disableSave = true;
    this.blockBatchSelect = false;
    this.productService.getActive().pipe(first()).subscribe(products => {
      this.products = products;
    });
  }

  getInitialTempOrderDetail(selectedProduct) {
    this.addingItem.product_code = selectedProduct.product_id;
    this.addingItem.product_detail = selectedProduct.product_detail;

    this.productService.getStockInventory(selectedProduct.product_id).pipe(first()).subscribe(invs => {
      this.stockInventory = invs;
      this.selectedBatch = invs[0];
      this.addingItem.stock_inventory_id = this.selectedBatch.id;
      this.addingItem.batch = this.selectedBatch.batch;
      // invs[0].quantity_onhand -= 1;
      this.totalOnHand = this.getTotalStock() - 1;
      this.disableSave = false;
    });

    this.addingItem.product_unit_price = selectedProduct.unit_price;
    this.addingItem.product_quantity = 1;
    this.addingItem.discount_for_item = 0;
    this.addingItem.product_total_price = selectedProduct.unit_price;
    this.addingItem.product_unit_name = selectedProduct.product_unit_name;

  }

  assignBatch(selectedItems) {
    this.addingItem.stock_inventory_id = this.selectedBatch.id;
    this.addingItem.batch = this.selectedBatch.batch;
  }

  doSave() {
    if ( this.allowSelectBatch == true ) {
      this.addingItem.batch = this.selectedBatch.batch;
      this.addingItem.batch_id = this.selectedBatch.id;
    } else {
      this.addingItem.batch = null;
      this.addingItem.batch_id = null;
    }
    this.dialogRef.close(this.addingItem);
  }

  doClose() {
    this.dialogRef.close(null);
  }

  unitOrQtyChangeAdd() {
    const totalStockCount = this.getTotalStock();
    if (this.addingItem.product_quantity < totalStockCount) {
      this.addingItem.product_quantity += 1;
    }
    this.unitOrQtyChange();
  }

  unitOrQtyChangeRemove() {
    if (this.addingItem.product_quantity > 1) {
      this.addingItem.product_quantity -= 1;
    }
    this.unitOrQtyChange();
  }

  unitOrQtyChange() {
    this.addingItem.product_total_price = (this.addingItem.product_unit_price * this.addingItem.product_quantity) - this.addingItem.discount_for_item;
    this.totalOnHand = this.getTotalStock() - this.addingItem.product_quantity;
  }

  discountChange() {
    this.addingItem.product_total_price = this.addingItem.product_total_price - this.addingItem.discount_for_item;
  }

  totalPriceChange() {
    this.addingItem.discount_for_item = (this.addingItem.product_unit_price * this.addingItem.product_quantity) - this.addingItem.product_total_price;
  }

  getTotalStock() {
    let totalQty = 0;
    this.stockInventory.forEach( inv => {
      totalQty += inv.quantity_onhand;
    });
    return totalQty;
  }
}
