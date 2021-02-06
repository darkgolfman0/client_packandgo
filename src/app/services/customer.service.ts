import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Customer, CustomerDetail } from '../models/customer';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CustomerService {

  constructor(private http: HttpClient) { }

  getAll(pageSize: number, search_keyword: string) {
    return this.http.get<Customer[]>(`${environment.apiUrl}/c/customers?page_size=` + pageSize + '&search_keyword=' + search_keyword);
  }

  getCustomer(customerCode: string, addressId: number) {
    if (Number.isNaN(addressId)) {
      return this.http.get<Customer>(`${environment.apiUrl}/c/cusdetail?code=` + customerCode);
    } else {
      return this.http.get<Customer>(`${environment.apiUrl}/c/cusdetail?code=` + customerCode + '&addressid=' + addressId);
    }
  }

  salePermission(pageid: string, app: string) {
    return this.http.get<any>(`${environment.apiUrl}/c/sale_permission?page_id=` + pageid + '&app=' + app);
  }

  addNewCustomer(customerData: string) {
    return this.http.post(`${environment.apiUrl}/c/customers`, JSON.parse(customerData));
  }

  updateCustomer(customerData: string) {
    return this.http.put(`${environment.apiUrl}/c/customers`, JSON.parse(customerData))
  }

  activateCustomer(customerCode: string) {
    const codeJson = {
      code: customerCode,
    };
    return this.http.post(`${environment.apiUrl}/c/cusact`, codeJson)
      .subscribe(
        data => {
          console.log('POST successful ', data);
        },
        error => {
          console.log('Error ', error);
          throw new Error('operation failed.');
        });
  }

  get_province() {
    return this.http.get<Customer[]>(`${environment.apiUrl}/c/province`);
  }

  get_district(province: string) {
    if (province) {
      province = province
    } else {
      province = ''
    }
    console.log('province', province)
    return this.http.get<Customer[]>(`${environment.apiUrl}/c/district?province=` + province);
  }

  get_sub_district(district: string) {
    if (district) {
      district = district
    } else {
      district = ''
    }
    console.log('district', district)
    return this.http.get<Customer[]>(`${environment.apiUrl}/c/sub_district?district=` + district);
  }

  get_postcode(subDistrict: string) {
    if (subDistrict) {
      subDistrict = subDistrict
    } else {
      subDistrict = ''
    }
    console.log('sub_district', subDistrict)
    return this.http.get<Customer[]>(`${environment.apiUrl}/c/postcode?subDistrict=` + subDistrict);
  }
}
