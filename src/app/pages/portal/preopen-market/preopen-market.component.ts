import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, QueryList, ViewChildren } from '@angular/core';
import moment from 'moment';
import { environment } from 'src/environments/environment';
import { EChartsOption } from 'echarts';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { NgxEchartsModule } from 'ngx-echarts'
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-preopen-market',
  templateUrl: './preopen-market.component.html',
  styleUrls: ['./preopen-market.component.scss'],
  imports: [CommonModule, TableModule, FormsModule, SelectModule, DatePickerModule, NgxEchartsModule, ButtonModule, DatePickerModule, InputTextModule, CardModule],
})
export class PreopenMarketComponent {
  baseurl = environment.baseurl + '/preopen/v2/stocks_data';
  endpoint = environment.baseurl;
  stocks = [
    { label: 'NIFTY', value: 'NIFTY' },
    { label: 'BANKNIFTY', value: 'BANKNIFTY' },
    { label: 'FNO STOCKS', value: 'FO' }
  ]
  indices: any = 'NIFTY';
  timeframe: any = 'Full Day';
  tdata: any = {
    posstocks: [],
    negstocks: [],
  };
  tabledata: any;
  loaded: boolean = false;


  today: Date;
  legs: number = 0;

  selected_date=new Date();
  expiry_selected_date: any = '';
  userdata: any;
  token: any;
  stocklist: any;
  timeframes: any;

  table_data: any = [
    {
      lb: [],
    },
  ];
  expirydates: any;
  search_word: any;
  indicedata: any = {
    posstocks: [],
    negstocks: [],
  };

  option: EChartsOption = {
    title: {
      text: 'Premarket Data',
      left: 'bottom',
    },
    colorBy: 'series',
    color: ['#34a853', '#f5515f', '#ffc025'],
    tooltip: {
      trigger: 'item',
    },
    legend: {
      show: false,
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '50%',
        data: [],
        label: {
          show: true,
          formatter(param) {
            return (
              param.name + ' - ' + param.value + ' (' + param.percent + '%)'
            );
          },
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  updateOptions: any = {
    series: [
      {
        data: [],
      },
    ],
  };

  constructor(
    private http: HttpClient,
  ) {
    this.today = new Date();
    let data = '';
    this.selected_date = new Date();
    this.userdata = JSON.parse(localStorage.getItem('user') || 'null');
    this.token = this.userdata.accesstoken;

    this.getDate();
  }

  ngOnInit() {

  }

  getDate() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        Authorization: 'Bearer ' + this.token,
      }),
    };

    this.http.get(this.endpoint + '/preopen/get_date', httpOptions).subscribe(
      (res: any) => {
        this.selected_date =new Date(res)
        this.getStockData();
        this.getIndicesData();
      },
      (err) => {

      }
    );
  }

  transformData(data: any) {
    return data.o.map((row: any[]) =>
      Object.fromEntries(
        data.k.map((key: string, i: number) => [key, row[i]])
      )
    );
  }

  datachange() {
    this.getStockData();
    this.getIndicesData();
  }
  getStockData() {
    if (this.indices && this.selected_date) {
      this.http
        .get(
          this.baseurl +
          '?indexname=' +
          this.indices +
          '&date=' +
          moment(this.selected_date).format('YYYY-MM-DD')
        )
        .subscribe(
          (result) => {
            this.tdata = result;
                        this.tdata.posstocks = this.transformData({ k: this.tdata.k, o: this.tdata.posstocks });
            this.tdata.negstocks = this.transformData({ k: this.tdata.k, o: this.tdata.negstocks });

            this.updateOptions = {
              series: [
                {
                  data: [
                    {
                      value: this.tdata.advances,
                      name: 'Advances',
                    },
                    {
                      value: this.tdata.declines,
                      name: 'Declines',
                    },
                    {
                      value: this.tdata.unchanged,
                      name: 'Unchanged',
                    },
                  ],
                },
              ],
            };
            if (this.tdata.posstocks.length > 0) {
              // this.rerender();
            }
          },
          (err) => {
            // let message = this.errorhandler.handleError(err);
            // this.toast.showError(message, 'Error');
          }
        );
    }

  }

  getIndicesData() {
    if (this.selected_date) {
      this.http.get(
        this.endpoint +
        '/preopen/v2/indices_data?indexname=' +
        this.indices +
        '&date=' +
        moment(this.selected_date).format('YYYY-MM-DD')
      )
        .subscribe((result) => {
          this.indicedata = result;
                    this.indicedata.posstocks = this.transformData({ k: this.indicedata.k, o: this.indicedata.posstocks });
          this.indicedata.negstocks = this.transformData({ k: this.indicedata.k, o: this.indicedata.negstocks });

          if (this.indicedata.posstocks.length > 0) {
            // this.rerender();
          }
        }, (err) => {
          // let message = this.errorhandler.handleError(err);
          // this.toast.showError(message, 'Error');
        })
    }

  }

  searchChange(e: any) { }

  ngOnDestroy() { }


}
