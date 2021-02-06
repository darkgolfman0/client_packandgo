import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services';

@Component({
  selector: 'app-session-expired',
  templateUrl: './session-expired.component.html',
  styleUrls: ['./session-expired.component.css']
})
export class SessionExpiredComponent implements OnInit {
  
  ngOnInit(): void {
    this.authenticationService.logout();
  }

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService) { }

  login(): void {
    this.router.navigate(['login']);

  }
}
