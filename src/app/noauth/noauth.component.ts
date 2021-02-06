import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-noauth',
  templateUrl: './noauth.component.html',
  styleUrls: ['./noauth.component.css']
})
export class NoauthComponent implements OnInit {
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
