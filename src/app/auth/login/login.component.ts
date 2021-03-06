import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';

declare var FB: any;

@Component({
  styleUrls: ['./login.component.css'],
  templateUrl: './login.component.html'
})


export class LoginComponent {
  isLoading = false;
  private authStatusSub: Subscription;


  constructor(
    public authService: AuthService,
    public _zone: NgZone
  ) {}

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

  onLogin(form: NgForm) {
    if(form.invalid) {
      return;
    }
    this.authService.login(form.value.email, form.value.password);
  }

  onFbLogin(){
    FB.login((response)=> {
      if (response.authResponse) {
        const fbToken = response.authResponse.accessToken;
        const userId = response.authResponse.userID;
        FB.api('/me', {fields: 'id,name,email'}, (response) => {
          this._zone.run(()=>{
            this.authService.fbLogin(response.email, fbToken, userId);
          });
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
