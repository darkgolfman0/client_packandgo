import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services';
import { EncrDecrService } from '../services/encr-decr.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-changpassword',
  templateUrl: './changpassword.component.html',
  styleUrls: ['./changpassword.component.scss']
})
export class ChangpasswordComponent implements OnInit {
  username: string = '';
  password: string = '';
  newpassword: string = '';
  confirmpassword: string = '';
  constructor(private route: Router, private authenticationService: AuthenticationService, private EncrDecr: EncrDecrService, private toast: MatSnackBar) { }

  ngOnInit() {
    // this.authenticationService.logout();
    this.username = this.EncrDecr.get(localStorage.getItem('departmentUnit'));
    this.password = this.EncrDecr.get(localStorage.getItem('organizationUnit'));
    console.log(this.username, this.password)
  }

  backButton() {
    this.route.navigate(['dashboards'])
  }

  changePassword() {
    let p = this.password
    let np = this.newpassword
    let cp = this.confirmpassword
    if ((p == '') || (np == '') || (cp == '')) {
      this.toast.open('Please enter password', '', {
        duration: 2000,
        panelClass: ['snackBarError'],
        verticalPosition: 'top',
      });
      return;
    }
    if(np == cp){
      this.authenticationService.changPassword(this.username, p, np).subscribe(res => {
        this.route.navigate(['login'])
      })
    }else{
      this.toast.open('confrim password is not match', '', {
        duration: 2000,
        panelClass: ['snackBarError'],
        verticalPosition: 'top',
      });
      return;
    }
  }

}
