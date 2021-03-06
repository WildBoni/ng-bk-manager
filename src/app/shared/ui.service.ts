import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { MatDialog } from '@angular/material';
import { DialogComponent } from './dialog/dialog.component';

@Injectable({
  providedIn: 'root'
})
export class UIService {
  private scanStatus = new Subject<boolean>();
  private deleteStatus = new Subject<boolean>();
  private addStatus = new Subject<boolean>();

  // loadingStateChanged = new Subject<boolean>();
  constructor(
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) {}

  getScanStatusListener() {
    return this.scanStatus.asObservable();
  }

  getDeleteStatusListener() {
    return this.deleteStatus.asObservable();
  }

  getAddStatusListener() {
    return this.addStatus.asObservable();
  }

  showSnackbar(message, action, duration) {
    const snackBarRef = this.snackbar.open(
      message,
      action,
      {duration: duration}
    );

    snackBarRef.onAction().subscribe(() => {
      switch(action) {
        case "Back to Books": {
          this.router.navigate(["/books"]);
          break;
        }
        case "Login": {
          this.router.navigate(["/auth/login"]);
          break;
        }
        default: {
          console.log("default");
          break;
        }
      }
    });

    // snackBarRef.afterDismissed().subscribe(() => {
    //   console.log('The snack-bar was dismissed');
    // });
  }

  showGoToLoginDialog(
    title: string,
    description: string,
    goToLogin: boolean
  ) {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          title: title,
          description: description,
          goToLogin: goToLogin
        }
      })
  }

  showDialog(
    title: string,
    description: string,
    goToBooks: boolean,
    addAnotherBook: boolean,
    scanAgain: boolean,
    confirmDelete: boolean,
    cancelDelete: boolean,
    confirmAdd: boolean
  ) {
    // const dialogConfig = new MatDialogConfig();
    //
    // dialogConfig.data = {
    // };

    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: title,
        description: description,
        goToBooks: goToBooks,
        addAnotherBook: addAnotherBook,
        scanAgain: scanAgain,
        confirmDelete: confirmDelete,
        cancelDelete: cancelDelete,
        confirmAdd: confirmAdd
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      switch(result) {
        case "start": {
          this.scanStatus.next(true);
          break;
        }
        case "delete": {
          this.deleteStatus.next(true);
          break;
        }
        case "add": {
          this.addStatus.next(true);
          break;
        }
        default: {
          console.log("default");
          break;
        }
      }
    });

  }
}
