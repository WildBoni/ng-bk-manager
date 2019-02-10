import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from './../angular-material.module';

import { HeaderComponent } from './header/header.component';
import { SidenavListComponent } from './sidenav/sidenav-list.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SidenavListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AngularMaterialModule,
    RouterModule
  ],
  exports: [
    HeaderComponent,
    SidenavListComponent
  ]
})
export class NavigationModule {}
