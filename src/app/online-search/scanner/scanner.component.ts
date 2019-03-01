import { Component, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { BarecodeScannerLivestreamComponent } from 'ngx-barcode-scanner';
import { Location } from '@angular/common';

import { BookService } from '../../books/book.service';
import { UIService } from '../../shared/ui.service';
import { GoogleBookApiService } from '../google-book-api.service';
// import { Book } from '../book';

import { Subscription } from 'rxjs';

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
  private addSub: Subscription;
  private apiSub: Subscription;
  private getBookSub: Subscription;

  constructor(
    private googleBookApiService: GoogleBookApiService,
    private bookService: BookService,
    private location: Location,
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

  scanAgain() {
    this.books = [];
    this.barcodeValue = "";
    this.BarecodeScanner.start();
  }

  onAddBook(id: string, title: string, authors: string[], thumbnail: string,
    languages: string[], categories: string[], pageCount: number,
    publisher: string, publishedDate: string, previewLink: string, ean13: string,
    favourite: boolean = false) {
    this.scanSub = this.uiService.getScanStatusListener()
      .subscribe((status: boolean) => {
          if(status === true) {
            this.books = [];
            this.barcodeValue = "";
            this.BarecodeScanner.start();
          }
        });
    this.bookService.addBook("scan", title, authors, thumbnail, languages, categories,
      pageCount, publisher, publishedDate, previewLink, ean13, favourite);
    // const updatedBooks = this.books.filter(book => book.id !== id);
    // this.books = updatedBooks;

  }

  searchResult(ean) {
    if(this.apiSub) {
      this.apiSub.unsubscribe();
    }
    if(this.getBookSub) {
      this.getBookSub.unsubscribe();
    }
    if(this.addSub) {
      this.addSub.unsubscribe();
    }
    if(ean != "") {
      this.getBookSub = this.bookService.getBookByEan(ean)
        .subscribe(result => {
          if(result.found == true) {
            this.bookService.addAnywayDialog();
            this.addSub = this.uiService.getAddStatusListener()
              .subscribe((status: boolean) => {
                if(status === true) {
                  this.searchByEan(ean);
                }
              });
          } else {
            this.searchByEan(ean);
          }
        })
    } else {
      this.books = [];
    }
  }

  searchByEan(ean) {
    this.apiSub = this.googleBookApiService.searchBooksByEan(ean)
      .subscribe(result => {
        result.map((item) => {
          if(item.volumeInfo.imageLinks) {
            if(item.volumeInfo.imageLinks.thumbnail) {
              let thumbnail = item.volumeInfo.imageLinks.thumbnail;
              thumbnail = thumbnail.slice(0, 4) + "s" + thumbnail.slice(4);
              item.thumbnail = thumbnail;
            } else {
              item.thumbnail = "none";
            }
          } else {
            item.thumbnail = "none";
          }
          if(item.volumeInfo.industryIdentifiers) {
            let ean13 = item.volumeInfo.industryIdentifiers
            .find(f => f.type == "ISBN_13");
            if(ean13){
              item.ean13 = ean13.identifier;
            } else {
              item.ean13 = "";
            }
          } else {
            item.ean13 = "";
          }
        });
        this.books = result;
      });
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy() {
    this.BarecodeScanner.stop();
    if(this.scanSub) {
      this.scanSub.unsubscribe();
    }
    if(this.addSub) {
      this.addSub.unsubscribe();
    }
  }

}
