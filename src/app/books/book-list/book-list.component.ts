import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

import { Subscription } from 'rxjs';

import { Book } from '../book.model';
import { BookService } from '../book.service';
// import { AuthService } from '../../auth/auth.service';

import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class BookListComponent implements OnInit, OnDestroy {
  // books: Book[] = [];
  searchValue="";
  emptyLibrary: boolean;
  isLoading = false;
  // userIsAuthenticated = false;
  // userId: string;
  private booksSub: Subscription;
  // private authStatusSub: Subscription;

  // bookFav: boolean = false;
  // bookId: string;
  private bookSub: Subscription;

  displayedColumns: string[] = ['image', 'title', 'authors'];
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
    private bookService: BookService
    // private authService: AuthService
  ) { }

  ngOnInit() {

    this.bookSub = this.bookService.getBookUpdateListener()
    .subscribe((book: any) => {
      let bookFav = book.favourite;
      let bookId = book.id;
      this.updateFav(bookId, bookFav);
    });

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
    // this.userId = this.authService.getUserId();

    // this.userIsAuthenticated = this.authService.getIsAuth();
    // this.authStatusSub = this.authService.getAuthStatusListener()
    //   .subscribe(isAuthenticated => {
    //     this.userIsAuthenticated = isAuthenticated;
    //     this.userId = this.authService.getUserId();
    //   })
  }

  doFilter(filterValue: string) {
    this.searchValue = filterValue;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onDelete(bookId: string) {
    this.isLoading = true;
    this.bookService.deleteBook(bookId).subscribe(() => {
      this.bookService.getBooks();
    });
  }

  onToggleFav(bookId: string, bookFav: boolean) {
    // this.isLoading = true;
    this.bookService.toggleSingleFav(bookId, !bookFav);
  }

  updateFav(bookId: string, bookFav: boolean) {
    const bookData = [...this.dataSource.data];
    let favBook = bookData.find(book => book.id == bookId);
    favBook.favourite = bookFav;
  }

  ngOnDestroy() {
    this.bookSub.unsubscribe();
    this.booksSub.unsubscribe();
    // this.authStatusSub.unsubscribe();
  }

}
