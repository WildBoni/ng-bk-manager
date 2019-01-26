import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { BookSearchComponent } from './books/book-search/book-search.component';
import { BookDetailComponent } from './books/book-detail/book-detail.component';
import { BookCreateComponent } from './books/book-create/book-create.component';
import { BookListComponent } from './books/book-list/book-list.component';
import { ScannerComponent } from './scanner/scanner.component';
import { AuthGuard } from './auth/auth.guard';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'search', component: SearchComponent },
  { path: 'books', component: BookListComponent, canActivate: [AuthGuard] },
  { path: 'insert', component: BookCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:bookId', component: BookCreateComponent, canActivate: [AuthGuard] },
  { path: 'scanner', component: ScannerComponent },
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
  { path: 'auth', loadChildren: "./auth/auth.module#AuthModule"}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class AppRoutingModule {}
