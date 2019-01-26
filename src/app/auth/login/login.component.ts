import { Component, OnInit, OnDestroy } from '@angular/Core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
  styleUrls: ['./login.component.css'],
  templateUrl: './login.component.html'
})

export class LoginComponent {
  isLoading = false;
  private authStatusSub: Subscription;


  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onLogin(form: NgForm) {
    if(form.invalid) {
      return;
    }
    this.authService.login(form.value.email, form.value.password);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
