import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Product } from '../models/product';
import { StockInventory } from '../models/master';


@Injectable({ providedIn: 'root' })
export class ProductService {

  constructor(private http: HttpClient) { }

  getActive() {
    // const baseUrl = `${environment.apiUrl}/customers/`;
    return this.http.get<Product[]>(`${environment.apiUrl}/c/products`);
  }

  getStockInventory(orderId: string) {
    return this.http.get<StockInventory[]>(`${environment.apiUrl}/c/inventory_by_product?code=` + orderId);
  }

  getStockMovement(orderId: string) {
    return this.http.get<StockInventory[]>(`${environment.apiUrl}/c/stock_movement?code=` + orderId);
  }
}
