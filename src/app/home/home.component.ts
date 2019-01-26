import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';

import { Book } from '../books/book.model';
import { BookService } from '../books/book.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  enteredTitle = "";
  enteredAuthors = "";
  books: Book[] = [];
  private booksSub: Subscription;

  constructor(public bookService: BookService) { }

  ngOnInit() {
    this.bookService.getBooks();
    this.booksSub = this.bookService.getBookUpdateListener()
      .subscribe((books: Book[]) => {
        this.books = books.slice(0,2);
      });
  }

    ngOnDestroy() {
      this.booksSub.unsubscribe();
    }

}
