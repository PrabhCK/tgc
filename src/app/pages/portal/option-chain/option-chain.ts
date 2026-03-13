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
  selector: 'app-option-chain',
  imports: [CommonModule, TableModule, FormsModule, AutoCompleteModule, SelectModule, TagModule, DatePickerModule, NgxEchartsModule, ButtonModule, DatePickerModule, InputTextModule, ToastModule, ConfirmDialogModule, DialogModule, CardModule, PrefixPipe, RadioButtonModule],
  templateUrl: './option-chain.html',
  styleUrl: './option-chain.scss',
  providers: [MessageService, DialogService, ConfirmationService]

})
export class OptionChain implements OnInit, OnDestroy {

  socket = io(environment.socketUrl, {});
  socket1 = io('https://stream.nsepay.in', {});


  stockname: any = 'NIFTY';
  prevStockName: any = 'NIFTY';


  timeframe: any = '3';
  tdata: any = {};
  tabledata: any = {};
  loaded: boolean = false;

  today: Date;

  selected_date: any = new Date();
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
  ]; table_data: any = [];
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
  displayDialog!: boolean;
  // stream = false;

  constructor(
    private http: HttpClient,
    private errorhandler: ErrorhandlerService,
    private toast: MessageService,
    public pservice: PortalService,
    private confirmationService: ConfirmationService
  ) {
    this.today = new Date();
    let data = '';
    this.selected_date = new Date();
    this.userdata = JSON.parse(localStorage.getItem('user') || '{}');
    this.token = this.userdata.accesstoken;
    this.stocklist = Constants.stocks;
    if (this.userdata?.packagename == 'PRO TRADER' ) { //if usr
      this.getDate();
      this.getData();
      this.getTableData();
    }
    //  this.getExpiryDates();
  }

  getData() {
    if (this.userdata?.packagename == 'PRO TRADER' ) { //if usr
      this.socket.on('data', (data) => {
        console.log(data);
        this.tdata.spot_ltp = data.spot_ltp;
        this.tdata.spot_change = data.spot_change;
        this.tdata.spot_change_per = data.spot_change_per;
      });
    }
  }

  getTableData() {
    if (this.userdata?.packagename == 'PRO TRADER' || this.userdata?.packagename == 'ALGO TRADER') { //if usr
      this.socket1.on(this.stockname, (dt: any) => {
        console.log('Data on click:', dt);
        this.table_data = dt.options;
      });
    }
  }
  ngOnInit() {
    // this.dtOptions[0] = {
    //   pagingType: 'full_numbers',
    //   pageLength: 50,
    //   ordering: false,
    // };
    if (this.userdata?.packagename == 'PRO TRADER' || this.userdata?.packagename == 'ALGO TRADER') { //if usr
      this.getAccountInfo();
    }
  }

  initialfetch() {
    this.pservice.getOptionChainData(this.stockname, this.timeframe, this.expiry_selected_date, moment(this.selected_date).format('YYYY-MM-DD'))
      .subscribe(
        (res: any) => {
          this.tdata = res;
          this.table_data = this.tdata.data;
          this.loaded = true;
        },
        (err) => {
          let message = this.errorhandler.handleError(err);
          this.toast.add({ severity: 'error', summary: 'Alert', detail: message });
        }
      );
  }

  getOptionChainData() {
    // if (!this.stream) {
    if (this.stockname && this.timeframe && this.expiry_selected_date && this.selected_date) {
      this.pservice.getOptionChainData(this.stockname, this.timeframe, this.expiry_selected_date, moment(this.selected_date).format('YYYY-MM-DD'))

        .subscribe(
          (result) => {
            this.tdata = result;
            this.table_data = this.tdata.data;
            this.loaded = true;
          },
          (err) => {
            let message = this.errorhandler.handleError(err);
            this.toast.add({ severity: 'error', summary: 'Alert', detail: message });
          }
        );
    }
  }

  tick() {
    this.secondtimerSubscription = timer(0, 60000)
      .pipe(
        map(() => {
          this.getOptionChainData();
        })
      )
      .subscribe();
  }

  viewClassMap: Record<string, string> = {
    'Short Buildup': 'shortbuildup',
    'Long Buildup': 'longbuildup',
    'Short Covering': 'shortcovering',
    'Long Unwinding': 'longunwinding',
  };



  getDate() {

    if (this.stockname) {
      this.pservice.getOptionsDate(this.stockname)
        .subscribe(
          (res: any) => {
            this.selected_date = new Date(res);
            this.getExpiryDates();
          },
          (err) => {
            let message = this.errorhandler.handleError(err);
            if (err.status == 403) {
              // this.toast.add({ severity: 'error', summary: 'GET FULL ACCESS', detail: message });
            } else {
              this.toast.add({ severity: 'error', summary: 'Alert', detail: message });
            }
          }
        );
    }
    // }


  }

  getAccountInfo() {
    this.pservice.getAccountData().subscribe(
      (res: any) => {
        this.loginid = res?.loginid;
      },
      (e) => {
        if (e.status == 500) {
          this.toast.add({ severity: 'error', summary: 'Alert', detail: 'Something went wrong' });
        }
      },
    );
  }

  getExpiryDates() {
    if (this.userdata?.packagename == 'PRO TRADER') { //if usr

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

              this.tick();
            },
            error: (err) => {
              // let message = this.errorhandler.handleError(err);
              // this.toast.showError(message, 'Error');
            }
          }
          );
      }
    }
  }

  openPlaceOrder(data: any, type: any, ordertype: any) {
    if (this.loginid) {
      this.type = ordertype;
      this.symbolsearch = `${this.stockname.toUpperCase()} ${this.formatDate(this.expiry_selected_date)} ${data.strikeprice} ${type}`;
      this.displayDialog = true;
      this.search(this.symbolsearch);
    } else {
      this.toast.add({ severity: 'error', summary: 'Alert', detail: 'Add your trading account in account section.' });
    }

  }

  formatDate(dateStr: string): string {
    const dateObj = new Date(dateStr);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();

    // Get ordinal suffix
    const suffix = (day % 10 === 1 && day !== 11) ? 'ST' : (day % 10 === 2 && day !== 12) ? 'ND' : (day % 10 === 3 && day !== 13) ? 'RD' : 'TH';

    return `${day}${suffix} ${month}`;
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

  ngOnDestroy() {
    if (this.secondtimerSubscription != undefined) {
      this.secondtimerSubscription.unsubscribe();
    }

    this.socket.emit('unsubscribe_symbol', {
      symbol: this.prevStockName,
    });
    this.socket1.emit('unsubscribe_symbol', {
      symbol: this.prevStockName,
    });
  }

}
