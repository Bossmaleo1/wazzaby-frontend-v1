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
    MatStepperModule, MatDatepickerModule, MatNativeDateModule, MatRadioModule,MatProgressBarModule
} from '@angular/material';

@NgModule({
  imports: [MatButtonModule,MatCardModule,MatInputModule,MatToolbarModule,MatDividerModule,MatToolbarModule,MatIconModule,MatMenuModule,MatTabsModule,MatBadgeModule,MatCheckboxModule,MatSlideToggleModule,MatListModule,MatRippleModule,MatSnackBarModule,MatProgressSpinnerModule,MatStepperModule,MatDatepickerModule,MatNativeDateModule,MatRadioModule,MatProgressBarModule],
  exports: [MatButtonModule,MatCardModule,MatInputModule,MatToolbarModule,MatDividerModule,MatToolbarModule,MatIconModule,MatMenuModule,MatTabsModule,MatBadgeModule,MatCheckboxModule,MatSlideToggleModule,MatListModule,MatRippleModule,MatSnackBarModule,MatProgressSpinnerModule,MatStepperModule,MatDatepickerModule,MatNativeDateModule,MatRadioModule,MatProgressBarModule],
})
export class MaterialModule { }