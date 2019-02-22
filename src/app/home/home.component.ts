import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { AuthService } from "../auth/auth.service";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLoading = false;
  userIsAuthenticated = false;
  private authListenerSub: Subscription;
  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.isLoading = true;

    this.userIsAuthenticated = this.authService.getIsAuth();
    if(this.userIsAuthenticated ) {
      this.router.navigate(["/dashboard"]);
    }
  }
}
