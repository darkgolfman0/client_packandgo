import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({ providedIn: 'root' })
export class TransactionService {

    constructor(private http: HttpClient) { }
    public getlogisticRecordList(isActiveOnly: boolean, target_date: string) {
        if (isActiveOnly == true) {
            return this.http.get<any[]>(`${environment.apiUrl}/c/logistic_report?active=1` + '&target_date=' + target_date);
        } else {
            return this.http.get<any[]>(`${environment.apiUrl}/c/logistic_report?active=0` + '&target_date=' + target_date);
        }
    }
}