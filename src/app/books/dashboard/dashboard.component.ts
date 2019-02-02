import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Book } from '../book.model';
import { BookService } from '../book.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  private bookSub: Subscription;

  constructor(public bookService: BookService) {}

  ngOnInit() {
    this.bookService.getBooks();
    this.bookSub = this.bookService.getBookUpdateListener()
      .subscribe((books: Book[]) => {
        this.books = books.slice(0,5);
      });
  }

  ngOnDestroy() {
    this.bookSub.unsubscribe();
  }
}
