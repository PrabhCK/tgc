import { PortalService } from '@/services/portal.service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-place-order',
  imports: [CommonModule, FormsModule, CardModule, RadioButtonModule, ToastModule, ConfirmDialogModule, AutoCompleteModule, InputTextModule, ButtonModule],
  templateUrl: './place-order.html',
  styleUrl: './place-order.scss',
  standalone: true,
  providers: [MessageService, ConfirmationService]
})
export class PlaceOrder implements OnInit {
  symbolsearch = '';
  searchresult: any[] = [];
  regtype: any = 'REGULAR';
  type: any = 'buy';
  intradayt: any = 'I';
  limittype: any = 'LIMIT';
  quantity = 0;
  price = 0;
  trigerprice = 0;
  searchedvalues: any;
  producttype: any;
  isamo!: boolean;
  target: number = 0;
  stoploss: number = 0;
  trailstoploss: number = 0;

  toast = inject(MessageService);
  loginid: any;
  userdata: any
  constructor(

    private pService: PortalService,
    private confirmationService: ConfirmationService
  ) {
    this.userdata = JSON.parse(localStorage.getItem('user') || '{}');
  }

  ngOnInit(): void {
    if (this.userdata?.packagename) {
      this.getAccountData();
    }
  }
  getAccountData() {
    this.pService.getAccountData().subscribe(
      (res: any) => {
        this.loginid = res?.loginid;
      },
      (e: any) => {
        if (e.status == 500) {
          this.toast.add({ severity: 'error', summary: 'Alert', detail: 'Something went wrong' });
        } else if (e.status == 404) {
          // this.toast.showError( 'Add your trading account in account section.', 'Error');
        }
      }
    );
  }
  onStockSelect(stock: any) {
    this.symbolsearch = stock?.value.symbol;
  }

  search(e: any) {
    if (this.symbolsearch) {
      this.pService.searchBySymbol(this.symbolsearch).subscribe((res: any) => {
        if (Object.keys(res).length === 0) {
          this.searchresult = [];
        } else {
          this.searchresult = res;
        }
      });
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

  confirm() {
    // if (this.loginid) {
    this.confirmationService.confirm({
      message: 'Are you sure to place order?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.placeorder();
      }
    });
    // } else {
    //   this.toast.add({ severity: 'error', summary: 'Alert', detail: 'Add your trading account in account section' });
    // }
  }

  placeorder() {
    var positionssqu = [];
    var filteredsearch = this.searchresult.filter((num) => {
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

    this.pService.placeOrder(data).subscribe({
      next: (res) => {
        this.searchedvalues = []; // Reset checked
        this.toast.add({ severity: 'success', summary: 'Success', detail: 'Order placed successfully!!' });
      },
      error: (err) => {
        const error = JSON.stringify(err.error.message);
        this.toast.add({ severity: 'error', summary: 'Alert', detail: error });
      }
    });
  }
}
