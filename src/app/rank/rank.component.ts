import { Component, OnInit, Directive, Inject } from '@angular/core';
import { MatRadioModule } from '@angular/material';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import * as $ from 'jquery';
import { DataService } from '../services/data.service';
import { WindowService } from '../services/window.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-rank-checker',
  templateUrl: './rank.component.html',
  styleUrls: ['./rank.component.css']
})
export class RankComponent implements OnInit {
  products: any[];
  temp: any[];
  confirm: any;
  search: any;

  options: Object;

  constructor(
    private http: Http,
    public dialog: MatDialog,
    private service: DataService,
    private router: Router
  ) {
    this.getProducts();
  }

  ngOnInit() {}

  getProducts() {
    const that = this;
    return this.http
      .get(this.service.apiUrl + '?getproducts=asin')
      .subscribe(res => {
        const products = res.json();
        if (products && products.length > 0) {
          that.temp = products;
          that.drawChart(products);
        }
      });
  }

  rankingAvg(avg) {
    if (avg && avg.length > 0) {
      return Math.round(parseFloat(avg[avg.length - 1][1]));
    } else {
      return false;
    }
  }

  filter(keyword) {
    this.products = this.temp.filter(item =>
      item.asin
        .toLowerCase()
        .indexOf(
          keyword.toLowerCase()
        ) !== -1 || item.title
        .toLowerCase()
        .indexOf(keyword.toLowerCase()) !== -1);
  }

  sortUp(item) {
    this.products.sort((a, b) => {
      if (item === 'title' || item === 'stock') {
        const first = a[item].toUpperCase();
        const second = b[item].toUpperCase();
        if (first > second) {
          return -1;
        } else {
          return 1;
        }
      } else {
        const first = parseFloat(a[item]) ? parseFloat(a[item]) : 0;
        const second = parseFloat(b[item]) ? parseFloat(b[item]) : 0;
        return second - first;
      }
    });
  }

  sortDown(item) {
    this.products.sort((a, b) => {
      if (item === 'title' || item === 'stock') {
        const first = a[item].toUpperCase();
        const second = b[item].toUpperCase();
        if (first > second) {
          return 1;
        } else {
          return -1;
        }
      } else {
        const first = parseFloat(a[item]) ? parseFloat(a[item]) : 0;
        const second = parseFloat(b[item]) ? parseFloat(b[item]) : 0;
        return first - second;
      }
    });
  }

  drawChart(products) {
    products.forEach(item => {
      let dataTable = [];
      const keywordRanks = item.keywordRank;
      const strDates = item.date;
      if (keywordRanks && keywordRanks.length > 0 && strDates) {
        const dates = strDates.split(',');
        dataTable.push(['Rank', 'Rank Per Day']);
        for (let i = 0; i < keywordRanks[0].rank.split(',').length; i++) {
          let avgRank = 0;
          let rankSum = 0;
          keywordRanks.forEach((val, index) => {
            if (val.rank && val.rank.indexOf(',') !== -1) {
              const rankArr = val.rank.split(',');
              if (rankArr[i]) {
                rankSum += parseInt(rankArr[i], 10);
              }
            } else {
              rankSum += parseInt(val.rank, 10);
            }
            if (index === keywordRanks.length - 1) {
              if (rankSum !== 0) {
                avgRank = rankSum / keywordRanks.length;
                const today = new Date();
                const date = dates[i] ? dates[i] : today.getMonth() + 1 + '/' + today.getDate() + '/' + today.getFullYear();
                dataTable.push([date, Math.round(avgRank)]);
              }
            }
          });
        }
      } else {
        const today = new Date();
        const date = today.getMonth() + 1 + '/' + today.getDate() + '/' + today.getFullYear();
        dataTable = [['rank', 'Rank Per day'], [date, 0]];
      }
      item.rank = {
        chartType: 'LineChart',
        options: {
          hAxis: { title: 'Day' },
          vAxis: { title: 'Rank' },
          backgroundColor: 'white',
          width: '200',
          height: '130'
        }
      };
      item.rank.dataTable = dataTable;
    });
    const that = this;
    setTimeout(() => {
      that.products = products;
    }, 1);
  }

  details(index) {
    const data = this.products[index];
    let price = null;
    if (data.price) {
      price = {
        price: data.price,
        bsr: data.bsr,
        date: data.date
      };
    } else {
      price = null;
    }
    this.service.temp = {
      product: JSON.stringify(data),
      price: JSON.stringify(price)
    };
    this.router.navigate(['product/details']);
  }

  redirect() {
    this.router.navigateByUrl('asin');
  }

  title(title) {
    if (title.length > 33) {
      title = title.substr(0, 32) + '...';
    }
    return title;
  }

  onResize(event) {
    this.products[0].chart = null;
    this.getProducts();
  }

  openDialog(index): void {
    const dialogRef = this.dialog.open(DetailsDialogComponent, {
      width: '700px',
      height: '740px',
      data: this.products[index]
    });

    dialogRef.afterClosed().subscribe(result => {
      this.confirm = result;
    });
  }
}

@Component({
  templateUrl: './details.component.html'
})
export class DetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log('public data', this.data);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
