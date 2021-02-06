import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  filter:any[]
  constructor(private http: HttpClient) { }

  getpSumary(target_date: string) {
    return this.http.get<any[]>(`${environment.apiUrl}/c/payment_summary?target_date=` + target_date);
  }

  getpTransaction(target_date: string) {
    return this.http.get<any[]>(`${environment.apiUrl}/c/payment_transaction?target_date=` + target_date);
  }
}
