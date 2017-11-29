import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { environment } from '../environments/environment';
import { NoConflictStyleCompatibilityMode  } from 'md2';
import { Ng2MultiStepFormRoutingModule } from './routing.module';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';

import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
  MATERIAL_COMPATIBILITY_MODE
} from '@angular/material';

import { DataService } from './services/data.service';
import { WindowService } from './services/window.service';

import { AppComponent } from './app.component';
import { RankComponent, DetailsDialogComponent } from './rank/rank.component';
import { AsinComponent, AsinDialogComponent } from './asin/asin.component';
import { DetailsComponent } from './details/details.component';

@NgModule({
  exports: [
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule
  ]
})

export class MaterialModule {}

@NgModule({
  declarations: [
    AppComponent,
    DetailsDialogComponent,
    RankComponent,
    AsinDialogComponent,
    AsinComponent,
    DetailsComponent
  ],
  imports: [
    BrowserModule,
    NoConflictStyleCompatibilityMode,
    FormsModule,
    ReactiveFormsModule,
    Ng2MultiStepFormRoutingModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    HttpModule,
    MaterialModule,
    Ng2GoogleChartsModule
  ],
  providers: [
    DataService,
    WindowService,
    {
      provide: MATERIAL_COMPATIBILITY_MODE,
      useValue: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [DetailsDialogComponent, AsinDialogComponent]
})
export class AppModule {}
