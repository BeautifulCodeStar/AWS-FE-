import { Component, OnInit } from '@angular/core';
declare var google: any;

export class GoogleChartComponent implements OnInit {
  private static googleLoaded: any;

  constructor() {}

  getGoogle() {
    return google;
  }
  ngOnInit() {
    if (!GoogleChartComponent.googleLoaded) {
      GoogleChartComponent.googleLoaded = true;
      google.charts.load('current', { packages: ['line'] });
    }
    google.charts.setOnLoadCallback(() => this.drawGraph());
  }

  drawGraph() {}

  createLineChart(element: any): any {
    return new google.charts.Line(element);
  }

  createDataTable(array: any[]): any {
    return google.visualization.arrayToDataTable(array);
  }
}
