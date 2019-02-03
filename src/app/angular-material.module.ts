import { NgModule } from '@angular/core';

import {
  MatButtonModule,
  MatListModule,
  MatIconModule,
  MatInputModule,
  MatCardModule,
  MatToolbarModule,
  MatSidenavModule,
  MatProgressSpinnerModule,
  MatExpansionModule,
  MatDialogModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatSnackBarModule,
  MAT_SNACK_BAR_DATA
} from "@angular/material";

@NgModule({
  exports: [
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatToolbarModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DATA, useValue: {duration: 2500}}
  ]
})
export class AngularMaterialModule {}
