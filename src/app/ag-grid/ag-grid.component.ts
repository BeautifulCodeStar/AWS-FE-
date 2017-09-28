import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ag-grid',
  templateUrl: './ag-grid.component.html',
  styleUrls: ['./ag-grid.component.css']
})
export class AgGridComponent implements OnInit {

  constructor() { }

  private params: any;

  agInit(params: any): void {
      this.params = params;
  }

  ngOnInit() {}



}
