import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})

export class DialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
  ) { }

  goToBooks: boolean = this.data.goToBooks;
  addAnotherBook: boolean = this.data.addAnotherBook;
  scanAgain: boolean = this.data.scanAgain;

  navigateTo(){
    this.dialogRef.close();
    this.router.navigate(["/books"]);
  }

  scanAnother(){
    this.dialogRef.close("start");
  }
}
