import { Component, OnInit, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { DataService } from '../services/data.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-asin',
  templateUrl: './asin.component.html',
  styleUrls: ['./asin.component.css']
})

export class AsinComponent implements OnInit {
  asins: any[];
  confirm: any;

  constructor(
    private http: Http,
    private service: DataService,
    private dialog: MatDialog
  ) {
    this.fetch();
  }

  ngOnInit() {}

  fetch() {
    this.http
      .get(this.service.apiUrl + '?phrases=keywords')
      .subscribe(res => {
        if (res) {
          this.asins = res.json();
        }
      });
  }

  add() {
    this.openDialog({});
  }

  edit(value) {
    this.openDialog(value);
  }

  delete(value) {
    this.openDialog({type: 'delete', asin: value.asin});
  }

  openDialog(data): void {
    let height = '300px';
    if (data.type) {
      height = '200px';
    }
    const dialogRef = this.dialog.open(AsinDialogComponent, {
      width: '500px',
      height: height,
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      this.fetch();
    });
  }
}
@Component({
  templateUrl: './edit.component.html',
  styleUrls: ['./asin.component.css']
})
export class AsinDialogComponent {
  delete: Boolean = false;
  constructor(
    public dialogRef: MatDialogRef<AsinDialogComponent>,
    private http: Http,
    private service: DataService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.data.type) {
      this.delete = true;
    }
  }

  onSave(): void {
    if (this.data.id) {
      const data = '?type=edit&asin=' + this.data.asin + '&phrases=' + this.data.phrases + '&id=' + this.data.id;
      const rank = '?schedule=rank&asin=' + this.data.asin + '&phrases=' + this.data.phrases;

      this.http.get(this.service.apiUrl + data)
        .subscribe(res => {
          this.onUpdate(rank);
          this.onClose();
        });
    } else {
      const data = '?type=add&asin=' + this.data.asin + '&phrases=' + this.data.phrases;
      const rank = '?schedule=rank&asin=' + this.data.asin + '&phrases=' + this.data.phrases;

      this.http.get(this.service.apiUrl + data)
        .subscribe(res => {
          this.onUpdate(rank);
          this.onClose();
        });
    }
  }

  onUpdate(rank): void {
    const that = this;
    setTimeout(() => {
      that.http.get(that.service.apiUrl + rank).subscribe(res => {
        console.log('rank checker running', res);
      });
    }, 5000);
  }

  onDelete(): void {
    if (this.data.asin) {
      this.http
        .get(this.service.apiUrl + '?type=delete&asin=' + this.data.asin)
        .subscribe(res => {
          this.delete = false;
          this.onClose();
        });
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
