import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';
declare var FB: any;

@Component({
  styleUrls: ['./signup.component.css'],
  templateUrl: './signup.component.html'
})

export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    (window as any).fbAsyncInit = function() {
      FB.init({
        appId      : '375502226629393',
        cookie     : true,
        xfbml      : true,
        version    : 'v3.1'
      });
      FB.AppEvents.logPageView();
    };

    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "https://connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));

    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onSignup(form: NgForm) {
    if(form.invalid) {
      return;
    }
    this.authService.createUser(
      form.value.email,
      form.value.password
    );
  }

  onFbLogin(){
    FB.login((response)=> {
      if (response.authResponse) {
        const fbToken = response.authResponse.accessToken;
        const userId = response.authResponse.userID;
        FB.api('/me', {fields: 'id,name,email'}, (response) => {
          this.authService.fbLogin(response.email, fbToken, userId);
        });
      } else {
        console.log('User login failed');
      }
    }, {scope: 'email'});
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
