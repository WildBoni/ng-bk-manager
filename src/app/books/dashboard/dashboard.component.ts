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
  favBooks: Book[] = [];
  private bookSub: Subscription;

  constructor(public bookService: BookService) {}

  ngOnInit() {
    this.bookService.getBooks();
    this.bookSub = this.bookService.getBooksUpdateListener()
      .subscribe((books: Book[]) => {
        this.favBooks = books.filter(bookFav => bookFav.favourite === true);
        this.books = books.slice(0,5);
      });
  }

  onToggleFav(favBookId: string, favBookFav: boolean) {
    this.bookService.toggleFav(favBookId, !favBookFav);
  }

  ngOnDestroy() {
    this.bookSub.unsubscribe();
  }
}
