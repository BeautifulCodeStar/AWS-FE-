declare var google: any;
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';
import { WindowService } from '../services/window.service';
import { GoogleChartComponent } from './googlechart.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent extends GoogleChartComponent
  implements OnInit {

  public product: any;
  private options;
  private data;
  private chart;
  private google;
  ranking: any;
  priceRanking: any;

  constructor(
    private route: ActivatedRoute,
    private service: DataService,
    private window: WindowService
  ) {
    super();
    this.getGraphData();
  }

  ngOnInit() {}

  getGraphData() {
    if (this.service.temp) {
      if (this.service.temp.product) {
        this.keywordRanks(this.service.temp.product);
      }
      if (this.service.temp.price) {
        this.priceRanks(this.service.temp.price);
      }
    }
  }

  drawGraph() {
    const materialOptions = {
      chart: { height: 500 },
      vAxis: { format: 'decimal', minValue: 0 },
      hAxis: {
        titleTextStyle: {color: '#333'},
        slantedText: true, slantedTextAngle: 80
      },
      explorer: {
        actions: ['dragToZoom', 'rightClickToReset'],
        axis: 'horizontal',
        keepInBounds: true,
        maxZoomIn: 4.0
      }
    };
    if (this.ranking) {
      this.data = this.createDataTable(this.ranking);
      const that = this;
      this.google = this.getGoogle();
      setTimeout(() => {
        that.chart = this.createLineChart(document.getElementById('keyword-chart'));
        if (that.data) {
          that.chart.draw(
            that.data,
            google.charts.Line.convertOptions(materialOptions)
          );
        }
        if (that.priceRanking) {
          that.chart = this.createLineChart(document.getElementById('price-chart'));
          that.chart.draw(that.createDataTable(that.priceRanking), materialOptions);
        }
      }, 100);
    }
  }

  keywordRanks(products) {
      const today = new Date();
      let index = today.getMonth() + 1 + '/' + today.getDate() + '/' + today.getFullYear();
      const keywordGraph = { chartType: 'LineChart', dataTable: [['Date', 'Keyword'], [index, 0]] };
      const dataTable = [];
      if (products) {
        this.product = JSON.parse(products);
        const ranks = this.product.rank;
        const keywordRank = this.product.keywordRank;
        const dateStr = this.product.date;
        const mainArr = [];
        const headTitle = ['Date'];

        if (keywordRank && dateStr) {
          const date = dateStr.split(',');
          keywordRank.forEach(rank => {
            headTitle.push(rank.keyword);
          });
          const rankCount = headTitle.length;
          const dataArr = [];
          const temp: number[] = [];
          keywordRank.forEach(element => {
            let rankLength = 0;
            if (element.rank.indexOf(',') !== -1) {
              const rankArr = element.rank.split(',');
              rankLength = rankArr.length;
            } else if (element.rank) {
              rankLength = 1;
            }
            temp.push(rankLength);
          });
          const maxLen = temp.reduce(function(a, b) {
            return Math.max(a, b);
          });
          for (let i = 0; i < maxLen; i++) {
            index = date[i] ? date[i] : today.getMonth() + 1 + '/' + today.getDate() + '/' + today.getFullYear();
            mainArr.push([index]);
            keywordRank.forEach(val => {
              if (val.rank.indexOf(',') !== -1) {
                const rankArr = val.rank.split(',');
                mainArr[i].push(parseFloat(rankArr[i]));
              } else {
                if (val.rank && i === 0) {
                  mainArr[i].push(parseFloat(val.rank));
                } else {
                  mainArr[i].push(null);
                }
              }
            });
          }
          dataTable.push(headTitle);
          for (let i = 0; i < mainArr.length; i++) {
            dataTable.push(mainArr[i]);
          }
        }
      }
      if (dataTable) {
        this.ranking = dataTable;
      }
      if (this.ranking) {
        this.drawGraph();
      }
  }

  priceRanks(prices) {
    const priceGraph = {
      chartType: 'LineChart',
      dataTable: [['Date', 'Price', 'BestSellersRank']]
    };
    const data = JSON.parse(prices);
    if (
      data.bsr && data.price &&
      (data.price.indexOf(',') !== -1 || data.bsr.indexOf(',') !== -1 || data.date.indexOf(',') !== -1)
    ) {
      const dateStr = data.date;
      const price = data.price.split(',');
      const bsr = data.bsr.split(',');
      const date = dateStr.split(',');
      if (price && price.length > 0) {
        const priceData = [];
        price.forEach((element, key) => {
          const today = new Date();
          const index = date[key] ? date[key] : today.getMonth() + 1 + '/' + today.getDate() + '/' + today.getFullYear();
          priceData.push([index, parseFloat(element)]);
        });
        for (let i = 0; i < bsr.length; i++) {
          let rank = bsr[i];
          if (!rank) {
            rank = null;
          }
          if (priceData[i]) {
            priceData[i].push(parseFloat(rank));
            priceGraph.dataTable.push(priceData[i]);
          }
        }
        this.priceRanking = priceGraph.dataTable;
      }
    } else {
      const today = new Date();
      const index = today.getMonth() + 1 + '/' + today.getDate() + '/' + today.getFullYear();
      this.priceRanking = [['Date', 'Price', 'BestSellersRank'], [index, 0, 0]];
    }
  }

  onResize(e) {
    this.getGraphData();
  }
}
