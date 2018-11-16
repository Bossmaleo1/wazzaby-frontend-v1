import { NgModule } from '@angular/core';
import { MatButtonModule,MatCardModule,MatInputModule,MatDividerModule,MatToolbarModule,MatIconModule,MatMenuModule,MatTabsModule,MatBadgeModule,MatCheckboxModule,MatSlideToggleModule,MatListModule,MatRippleModule } from '@angular/material';

@NgModule({
  imports: [MatButtonModule,MatCardModule,MatInputModule,MatToolbarModule,MatDividerModule,MatToolbarModule,MatIconModule,MatMenuModule,MatTabsModule,MatBadgeModule,MatCheckboxModule,MatSlideToggleModule,MatListModule,MatRippleModule],
  exports: [MatButtonModule,MatCardModule,MatInputModule,MatToolbarModule,MatDividerModule,MatToolbarModule,MatIconModule,MatMenuModule,MatTabsModule,MatBadgeModule,MatCheckboxModule,MatSlideToggleModule,MatListModule,MatRippleModule],
})
export class MaterialModule { }