import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Book } from '../book.model';
import { BookService } from '../book.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  isLoading = false;
  userIsAuthenticated = false;
  userId: string;
  private booksSub: Subscription;
  private authStatusSub: Subscription

  constructor(
    private bookService: BookService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.bookService.getBooks();
    this.userId = this.authService.getUserId();
    this.booksSub = this.bookService.getBookUpdateListener()
      .subscribe((books: Book[]) => {
        this.isLoading = false;
        this.books = books;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      })
  }

  onDelete(bookId: string) {
    this.isLoading = true;
    this.bookService.deleteBook(bookId).subscribe(() => {
      this.bookService.getBooks();
    });
  }

  ngOnDestroy() {
    this.booksSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}
