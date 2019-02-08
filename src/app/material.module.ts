import { NgModule } from '@angular/core';
import {
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatDividerModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatTabsModule,
    MatBadgeModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatListModule,
    MatRippleModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatStepperModule
} from '@angular/material';

@NgModule({
  imports: [MatButtonModule,MatCardModule,MatInputModule,MatToolbarModule,MatDividerModule,MatToolbarModule,MatIconModule,MatMenuModule,MatTabsModule,MatBadgeModule,MatCheckboxModule,MatSlideToggleModule,MatListModule,MatRippleModule,MatSnackBarModule,MatProgressSpinnerModule,MatStepperModule],
  exports: [MatButtonModule,MatCardModule,MatInputModule,MatToolbarModule,MatDividerModule,MatToolbarModule,MatIconModule,MatMenuModule,MatTabsModule,MatBadgeModule,MatCheckboxModule,MatSlideToggleModule,MatListModule,MatRippleModule,MatSnackBarModule,MatProgressSpinnerModule,MatStepperModule],
})
export class MaterialModule { }