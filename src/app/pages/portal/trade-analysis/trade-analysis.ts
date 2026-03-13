import { Component, inject } from '@angular/core';
import { map, Subscription, timer } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { EChartsOption } from 'echarts';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '@/services/constants';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { isToday } from 'date-fns';
import moment from 'moment';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
} from 'echarts/components';
import { BarChart, GaugeChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { DatePickerModule } from 'primeng/datepicker';

// Register required components
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  CanvasRenderer,
  GaugeChart
]);
@Component({
  selector: 'app-trade-analysis',
  imports: [CommonModule, FormsModule, SelectModule, CardModule, ButtonModule, CheckboxModule, InputTextModule, DatePickerModule, ToastModule, ConfirmDialogModule, NgxEchartsModule],
  templateUrl: './trade-analysis.html',
  styleUrl: './trade-analysis.scss',
  standalone: true,
  providers: [MessageService]

})
export class TradeAnalysis {
  endpoint = environment.baseurl;
  baseurl = environment.baseurl + '/options/oistats';

  socket = io(environment.socketUrl, {});
  stockname: any = 'NIFTY';
  prevStockName: any = 'NIFTY';

  timeframe: any = 'Full Day';
  tdata: any = {};
  tabledata: any = {};
  loaded: boolean = false;
  today: Date;
  selected_date: any = '2023-03-13';
  expiry_selected_date: any = '';
  secondtimerSubscription!: Subscription;
  userdata: any;
  token: any;
  stocklist: any[] = [

    { name: "BANKNIFTY", value: 'BANKNIFTY' },
    { name: "NIFTY", value: "NIFTY" },
    { name: "FINNIFTY", value: "FINNIFTY" },
    { name: "MIDCPNIFTY", value: "MIDCPNIFTY" }
  ];
  timeframes: any;
  table_data: any = [];
  expirydates: any;
  changedata: boolean = false;
  toast = inject(MessageService);
  intervalList = [
    { label: 'Full Day', value: 'Full Day' },
    { label: 'Last 3 Minutes', value: 'Last 3 mins' },
    { label: 'Last 5 Minutes', value: 'Last 5 mins' },
    { label: 'Last 10 Minutes', value: 'Last 10 mins' },
    { label: 'Last 15 Minutes', value: 'Last 15 mins' },
    { label: 'Last 30 Minutes', value: 'Last 30 mins' },
    { label: 'Last 1 Hour', value: 'Last 1 Hour' },
    { label: 'Last 2 Hours', value: 'Last 2 Hours' },
    { label: 'Last 4 Hours', value: 'Last 4 Hours' }
  ]

  oibarChartOption: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    // toolbox: {
    //   show: true,
    //   feature: {
    //     saveAsImage: { show: true },
    //   },
    // },
    legend: {
      data: [
        {
          name: 'CALL OI',
          itemStyle: {
            color: '#f44a41ff'
          }
        },
        {
          name: 'PUT OI',
          itemStyle: {
            color: 'green'
          }
        }
      ]
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLine: {
        show: true
      }
    },
    yAxis: {
      type: 'category',
      data: ['Total OI']
    },
    series: [
      {
        name: 'CALL OI',
        color: '#f44a41ff',
        type: 'bar',
        data: []
      },
      {
        name: 'PUT OI',
        color: 'green',
        type: 'bar',
        data: []
      }
    ],
    graphic: [
      {
        // Position the image at the bottom center of its container.
        type: 'image',
        left: '40%', // Position at the center horizontally.
        top: '10%', // Position beyond the bottom boundary 10%.

      }
    ]
  };

  oibarupdateOptions: any = {
    series: [
      {
        data: [],
      },
      {
        data: [],
      },
    ],
  };

  chartOption: EChartsOption = {
    // toolbox: {
    //   show: true,
    //   feature: {
    //     restore: { show: true },
    //     saveAsImage: { show: true },
    //   },
    // },

    series: [
      {
        type: 'gauge',
        center: ['50%', '60%'],
        radius: '90%',
        min: 0,
        max: 2,
        splitNumber: 20,
        axisLine: {
          lineStyle: {
            width: 22,
            color: [
              [0.25, '#a70000'],
              [0.41, '#ff0000'],
              [0.57, '#CCCCFF'],
              [0.73, '#7CFC00'],
              [1, '#008000'],
            ],
          },
        },
        pointer: {
          icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
          length: '85%',
          width: 6,
          offsetCenter: [0, '0'],
        },
        // ✅ Small Ticks
        axisTick: {
          show: true, // Show ticks
          distance: -20,
          splitNumber: 3, // Number of small ticks between major divisions
          length: 8, // Tick length
          lineStyle: {
            color: '#FFF', // Tick color
            width: 1.5, // Tick thickness
          },
        },

        // ✅ Major Dividers (Thicker Lines)
        splitLine: {
          distance: -22,
          show: true, // Show major dividers
          length: 22, // Divider length
          lineStyle: {
            color: '#fff', // Divider color
            width: 3, // Divider thickness
          },
        },
        axisLabel: {
          color: '#464646',
          fontSize: 18,
          distance: -10,
          rotate: 'tangential',
          formatter: function (value: number) {
            if (value === 1) {
              return 'Neutral';
            } else if (value === 1.3) {
              return 'Bullish';
            } else if (value === 1.8) {
              return 'Strong Bullish';
            } else if (value == 0.6) {
              return 'Bearish';
            } else if (value === 0.2) {
              return 'Strong Bearish';
            }
            return '';
          },
        },
        title: {
          offsetCenter: [0, '-10%'],
          fontSize: 20,
        },
        detail: {
          fontSize: 30,
          offsetCenter: [0, '-35%'],
          valueAnimation: true,
          formatter: function (value: number) {
            return value + '';
          },
          color: 'inherit',
        },
        data: [
          {
            value: 0.7,
            name: 'PCR',
          },
        ],
      },
    ],
    graphic: [
      {
        // Position the image at the bottom center of its container.
        type: 'image',
        left: '35%', // Position at the center horizontally.
        top: '0%', // Position beyond the bottom boundary 10%.

      }
    ]
  };

  baroption: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    // toolbox: {
    //   show: true,
    //   feature: {
    //     dataView: { show: true, readOnly: false },
    //     magicType: { show: true, type: ['line', 'bar'] },
    //     saveAsImage: { show: true },
    //   },
    // },
    dataZoom: [
      {
        show: true,
        xAxisIndex: [0, 1],
        type: 'slider',
        start: 25,
        end: 75
      }
    ],
    calculable: true,
    xAxis: [
      {
        type: 'category',
        name: 'Strike Prices',
        data: [],
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        name: 'CALL OI',
        type: 'bar',
        data: [],
        color: '#f44a41ff',
        markLine: {
          data: [],
        },
      },
      {
        name: 'PUT OI',
        type: 'bar',
        color: 'green',
        markLine: {
          data: [],
          // data: [{ name: 'Avg', xAxis: 40200 }],
        },
        data: [],
      },
    ],
    graphic: [
      {
        // Position the image at the bottom center of its container.
        type: 'image',
        left: '45%', // Position at the center horizontally.
        top: '15%', // Position beyond the bottom boundary 10%.

      }
    ]
  };

  updateOptions: any = {
    series: [
      {
        data: [],
      },
    ],
  };

  barupdateOptions: any = {
    series: [
      {
        data: [],
        markLine: {
          data: [],
        },
      },
      {
        data: [],
      },
    ],
    xAxis: [
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
    this.selected_date = moment().format('YYYY-MM-DD');
    this.userdata = JSON.parse(localStorage.getItem('user') || '{}');
    this.token = this.userdata.accesstoken;
    this.getDate();
    this.getData();

  }

  ngOnInit() { }

  getData() {
    if (this.userdata?.packagename == 'PRO TRADER') { //if usr

      this.socket.on('data', (data) => {
        this.tdata.spot_ltp = data.spot_ltp;
        this.tdata.spot_change = data.spot_change;
        this.tdata.spot_change_per = data.spot_change_per;
      });
    }
  }

  oianalysis() {
    if (this.userdata?.packagename == 'PRO TRADER') { //if usr

      if (this.stockname && this.timeframe && this.expiry_selected_date && this.selected_date) {

        this.http.get(
          this.baseurl +
          '?stockname=' +
          this.stockname +
          '&interval=' +
          this.timeframe +
          '&expirydate=' +
          this.expiry_selected_date +
          '&date=' +
          moment(this.selected_date).format('YYYY-MM-DD')).subscribe(
            (result) => {
              this.tdata = result;
              this.changeDataToggler();
            }, (err) => {
              this.toast.add({ severity: 'error', summary: 'Alert', detail: err.message });
            })
      }
    }
  }

  tick() {
    this.secondtimerSubscription = timer(0, 60000)
      .pipe(
        map(() => {
          this.oianalysis();
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    if (this.secondtimerSubscription != undefined) {
      this.secondtimerSubscription.unsubscribe();
    }
    this.socket.emit('unsubscribe_symbol', {
      symbol: this.prevStockName,
    });
  }

  getStocknames() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        Authorization: 'Bearer ' + this.token,
      }),
    };

    this.http
      .get(this.endpoint + '/options/dropdown/get_stocks', httpOptions)
      .subscribe(
        (res: any) => {
          this.stocklist = res;
          this.getDate();
        },
        (err) => {
          this.toast.add({ severity: 'error', summary: 'Alert', detail: err.message });
        }
      );
  }

  getDate() {
    if (this.userdata?.packagename == 'PRO TRADER') { //if usr
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          Authorization: 'Bearer ' + this.token,
        }),
      };

      if (this.stockname) {
        this.http
          .get(
            this.endpoint +
            '/options/dropdown/get_date?stockname=' +
            this.stockname,
            httpOptions
          )
          .subscribe(
            (res: any) => {
              this.selected_date = res;
              this.getExpiryDates();
            },
            (err) => {
              this.toast.add({ severity: 'error', summary: 'Alert', detail: err.message });
            }
          );
      }
    }
  }

  getExpiryDates() {
    if (this.userdata?.packagename == 'PRO TRADER') { //if usr

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          Authorization: 'Bearer ' + this.token,
        }),
      };
      if (this.stockname && this.selected_date) {
        this.http
          .get(
            this.endpoint +
            '/options/dropdown/get_expiries?stockname=' +
            this.stockname +
            '&date=' +
            moment(this.selected_date).format('YYYY-MM-DD'),
            httpOptions
          )
          .subscribe(
            (res: any) => {
              this.expirydates = res;
              this.expiry_selected_date = this.expirydates[0];

              this.socket.emit('unsubscribe_symbol', {
                symbol: this.prevStockName,
              });

              let sto = '';
              if (isToday(new Date(this.selected_date))) {
                sto = this.stockname;
              }

              this.socket.emit('currentdata', {
                lastDailyBar: sto,
              });

              this.prevStockName = this.stockname;

              this.tick();
            },
            (err) => {
              this.toast.add({ severity: 'error', summary: 'Alert', detail: err.message });

            }
          );
      }
    }
  }

  changeDataToggler() {
    console.log(this.changedata);
    if (this.changedata) {

      this.updateOptions = {
        series: [
          {
            data: [
              {
                value: this.tdata.pcr_oi_chg,
                name: 'PCR',
              },
            ],
          },
        ],
      };

      this.barupdateOptions = {
        xAxis: [
          {
            data: this.tdata.strike_prices,
          },
        ],
        series: [
          {
            data: this.tdata.ce_oi_chgs,
            markLine: {
              data: [
                [
                  {
                    name: 'ATM Strike Price',
                    xAxis: this.tdata.atm_strikeprice.toString(),
                    yAxis: 0,
                  },
                  {
                    name: '',
                    xAxis: this.tdata.atm_strikeprice.toString(),
                    yAxis: this.tdata.max_oi_chg.toString(),
                  },
                ],
              ],
            },
          },
          {
            data: this.tdata.pe_oi_chgs,
            markLine: {
              data: [
                [
                  {
                    name: '',
                    xAxis: this.tdata.atm_strikeprice.toString(),
                    yAxis: 0,
                  },
                  {
                    name: '',
                    xAxis: this.tdata.atm_strikeprice.toString(),
                    yAxis: this.tdata.max_oi_chg.toString(),
                  },
                ],
              ],
            },
          },
        ],
      };

      this.oibarupdateOptions = {
        series: [
          {
            data: [this.tdata.total_ce_oi_chg]
          },
          {
            data: [this.tdata.total_pe_oi_chg]
          },
        ],
      };

    } else {

      this.updateOptions = {
        series: [
          {
            data: [
              {
                value: this.tdata.pcr_oi,
                name: 'PCR',
              },
            ],
          },
        ],
      };

      this.barupdateOptions = {
        xAxis: [
          {
            data: this.tdata.strike_prices,
          },
        ],
        series: [
          {
            data: this.tdata.ce_ois,
            markLine: {
              data: [
                [
                  {
                    name: 'ATM Strike Price',
                    xAxis: this.tdata.atm_strikeprice.toString(),
                    yAxis: 0,
                  },
                  {
                    name: '',
                    xAxis: this.tdata.atm_strikeprice.toString(),
                    yAxis: this.tdata.max_oi.toString(),
                  },
                ],
              ],
            },
          },
          {
            data: this.tdata.pe_ois,
            markLine: {
              data: [
                [
                  {
                    name: '',
                    xAxis: this.tdata.atm_strikeprice.toString(),
                    yAxis: 0,
                  },
                  {
                    name: '',
                    xAxis: this.tdata.atm_strikeprice.toString(),
                    yAxis: this.tdata.max_oi.toString(),
                  },
                ],
              ],
            },
          },
        ],
      };

      this.oibarupdateOptions = {
        series: [
          {
            data: [this.tdata.total_ce_oi]
          },
          {
            data: [this.tdata.total_pe_oi]
          },
        ],
      };
    }
  }

}
