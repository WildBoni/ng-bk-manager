import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';

import { BookService } from '../books/book.service';
import { GoogleBookApiService } from '../google-book-api.service';
// import { LocalBookService } from '../local-book.service';

import { Book } from '../books/book.model';

import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  book: any[];
  books: any[];
  private modelChanged: Subject<string> = new Subject<string>();
  private subscription: Subscription;
  debounceTime = 500;

  displayedColumns: string[] = ['image', 'title', 'authors', 'languages',
    'categories', 'pageCount', 'publisher', 'publisherDate', 'previewLink', 'add'];
  dataSource = new MatTableDataSource<Book>();

  // @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private googleBookApiService : GoogleBookApiService,
    private bookService: BookService,
    // private localBookService : LocalBookService
  ) { }

  ngOnInit() {
    this.subscription = this.modelChanged
      .pipe(
        debounceTime(this.debounceTime),
      )
      .subscribe((value) => {
        this.OnSearch(value);
      });
  }

  inputChanged(value) {
    this.modelChanged.next(value);
  }

  OnSearch(s) {
    this.googleBookApiService.searchBooks(s)
      .subscribe((data) => {
        this.dataSource.data = data.items;
        this.books = data.items;
        this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
      });
  }

  onAddBook(id: string, title: string, authors: string[], thumbnail: string,
    languages: string[], categories: string[], pageCount: number, 
    publisher: string, publisherDate: string, previewLink: string) {
    this.bookService.addBook(title, authors, thumbnail, languages, categories,
      pageCount, publisher, publisherDate, previewLink);
    const updatedBooks = this.books.filter(book => book.id !== id);
    this.books = updatedBooks;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
