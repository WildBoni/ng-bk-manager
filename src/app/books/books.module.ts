import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../angular-material.module';

import { BookDetailComponent } from './book-detail/book-detail.component';
import { BookListComponent } from './book-list/book-list.component';
import { BookCreateComponent } from './book-create/book-create.component';
import { BookSearchComponent } from './book-search/book-search.component';

@NgModule({
  declarations: [
    BookDetailComponent,
    BookListComponent,
    BookCreateComponent,
    BookSearchComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})

export class BooksModule { }
