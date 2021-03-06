import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

import { AngularMaterialModule } from '../angular-material.module';
import { AuthRoutingModule } from './auth-routing.module';

import { environment } from '../../environments/environment';

// const BACKEND_URL = environment.recaptcha;

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AngularMaterialModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    AuthRoutingModule
  ],
  providers: [{
  provide: RECAPTCHA_SETTINGS,
  useValue: {
    siteKey: '6LfSwZMUAAAAANAc6Nf302V_Umn2UuA38QuUEhWR'
  } as RecaptchaSettings,
}]
})
export class AuthModule {}
