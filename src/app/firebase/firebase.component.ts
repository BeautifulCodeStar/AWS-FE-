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
import { AgGridComponent } from '../ag-grid/ag-grid.component';

@Component({
  selector: 'app-firebase',
  templateUrl: './firebase.component.html',
  styleUrls: ['./firebase.component.css']
})

export class FirebaseComponent implements OnInit {

  items: FirebaseListObservable<any[]>;
  data: any[];
  optionsModel: number[] = [];
  optionsModel1: number[] = [];

  exchange: IMultiSelectOption[] = [];
  symbol: IMultiSelectOption[] = [];
  agGrid: any[] = [];
  rowData: any[];
  private gridOptions: GridOptions;
  private settings: IMultiSelectSettings = {
    selectionLimit: 300,
    dynamicTitleMaxItems: 0,
  };
  private myTexts: IMultiSelectTexts = {
    defaultTitle: 'Select Items'
  };

  constructor(firebaseDB: AngularFireDatabase) {
    this.gridOptions = <GridOptions>{};
    this.gridOptions.columnDefs = [
        {
            headerName: 'Exchange',
            field: 'Exchange',
            width: 300
        },
        {
            headerName: 'Symbol',
            field: 'Symbol',
            width: 300
        },
        {
            headerName: 'Trade',
            field: 'Trade',
            width: 300
        },
        {
            headerName: 'Price',
            field: 'Price',
            width: 100
        },
        {
            headerName: 'Date_Time',
            field: 'Date',
            width: 300
        }

    ];
    this.gridOptions.rowData = [];

    this.items = firebaseDB.list('/status');
    this.items.forEach(val => {
      this.data = val;
      this.start();
    });
  }


  ngOnInit() {}

  start() {
    const exchangeArr = this.data[0][1]['data'];
    console.log(exchangeArr);
    this.exchange = [];
    this.symbol = [];
    exchangeArr.forEach((val, ind) => {
      let flag = false;
      if (this.exchange.length > 0) {
        this.exchange.forEach((exc, index) => {
          if (val['Exchange'] === exc['name']) {
            flag = true;
          }
        });
      }
      if (!flag) {
        this.exchange[this.exchange.length] = {
          id: this.exchange.length,
          name: val['Exchange'],
        };
      }
      this.symbol[ind] = {
        id: ind,
        name: val['Symbol'],
      };
    });
    this.filter();
  }

  added(event) {
    const compare = this.optionsModel.filter(val => event === val);
    if (!compare)  {
      this.optionsModel.push(event);
    }
    this.filter();
  }
  removed(event) {
    this.optionsModel.filter(val => val !== event);
    console.log(this.optionsModel.length)
    if (this.optionsModel.length === 0) {
      this.optionsModel1 = [];
    }
    this.filter();
  }

  addGridItems(event) {
    const compare = this.optionsModel1.filter(val => event === val);
    if (!compare)  {
      this.optionsModel1.push(event);
    }
    this.filterGrid();
  }
  removeGridItems(event) {
    this.optionsModel1.filter(val => val !== event);
    this.filterGrid();
  }

  filter() {
    this.symbol = [];
    const exchangeArr = this.data[0][1]['data'];
    exchangeArr.forEach((val, ind) => {
      this.optionsModel.forEach(opt => {
        if (this.exchange[opt]['name'] === val['Exchange']) {
          this.symbol[this.symbol.length] = {
            id: this.symbol.length,
            name: val['Symbol'],
          };
        }
      });
    });
    this.filterGrid();
  }

  filterGrid() {
    this.rowData = this.agGrid = [];
    const symbolArr = this.data[0][1]['data'];
    if (this.optionsModel1.length > 0) {
      this.optionsModel1.forEach((opt, index) => {
        const value = symbolArr.filter(x => this.symbol[opt]['name'] === x['Symbol'])
        if (value) {
          this.agGrid[this.agGrid.length] = {
            Exchange: value[0]['Exchange'],
            Symbol: value[0]['Symbol'],
            Trade: value[0]['Trade'],
            Price: value[0]['Price'],
            Date: value[0]['Date']
          };
          this.rowData = this.agGrid;
        }
      });
    }

  }

  onCellClicked(event) {
    console.log('cellClicked', event);
  }

  onCellDoubleClicked(event) {
    console.log('cellDblClicked', event);
  }
}
