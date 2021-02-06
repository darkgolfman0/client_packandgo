import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../models/user';
import { reduceTicks } from '@swimlane/ngx-charts';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;


  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    console.log({ 'user': username });
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post<any>(`${environment.apiUrl}/auth/login/`, { username, password }, { headers: headers })
      .pipe(map(user => {
        if (user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        } else {
          throw new Error('Valid username or password.');
        }
        return user;
      },
        error => {
          return error;
        }));
  }

  changPassword(username: string, password: string, new_password: string) {
    console.log({ "password": password, "npassword": new_password })
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json; charset=utf-8');
    var tempJson = {
      'username': username,
      'password': password,
      'new_password': new_password
    }
    return this.http.post<any>(`${environment.apiUrl}/auth/changepwd`, JSON.stringify(tempJson), { headers: headers })
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('tokenInfo');
    this.currentUserSubject.next(null);
  }
}

