import { Constants } from '@/services/constants';
import { PortalService } from '@/services/portal.service';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { isToday } from 'date-fns';
import moment from 'moment';
import { NgxEchartsModule } from 'ngx-echarts';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { map, Subscription, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { io } from 'socket.io-client';
import { PrefixPipe } from '@/pipes/prefix.pipe';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-oi-analysis',
  imports: [CommonModule, TableModule, FormsModule, SelectModule, TagModule, DatePickerModule, NgxEchartsModule, ButtonModule, DatePickerModule, InputTextModule, CardModule, PrefixPipe],
  templateUrl: './oi-analysis.html',
  styleUrl: './oi-analysis.scss',
  providers:[MessageService]
})
export class OiAnalysis implements OnInit {
  socket = io(environment.socketUrl, {});
  stockname: any = 'NIFTY';
  prevStockName: any = 'NIFTY';
  timeframe: any = '3';
  strikeprice: any = '';
  tdata: any = {};
  tabledata: any;
  loaded: boolean = false;

  sent = [];

  selected_date: any = '';
  expiry_selected_date: any = '';
  secondtimerSubscription!: Subscription;
  userdata: any;
  token: any;
  stocklist: any;
  timeframes: any[] = [
    { label: '3 Minutes', value: 3 },
    { label: '5 Minutes', value: 5 },
    { label: '10 Minutes', value: 10 },
    { label: '15 Minutes', value: 15 },
    { label: '60 Minutes', value: 60 }
  ];

  // baseurl = environment.baseurl + '/options/oianalysis';
  // endpoint = environment.baseurl;

  table_data: any = [];
  expirydates: any;
  strikeprices: any;


  regtype: any = 'REGULAR';
  intradayt: any = 'I';
  limittype: any = 'MARKET';
  type: any = 'buy';
  quantity: number = 1;
  price: number = 0;
  trigerprice: number = 0;
  disclosedqty: number = 0;
  target: number = 0;
  stoploss: number = 0;
  trailstoploss: number = 0;
  exchange: any = 'NSE';
  searchresult: any = [];
  dayioc: any = 'DAY';
  symbolsearch: any;
  searchedvalues: any;
  isamo!: boolean;
  producttype: any;
  loginid: any;

  constructor(
    private http: HttpClient,
    public pservice: PortalService,
    public toast: MessageService
  ) {
    let data = '';
    this.userdata = JSON.parse(localStorage.getItem('user') || '{}');
    this.token = this.userdata.accesstoken;
    this.stocklist = Constants.stocks;
    this.getDate();
    this.getData();
  }

  ngOnInit() {
    this.getAccountInfo();
  }

  getAccountInfo() {
    this.pservice.getAccountData().subscribe(
      (res: any) => {
        this.loginid = res?.loginid;
      },
      (e) => {
        if (e.status == 500) {
          this.toast.add({ severity: 'error', summary: 'Alert', detail: 'Something went wrong' });
        } else if (e.status == 404) {
          this.toast.add({ severity: 'error', summary: 'Alert', detail: 'Add your trading account in account section' });
        }
      },
    );
  }


  oianalysis() {
    if (this.stockname && this.timeframe && this.strikeprice && this.expiry_selected_date && this.selected_date) {
      this.pservice.getOiAnalysis(this.stockname, this.timeframe, this.strikeprice, this.expiry_selected_date, moment(this.selected_date).format('YYYY-MM-DD'))
        .subscribe(
          (res: any) => {
            this.tdata = res;
            this.table_data = this.tdata.data;
          },
          (err) => {
            // let message = this.errorhandler.handleError(err);
          this.toast.add({ severity: 'error', summary: 'Alert', detail:'Something went wrong' });
          },
        );
    }
  }

  getData() {
    this.socket.on('data', (data: any) => {
      this.tdata.spot_ltp = data.spot_ltp;
      this.tdata.spot_change = data.spot_change;
      this.tdata.spot_change_per = data.spot_change_per;
    });
  }

  tick() {
    this.secondtimerSubscription = timer(0, 60000)
      .pipe(
        map(() => {
          this.oianalysis();
        }),
      )
      .subscribe();
  }


  getDate() {

    if (this.stockname) {
      this.pservice.getOptionsDate(this.stockname)
        .subscribe({
          next: (res: any) => {
            this.selected_date = res;
            this.getExpiryDates();
          },
          error: (err) => {

          }
        }
        );
    }
  }

  getExpiryDates() {

    if (this.stockname && this.selected_date) {
      this.pservice.getOptionsExpiryDates(this.stockname, moment(this.selected_date).format('YYYY-MM-DD'))
        .subscribe({
          next: (res: any) => {
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

            this.prevStockName = this.stockname; // Update the previousStockname with the previous value

            this.getStrikePrice();
          },
          error: (err) => {
            // let message = this.errorhandler.handleError(err);
            // this.toast.showError(message, 'Error');
          }
        }
        );
    }
  }

  getStrikePrice() {
    if (this.stockname && this.expiry_selected_date) {
      this.pservice.getStrikeprices(this.stockname, moment(this.selected_date).format('YYYY-MM-DD'), this.expiry_selected_date).subscribe({
        next: (res: any) => {
          this.strikeprices = res.strikeprices;
          this.strikeprice = this.strikeprices[res.index];
          if (this.strikeprice != undefined) {
            // this.oianalysis()
            this.tick();
          }
        },
        error: (err) => {
          // let message = this.errorhandler.handleError(err);
          // this.toast.showError(message, 'Error');
        },
      }
      );
    }
  }

  openPlaceOrder(data: any, type: any, ordertype: any) {
    if (this.loginid) {
      //BANKNIFTY 13TH NOV 51000 CE
      this.type = ordertype;
      this.symbolsearch = `${this.stockname.toUpperCase()} ${this.formatDate(this.expiry_selected_date)} ${data.strikeprice} ${type}`;
      if (this.stockname == 'NIFTY' || this.stockname == 'FINNIFTY') {
        this.symbolsearch = this.getFallbackSearch(this.symbolsearch);
      }
      // this.modalService.open(this.dialog, { size: 'lg' });
    } else {
      // Swal.fire('Error', 'Add your trading account in account section.', 'error');
    }
  }

  getFallbackSearch(symbol: string): string {
    const parts = symbol.split(' ');
    if (parts.length > 3) {
      parts.splice(1, 1);
    }
    return parts.join(' ');
  }

  formatDate(dateStr: string): string {
    const dateObj = new Date(dateStr);
    const day = dateObj.getDate();
    const month = dateObj
      .toLocaleString('default', { month: 'short' })
      .toUpperCase();

    // Get ordinal suffix
    const suffix =
      day % 10 === 1 && day !== 11
        ? 'ST'
        : day % 10 === 2 && day !== 12
          ? 'ND'
          : day % 10 === 3 && day !== 13
            ? 'RD'
            : 'TH';

    return `${day}${suffix} ${month}`;
  }

  placeorder() {
    var positionssqu = [];
    var filteredsearch = this.searchresult.filter((num: any) => {
      return num.symbol == this.symbolsearch;
    });

    this.isamo = false;

    if (this.regtype == 'REGULAR') {
      this.producttype = this.intradayt;
    }

    this.searchedvalues = filteredsearch[0];
    if (this.searchedvalues) {
      let actquanty = parseFloat(this.searchedvalues.lot_size) * this.quantity;

      positionssqu.push({
        //    loginid: split,
        exchange: this.searchedvalues.exchange,
        stockname: this.searchedvalues.symbol,
        token: this.searchedvalues.token.toString(),
        quantity: actquanty,
        price: this.price,
        triggerprice: this.trigerprice,
        stoploss: this.stoploss,
        target: this.target,
        trailingsl: this.trailstoploss,
        transactiontype: this.type,
        ordertype: this.limittype,
        isamo: this.isamo,
        producttype: this.producttype,
      });

      let data: any;
      data = {
        loginid: this.loginid,
        orders: positionssqu,
      };

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          Authorization: 'Bearer ' + this.token,
        }),
      };
      this.http
        .post(
          'https://api.takeitheze.in/portfolio/place_orders',
          data,
          httpOptions,
        )
        .subscribe(
          (res) => {
            //   Swal.fire('Success', 'Order Placed Successfully', 'success');
            //   this.modalService.dismissAll();
            // },
            // (err) => {
            //   var error = JSON.stringify(err.error.message);
            //   Swal.fire('Error', error, 'error');
            //   console.log(err.error.message);
          },
        );
    } else {
      // Swal.fire('Error', 'No Symbol Found', 'error');
    }
  }

  confirm() {
    // Swal.fire({
    //   title: 'Are you sure to place order?',
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: 'Yes!',
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     this.placeorder();
    //   }
    // });
  }

  search() {
    if (this.symbolsearch) {
      this.pservice.searchBySymbol(this.symbolsearch).subscribe((res: any) => {
        if (Object.keys(res).length === 0) {
          this.searchresult = [];
          const fallbackSearch = this.getFallbackSearch(this.symbolsearch);
          this.symbolsearch = fallbackSearch;
          this.pservice
            .searchBySymbol(fallbackSearch)
            .subscribe((fallbackRes: any) => {
              this.searchresult =
                Object.keys(fallbackRes).length === 0 ? [] : fallbackRes;
            });
        } else {
          this.searchresult = res;
        }
      });
    }
  }

  viewClassMap: Record<string, string> = {
    'Short Buildup': 'bg-red-600 text-white p-2 rounded text-center',
    'Long Buildup': 'bg-green-600 text-white p-2 rounded text-center',
    'Short Covering': 'bg-green-300 text-dark p-2 rounded text-center',
    'Long Unwinding': 'bg-red-300 text-dark p-2 rounded text-center',
  };


  ngOnDestroy() {
    if (this.secondtimerSubscription != undefined) {
      this.secondtimerSubscription.unsubscribe();
    }
    this.socket.emit('unsubscribe_symbol', {
      symbol: this.prevStockName,
    });
  }
}

