import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { OrderHeader } from '../models/order';
import { ExtraPickedMaster, SupplyProductMaster } from '../models/master';

@Injectable({ providedIn: 'root' })
export class OrderService {

  constructor(private http: HttpClient) { }

  getAll(activeOnly: boolean, target_date: string) {
    if (activeOnly == true) {
      return this.http.get<OrderHeader[]>(`${environment.apiUrl}/c/orders?active=1` + "&target_date=" + target_date);
    } else {
      return this.http.get<OrderHeader[]>(`${environment.apiUrl}/c/orders?active=0`);
    }
  }

  getOrder(orderId: string) {
    return this.http.get<OrderHeader[]>(`${environment.apiUrl}/c/orderdetail?code=` + orderId);
  }

  addNewOrder(orderData: string) {
    return this.http.post(`${environment.apiUrl}/c/orders`, JSON.parse(orderData));
  }

  updateOrder(orderData: string) {
    return this.http.put(`${environment.apiUrl}/c/orders`, JSON.parse(orderData));
  }


  deleteOrder(orderData: string) {
    return this.http.delete(`${environment.apiUrl}/c/orders?code=` + orderData)
      .subscribe(
        data => {
          console.log('Delete order successful ', data);
        },
        error => {
          console.log('Error ', error);
          throw new Error('operation failed.');
        });
  }

  updateOrderStatus(orderData: string) {
    return this.http.put(`${environment.apiUrl}/c/order_status`, JSON.parse(orderData));
  }


  updateOrderStatusUrgent(orderData: string) {
    return this.http.put(`${environment.apiUrl}/c/order_urgent`, JSON.parse(orderData));
  }
}
