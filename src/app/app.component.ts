import { Component, OnInit, Directive } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import {
  MultiselectDropdownModule,
  IMultiSelectSettings,
  IMultiSelectTexts,
  IMultiSelectOption
} from 'angular-2-dropdown-multiselect';

import 'rxjs/add/operator/toPromise';

import { GridOptions } from 'ag-grid';
import { FirebaseComponent } from './firebase/firebase.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  constructor() {
  }
}
