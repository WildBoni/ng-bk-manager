import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { BarecodeScannerLivestreamComponent } from 'ngx-barcode-scanner';

import { BookService } from '../books/book.service';
import { GoogleBookApiService } from '../google-book-api.service';
// import { Book } from '../book';

import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.css']
})
export class ScannerComponent implements AfterViewInit {
  @ViewChild(BarecodeScannerLivestreamComponent)
  BarecodeScanner: BarecodeScannerLivestreamComponent;
  barcodeValue;

  books: any[];

  constructor(
    private googleBookApiService: GoogleBookApiService,
    private bookService: BookService
  ) {}

  ngAfterViewInit() {
    this.BarecodeScanner.start();
  }

  onValueChanges(value){
    this.barcodeValue = value.code;
    this.BarecodeScanner.stop();
    this.searchResult(this.barcodeValue);
  }

  onAddBook(title: string, authors: string[], id: string) {
    this.bookService.addBook(title, authors);
    const updatedBooks = this.books.filter(book => book.id !== id);
    this.books = updatedBooks;
  }

  searchResult(ean) {
    this.googleBookApiService.searchBooksByEan(ean)
      .subscribe(result => {
        this.books = result;
        console.log(this.books);
      })
  }

}
