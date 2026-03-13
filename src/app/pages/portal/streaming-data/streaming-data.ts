import { PrefixPipe } from '@/pipes/prefix.pipe';
import { Constants } from '@/services/constants';
import { ErrorhandlerService } from '@/services/errorhandler.service';
import { PortalService } from '@/services/portal.service';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { isToday } from 'date-fns';
import moment from 'moment';
import { NgxEchartsModule } from 'ngx-echarts';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { Subject, Subscription, timer, map } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-streaming-data',
  imports: [CommonModule, TableModule, FormsModule, SelectModule, AutoCompleteModule, TagModule, DialogModule, RadioButtonModule, ConfirmDialogModule, ToastModule, DatePickerModule, NgxEchartsModule, ButtonModule, DatePickerModule, InputTextModule, CardModule, PrefixPipe],
  templateUrl: './streaming-data.html',
  styleUrl: './streaming-data.scss',
  standalone: true,
  providers: [MessageService, DialogService, ConfirmationService]

})
export class StreamingData implements OnInit {
  endpoint = environment.baseurl;
  baseurl = environment.baseurl + '/options/optionchain';
  displayDialog!: boolean;
  view = 'ltp';
  // socket = io(environment.socketUrl, {});
  socket1 = io('https://stream.nsepay.in', {});

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
  secondtimerSubscription1!: Subscription;

  userdata: any;
  token: any;
  stocklist: any;
  timeframes: any;
  table_data: any = [];
  expirydates: any;


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
  totalData: any;

  constructor(
    private http: HttpClient,
    private errorhandler: ErrorhandlerService,
    private toast: MessageService,
    public pservice: PortalService,
    private confirmationService: ConfirmationService

  ) {
    this.today = new Date();
    this.selected_date = moment().format('YYYY-MM-DD');
    this.userdata = JSON.parse(localStorage.getItem('user') || '{}');
    this.token = this.userdata.accesstoken;
    this.stocklist = Constants.stocks;
    if (this.userdata?.packagename == 'PRO TRADER' ) { //if usr
      this.getAccountInfo();
      this.getStocknames();
      this.socket1.on('data', (dt: any) => {
        console.log(dt)
        this.totalData = dt;
        this.table_data = dt.options;
        this.tdata.spot_ltp = dt.spot.ltp;
        this.tdata.spot_change = dt.spot.ltp_chg;
        this.tdata.spot_change_per = dt.spot.pchg;
      });
      this.socket1.emit('currentdata', {
        lastDailyBar: this.stockname + '_OC'
      });
    }

  }

  ngOnInit() {

    // this.dtOptions[0] = {
    //   pagingType: 'full_numbers',
    //   pageLength: 50,
    //   ordering: false,
    // };
  }

  oianalysis() {

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
        },
        (err) => {
          let message = this.errorhandler.handleError(err);
          // this.toast.showError(message, 'Error');
        }
      );
  }

  stockchange(selectedStock: any) {
    if (this.userdata?.packagename == 'PRO TRADER') { //if usr

      if (this.prevStockName) {
        this.socket1.emit('unsubscribe_symbol', {
          symbol: this.prevStockName + '_OC',
        });
      }
      this.socket1.emit('subscribe_symbol', {
        symbol: selectedStock.value + '_OC',
      });

      this.prevStockName = selectedStock.value;
      this.stockname = selectedStock.value;
    }
  }


  getAccountInfo() {
    this.pservice.getAccountData().subscribe(
      (res: any) => {
        this.loginid = res?.loginid;
      },
      (e) => {
        if (e.status == 500) {
          // this.toast.showError('Something went wrong', 'Error');
        } else if (e.status == 404) {
          // this.toast.showError(
          //   'Add your trading account in account section.',
          //   'Error',
          // );
        }
      },
    );
  }

  openPlaceOrder(data: any, type: any, ordertype: any) {
    if (this.loginid) {
      this.type = ordertype;
      let token = type == 'CE' ? data.ce_exchange_token : data.pe_exchange_token;
      this.pservice.getSymbolFromToken(token).subscribe((res: any) => {
        this.symbolsearch = res.symbol;
      })
      this.displayDialog = true;
      this.search(this.symbolsearch);

    }
    else {
      this.toast.add({ severity: 'error', summary: 'Alert', detail: 'Add your trading account in account section.' });
    }

  }

  handleChange(e: any) {
    if (e == 'MARKET') {
      this.price = 0;
      this.trigerprice = 0;
    }
    else if (e == 'LIMIT') {
      this.trigerprice = 0;
    }
  }

  onStockSelect(stock: any) {
    this.symbolsearch = stock?.value.symbol;
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

    let actquanty = parseFloat(this.searchedvalues.lot_size) * this.quantity;

    positionssqu.push({
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

    this.pservice.placeOrder(data).subscribe({
      next: (res) => {
        this.searchedvalues = []; // Reset checked
        this.toast.add({ severity: 'success', summary: 'Success', detail: 'Order placed successfully!!' });
        this.displayDialog = false;
      },
      error: (err) => {
        const error = JSON.stringify(err.error.message);
        this.toast.add({ severity: 'error', summary: 'Alert', detail: error });
      }
    });

  }

  confirm() {
    this.confirmationService.confirm({
      message: 'Are you sure to place order?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.placeorder();
      }
    });
  }

  search(e: any) {
    if (this.symbolsearch) {
      this.pservice.searchBySymbol(this.symbolsearch).subscribe((res: any) => {
        this.searchresult = res;
      });
    }
  }

  viewChart(strikeprice: any, optionTypeValue: any) {
    // const modalRef = this.modalService.open(ChartModalComponent, { size: 'xl' });
    // modalRef.componentInstance.symbolFromChain = this.stockname + this.commonService.formatExpiryDate(this.expiry_selected_date) +
    //   strikeprice + optionTypeValue;
  }


  viewClassMap: Record<string, string> = {
    'Short Buildup': 'shortbuildup',
    'Long Buildup': 'longbuildup',
    'Short Covering': 'shortcovering',
    'Long Unwinding': 'longunwinding',
  };



  ngOnDestroy() {
    if (this.secondtimerSubscription != undefined) {
      this.secondtimerSubscription.unsubscribe();
    }
    if (this.secondtimerSubscription1 != undefined) {
      this.secondtimerSubscription1.unsubscribe();
    }
    this.socket1.emit('unsubscribe_symbol', {
      symbol: this.prevStockName,
    });
  }
}