import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';
import { EncrDecrService } from '../services/encr-decr.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  submitted = false;
  error = '';
  username: string = '';
  password: string = '';
  rememberCred: boolean = true;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private toast: MatSnackBar,
    private EncrDecr: EncrDecrService) { }

  ngOnInit() {
    this.authenticationService.logout();
    try {
      this.username = this.EncrDecr.get(localStorage.getItem('departmentUnit'));
      this.password = this.EncrDecr.get(localStorage.getItem('organizationUnit'));      
    } catch (error) {
      this.username = "";
      this.password = "";   
    }
  }

  login(): void {
    let uname = this.username;
    let p = this.password;
    if (this.rememberCred == true) {
      localStorage.setItem('departmentUnit', this.EncrDecr.set(uname));
      localStorage.setItem('organizationUnit', this.EncrDecr.set(p));
    } else {
      localStorage.removeItem('departmentUnit');
      localStorage.removeItem('organizationUnit');
    }

    console.log(uname, p);
    if ((uname == '') || (p == '')) {
      this.toast.open('Please enter username and password', '', {
        duration: 2000,
        panelClass: ['snackBarError'],
        verticalPosition: 'top',
      });
      return;
    }
    localStorage.setItem('username', uname);
    this.submitted = true;

    this.authenticationService.login(uname, p)
      .pipe(first())
      .subscribe(
        data => {
          this.userService.getByUsername(uname).pipe(first()).subscribe(tempUser => {
            console.log({ 'userInfo': tempUser });
            localStorage.setItem('userProfile', JSON.stringify(tempUser));
            this.router.navigate(['dashboards']);
          });
        },
        error => {
          console.log({ 'error': error });
          this.error = 'Invalid username or password';
          this.toast.open('Invalid username or password', 'Please try again.', {
            duration: 2000,
            panelClass: ['snackBarError'],
            verticalPosition: 'top',
          });
        }
      );
  }
}
