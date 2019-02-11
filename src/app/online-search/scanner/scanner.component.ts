import { Component, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { BarecodeScannerLivestreamComponent } from 'ngx-barcode-scanner';

import { BookService } from '../../books/book.service';
import { UIService } from '../../shared/ui.service';
import { GoogleBookApiService } from '../google-book-api.service';
// import { Book } from '../book';

import { Subscription, Observable, of } from 'rxjs';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.css']
})
export class ScannerComponent implements AfterViewInit, OnDestroy {
  @ViewChild(BarecodeScannerLivestreamComponent)
  BarecodeScanner: BarecodeScannerLivestreamComponent;
  barcodeValue;

  books: any[];
  private scanSub: Subscription;

  constructor(
    private googleBookApiService: GoogleBookApiService,
    private bookService: BookService,
    private uiService: UIService
  ) {}

  ngAfterViewInit() {
    this.BarecodeScanner.start();
  }

  onValueChanges(value){
    this.barcodeValue = value.code;
    this.BarecodeScanner.stop();
    this.searchResult(this.barcodeValue);
  }

  onAddBook(id: string, title: string, authors: string[], thumbnail: string,
    languages: string[], categories: string[], pageCount: number,
    publisher: string, publishedDate: string, previewLink: string, ean13: string) {
    this.scanSub = this.uiService.getScanStatusListener()
      .subscribe((status: boolean) => {
          if(status === true) {
            this.BarecodeScanner.start();
          }
        });
    this.bookService.addBook("scan", title, authors, thumbnail, languages, categories,
      pageCount, publisher, publishedDate, previewLink, ean13);
    const updatedBooks = this.books.filter(book => book.id !== id);
    this.books = updatedBooks;

  }

  searchResult(ean) {
    this.googleBookApiService.searchBooksByEan(ean)
      .subscribe(result => {
        let updatedData = result.map((item) => {
          let thumbnail = item.volumeInfo.imageLinks.thumbnail;
          if(thumbnail){
            thumbnail = thumbnail.slice(0, 4) + "s" + thumbnail.slice(4);
            item.thumbnail = thumbnail;
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
        });
        this.books = result;
      })
  }

  ngOnDestroy() {
    this.scanSub.unsubscribe();
  }

}
