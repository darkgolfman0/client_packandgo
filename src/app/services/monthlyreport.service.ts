import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MonthlyreportService {

  constructor(private http: HttpClient) { }

  getSumarySale(target_date: string) {
    return this.http.get<any[]>(`${environment.apiUrl}/c/summary_sale?target_date=` + target_date);
  }

  getMonthlyDetail(target_date: string) {
    return this.http.get<any[]>(`${environment.apiUrl}/c/monthly_detail?target_date=` + target_date)
  }

  getCsvData(target_date: string) {
    return this.http.get<any[]>(`${environment.apiUrl}/c/sum_csv_report?target_date=` + target_date)
  }

}