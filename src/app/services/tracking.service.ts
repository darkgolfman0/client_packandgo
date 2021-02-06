import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';


@Injectable({ providedIn: 'root' })
export class TrackingService {

  constructor(private http: HttpClient) {}

  getOrderById(company:string, id:string) {
    return this.http.get<any>(`${environment.apiUrl}/tracking?com=${company}&code=${id}`);
  }
}
