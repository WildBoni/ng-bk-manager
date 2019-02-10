import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { FlexLayoutModule } from '@angular/flex-layout';

import { BarecodeScannerLivestreamModule } from 'ngx-barcode-scanner';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularMaterialModule } from './angular-material.module';
import { BooksModule } from './books/books.module';
import { NavigationModule } from './navigation/navigation.module';

import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorComponent } from './shared/error/error.component';
import { ErrorInterceptor } from './shared/error/error-interceptor';

import { SearchComponent } from './online-search/search/search.component';
import { HomeComponent } from './home/home.component';
import { ScannerComponent } from './online-search/scanner/scanner.component';

import { DialogComponent } from './shared/dialog/dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    HomeComponent,
    ScannerComponent,
    ErrorComponent,
    DialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    BarecodeScannerLivestreamModule,
    HttpModule,
    HttpClientModule,
    AngularMaterialModule,
    // FlexLayoutModule,
    BooksModule,
    NavigationModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent, DialogComponent]
})
export class AppModule { }
