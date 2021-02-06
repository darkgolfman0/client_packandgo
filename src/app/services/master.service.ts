import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Product} from '../models/product';
import {DeliveryTypeMaster, ExtraPickedMaster, StockAdjustmentMaster, SupplyProductMaster} from '../models/master';

@Injectable({ providedIn: 'root' })
export class MasterService {

  constructor(private http: HttpClient) {
  }

  getProductAll() {
    return this.http.get<Product[]>(`${environment.apiUrl}/c/products`);
  }

  getDeliveryType() {
    return this.http.get<DeliveryTypeMaster[]>(`${environment.apiUrl}/c/deliverytype`);
  }


}




