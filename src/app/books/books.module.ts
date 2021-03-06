import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../angular-material.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { BookListComponent } from './book-list/book-list.component';
import { BookCreateComponent } from './book-create/book-create.component';
import { BookDetailComponent } from './book-detail/book-detail.component';

@NgModule({
  declarations: [
    DashboardComponent,
    BookListComponent,
    BookCreateComponent,
    BookDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})

export class BooksModule { }
