import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

    constructor(
        private routes: Router,
        private authenticationService: AuthenticationService
    ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (localStorage.getItem('userProfile') != null) {
      return true;
    } else {
      this.routes.navigate(['']);
      return false;
    }
  }
}
