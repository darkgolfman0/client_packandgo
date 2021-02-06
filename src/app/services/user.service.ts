import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../models/user';


@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(private http: HttpClient) { }

  getByUsername(username: string) {
    console.log({ 'username': username });
    return this.http.get<User>(`${environment.apiUrl}/users/${username}`);
  }

  getOrder(target_date: string) {
    return this.http.get(`${environment.apiUrl}/c/dashboard_orders?target_date=` + target_date);
  }

  getDashboard(target_date: string): any {
    return this.http.get(`${environment.apiUrl}/c/dashboard?target_date=` + target_date);
  }

  getPeriod() {
    return this.http.get(`${environment.apiUrl}/c/operation_period`);
  }
}
