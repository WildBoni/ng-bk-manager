import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild
} from '@angular/core';

import { Subscription } from 'rxjs';

import { Book } from '../book.model';
import { BookService } from '../book.service';
import { AuthService } from '../../auth/auth.service';

import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit, OnDestroy {
  // books: Book[] = [];
  emptyLibrary: boolean;
  isLoading = false;
  userIsAuthenticated = false;
  userId: string;
  private booksSub: Subscription;
  private authStatusSub: Subscription


  displayedColumns: string[] = ['fav', 'image', 'title', 'authors', 'edit', 'delete'];
  dataSource = new MatTableDataSource<Book>();

  private paginator: MatPaginator;
  private sort: MatSort;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  constructor(
    private bookService: BookService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.booksSub = this.bookService.getBooksUpdateListener()
      .subscribe((books: Book[]) => {
          this.isLoading = false;
          this.dataSource.data = books;
          if(books.length > 0) {
            this.emptyLibrary = false;
          } else {
            this.emptyLibrary = true;
          }
        });
    this.bookService.getBooks();
    this.userId = this.authService.getUserId();

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      })
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onDelete(bookId: string) {
    this.isLoading = true;
    this.bookService.deleteBook(bookId).subscribe(() => {
      this.bookService.getBooks();
    });
  }

  onToggleFav(bookId: string, bookFav: boolean) {
    this.isLoading = true;
    this.bookService.toggleFav(bookId, !bookFav);
  }

  ngOnDestroy() {
    this.booksSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}
