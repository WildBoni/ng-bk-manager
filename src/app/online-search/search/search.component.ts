import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';

import { BookService } from '../../books/book.service';
import { GoogleBookApiService } from '../google-book-api.service';
// import { LocalBookService } from '../local-book.service';

import { Book } from '../../books/book.model';

import { Subject, Subscription } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';

import { MatTableDataSource, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  book: any[];
  // books: any[];
  private modelChanged: Subject<string> = new Subject<string>();
  private subscription: Subscription;
  debounceTime = 500;

  displayedColumns: string[] = ['image', 'title', 'authors', 'languages',
    'categories', 'pageCount', 'publisher', 'publishedDate', 'previewLink',
    'ean13', 'add'];
  dataSource = new MatTableDataSource<Book>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private googleBookApiService : GoogleBookApiService,
    private bookService: BookService,
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
        let updatedData = data.items.map((item) => {
          let thumbnail = item.volumeInfo.imageLinks.thumbnail;
          if(thumbnail){
            thumbnail = thumbnail.slice(0, 4) + "s" + thumbnail.slice(4);
            item.thumbnail = thumbnail;
            console.log(thumbnail);
          } else {
            item.thumbnail = "none";
          }
          let ean13 = item.volumeInfo.industryIdentifiers
            .find(f => f.type === "ISBN_13");
          if(ean13){
            item.ean13 = ean13.identifier;
          } else {
            item.ean13 = "";
          }
          console.log(item);
        });
        this.dataSource.data = data.items;
        this.dataSource.paginator = this.paginator;
      });
  }

  onAddBook(id: string, title: string, authors: string[], thumbnail: string,
    languages: string[], categories: string[], pageCount: number,
    publisher: string, publishedDate: string, previewLink: string, ean13: string) {
    this.bookService.addBook("search", title, authors, thumbnail, languages, categories,
      pageCount, publisher, publishedDate, previewLink, ean13);
    const updatedBooks = this.dataSource.data.filter(book => book.id !== id);
    this.dataSource.data = updatedBooks;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
