import { Component, ElementRef, HostListener, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { PlaceOrderDialougeComponent } from '../place-order-dialouge/place-order-dialouge.component';
import { PortalService } from '@/services/portal.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CardModule } from 'primeng/card';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss'],
  standalone: true,
  imports: [ButtonModule, FormsModule, CommonModule, AutoCompleteModule, CardModule, ConfirmDialogModule, DialogModule, ToastModule],
  providers: [MessageService, DialogService, ConfirmationService]

})
export class WatchlistComponent implements OnInit, OnDestroy {
  searchTerm = '';
  showResults = false;
  filteredStocks: any;
  socket = io(environment.socketUrl1, {});
  autocompleteOpen = false;  // Flag to manage open/close state of autocomplete
  ref: DynamicDialogRef | undefined;

  watchlist: any[] = []

  stockList: any[] = [];
  loginid: any;
  expandedSymbol: string | null = null;
  toast = inject(MessageService);
  displayDialog: boolean = false;
  stockData: any = {};


  //variable for place order
  searchresult: any[] = [];
  intradayt: any = 'MIS';
  limittype: any = 'MARKET';
  type: string = 'BUY';
  quantity: number = 1;
  price: number = 0;
  trigerprice: number = 0;
  exchange: any = 'NSE';
  dayioc: any = 'DAY';
  searchedvalues: any;
  producttype: any;
  userdata: any;
  constructor(private pService: PortalService, private eRef: ElementRef, private confirmationService: ConfirmationService) {
    this.userdata = JSON.parse(localStorage.getItem('user') || '{}');

  }

  ngOnInit(): void {
    document.body.classList.add('nb-theme-default');
    if (this.userdata?.packagename == 'PRO TRADER') { //if usr

      this.socket.on('data', (dt: any) => {
        let data = JSON.parse(dt)
        if (this.watchlist.length > 0) {
          this.watchlist.map((e: any) => {
            if (data.tradingsymbol == e.instrument?.tradingsymbol) {
              e.sData = data;
              e.ohlc = data?.ohlc;
              e.depth = data?.depth;

            }
          })

        }

      });

      this.getWatchList();
    }
  }

  getWatchList() {
    this.pService.getWatchList().subscribe({
      next: (res: any) => {
        this.watchlist = res;

        if (this.watchlist.length > 0) {
          this.watchlist.forEach((e: any) => {
            this.socket.emit('subscribe_symbol', {
              symbol: e.instrument.tradingsymbol
            });
          })
        }

      },
      complete: () => { },
      error: (err: any) => {
        this.toast.add({ severity: 'error', summary: 'Alert', detail: err.message });
      },
    });

  }

  onSearchChange() {
    const term = this.searchTerm.toLowerCase();
    if (term.length > 2) {
      this.pService.searchStock(term).subscribe({
        next: (res: any) => {
          this.stockList = res
        },
        complete: () => { },
        error: (err: any) => {
          this.toast.add({ severity: 'error', summary: 'Alert', detail: err.error.message });
        },
      });

    } else {
      this.stockList = []
    }

  }

  onStockSelect(stock: any) {
    this.searchTerm = stock?.value.symbol;
    this.addToWatchlist(stock?.value);
  }

  addToWatchlist(dt: any) {
    if (dt) {
      let data = {
        symbol: dt.symbol,
        instrument: {
          symbol: dt.symbol,
          exchange: dt.exchange,
          lot_size: dt.lot_size,
          token: dt.token,
          tradingsymbol: dt.tradingsymbol,
          expiry: dt.expiry
        }
      }
      this.pService.addToWatchlist(data).subscribe({
        next: (res: any) => {
          this.searchTerm = '';
          this.getWatchList();
        },
        complete: () => { },
        error: (err: any) => {
          this.searchTerm = '';
          this.toast.add({ severity: 'error', summary: 'Alert', detail: err.message });
        },
      });
    }
  }

  deletwatchList(dt: any) {
    this.pService.deleteWatchlist(dt.id).subscribe({
      next: (res: any) => {
        this.socket.emit('unsubscribe_symbol', {
          symbol: dt?.instrument.tradingsymbol,
        });
        this.getWatchList();
      },
      complete: () => { },
      error: (err: any) => {
        this.toast.add({ severity: 'error', summary: 'Alert', detail: err.message });
      },
    });
  }

  openPlaceOrder(data: any, type: any) {
    this.stockData = data;
    this.type = type;
    this.displayDialog = true;
    this.search()
  }

  handleCancel() {

  }

  ngOnDestroy() {
    if (this.watchlist.length > 0) {
      this.watchlist.forEach((e: any) => {
        this.socket.emit('unsubscribe_symbol', {
          symbol: e.instrument.tradingsymbol
        });
      })
    }
  }

  toggleAccordion(symbol: string) {
    this.expandedSymbol = this.expandedSymbol === symbol ? null : symbol;
  }

  // Detect click outside
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.expandedSymbol = null;
    }
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

  search() {
    if (this.stockData?.symbol) {
      this.pService.searchBySymbol(this.stockData?.symbol).subscribe((res: any) => {
        this.searchresult = res;
      });
    }
  }

  placeorder() {
    var positionssqu = [];
    var filteredsearch = this.searchresult.filter((num) => {
      return num.symbol == this.stockData.symbol;
    });

    this.searchedvalues = filteredsearch[0];
    if (this.searchedvalues) {
      let actquanty = parseFloat(this.searchedvalues.lot_size) * this.quantity;

      positionssqu.push({
        tradingsymbol: this.searchedvalues.tradingsymbol,
        transaction_type: this.type,
        symbol: this.searchedvalues.symbol,
        exchange: this.searchedvalues.exchange,
        instrument_token: this.searchedvalues.token,
        quantity: actquanty,
        order_type: this.limittype,
        product_type: this.intradayt,
        price: this.limittype == 'MARKET' ? this.stockData.ltp : this.price,
        trigger_price: this.trigerprice,
        expiry: this.searchedvalues.expiry,
      });

      let data: any;
      data = {
        orders: positionssqu,
      };
      this.pService.createOrder(data).subscribe(
        (res) => {
          this.toast.add({ severity: 'success', summary: 'Success', detail: 'Order placed successfully' });
          this.pService.emitOrderPlaced();
          this.displayDialog = false;
          this.confirmationService.close();
        },
        (err) => {
          var error = JSON.stringify(err.error.message);
          this.toast.add({ severity: 'error', summary: 'Alert', detail: err.error.message });
        },
      );
    } else {
      // Swal.fire('Error', 'No Symbol Found', 'error');
    }
  }
}
