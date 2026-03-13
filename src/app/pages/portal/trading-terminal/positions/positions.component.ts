import { PortalService } from '@/services/portal.service';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { PaginatorModule } from 'primeng/paginator';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.css'],
  standalone: true,
  imports: [CardModule, FormsModule, RadioButtonModule, ButtonModule, TableModule, CheckboxModule, CommonModule, SelectButtonModule, ToastModule, PaginatorModule, InputNumberModule, ConfirmDialogModule, DialogModule],
  providers: [MessageService, ConfirmationService]

})
export class PositionsComponent implements OnInit, AfterViewInit, OnDestroy {
  totalmtm = 0;
  totalpnl = 0;
  totalnetqty = 0;
  newposition: any[] = [];
  foropenclosed: any[] = [];

  selectButtonValues: any = [
    { name: 'OPEN', value: 'OPEN' },
    { name: 'CLOSED', value: 'CLOSED' }
  ];

  statusopen: any = 'OPEN';
  socket = io(environment.socketUrl1, {});

  selectedRows: any[] = [];
  toast = inject(MessageService);
  displayDialog = false;

  type = 'buy';
  trigerprice = 0;
  price = 0;
  limittype = '';
  selectedPosition: any;
  userdata: any;

  constructor(
    private pService: PortalService,
    private confirmationService: ConfirmationService
  ) {
    this.userdata = JSON.parse(localStorage.getItem('user') || '{}');

  }

  ngAfterViewInit(): void {
    if (this.userdata?.packagename) {
      this.getpositions();
    }
  }

  ngOnInit() {
    this.socket.on('data', (dt: any) => {
      let data = JSON.parse(dt)
      if (this.newposition.length > 0) {
        this.newposition.map((e: any) => {
          if (data.tradingsymbol == e.tradingsymbol) {
            e.ltp = data.ltp;
            let sv = e.sell_value, bv = e.buy_value;
            if (e.net_quantity > 0) {
              sv = e.sell_value + (e.net_quantity * e.ltp)
            } else {
              bv = e.buy_value + (-1 * e.net_quantity * e.ltp)
            }
            e.pnl = sv - bv;
          }
        });
        this.totalmtm = this.newposition.reduce((sum, sp) => sum + (sp.pnl || 0), 0);
        this.totalnetqty = this.newposition.reduce((sum, p) => sum + p.netqty, 0);
        this.totalpnl = this.newposition.reduce((sum, p) => sum + p.pnl, 0);
      }
    });
  }

  getpositions() {
    this.pService.getPositionBook().subscribe({
      next: (res: any) => {
        this.newposition = res;
        this.foropenclosed = [...this.newposition];
        if (this.newposition.length > 0) {
          this.newposition.forEach((e: any) => {
            this.socket.emit('subscribe_symbol', {
              symbol: e.tradingsymbol
            });
          })
        }
        this.statusopen = 'OPEN';
        this.filterPositions();
      },
      error: (err) => {
        var error = JSON.stringify(err.error.message);
        this.toast.add({ severity: 'error', summary: 'Alert', detail: error });

      }
    });
  }



  /** ✅ Check if all rows are selected */
  isAllChecked(): boolean {
    return this.newposition.length > 0 &&
      this.selectedRows.length === this.newposition.length;
  }

  /** ✅ When header checkbox is clicked */
  checkUncheckAll(event: any) {
    if (event.checked) {
      this.selectedRows = [...this.newposition];
    } else {
      this.selectedRows = [];
    }
  }

  /** ✅ Check if specific row is selected */
  isRowChecked(id: number): boolean {
    return this.selectedRows.some((row) => row.id === id);
  }

  /** ✅ Handle individual row checkbox */
  rowCheckBoxChecked(event: any, position: any) {
    if (event.checked) {
      this.selectedRows.push(position);
    } else {
      this.selectedRows = this.selectedRows.filter((row) => row.id !== position.id);
    }
  }

  /** ✅ Select all manually */
  selectAllRows() {
    this.selectedRows = [...this.newposition];
  }

  /** ✅ Unselect all manually */
  unselectAllRows() {
    this.selectedRows = [];
  }

  /** ✅ Handle selectbutton change */
  changeStatus(event: any) {
    this.statusopen = event.value;
    this.filterPositions();
  }

  /** ✅ Reusable filtering logic */
  private filterPositions() {
    if (!this.foropenclosed) return;

    const isClosed = this.statusopen == 'CLOSED';

    this.newposition = this.foropenclosed.filter((pos: any) =>
      isClosed ? pos.net_quantity === 0 : pos.net_quantity !== 0
    );
    this.totalmtm = this.newposition.reduce((sum, sp) => sum + (sp.mtm || 0), 0);
    this.totalnetqty = this.newposition.reduce((sum, p) => sum + p.netqty, 0);
    this.totalpnl = this.newposition.reduce((sum, p) => sum + p.pnl, 0);

  }

  sqOff() {
    this.confirmationService.confirm({
      message: 'Are you sure to want Sq. Position?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.submitOrder()
      }
    })

  }

  // Helper function to build order object from row data
  buildOrder(data: any) {

    const transaction_type =
      data.net_quantity > 0 ? 'SELL' : data.net_quantity < 0 ? 'BUY' : '';

    return {
      transactiontype: transaction_type,
      symbol: data.symbol,
      exchange: data.exchange,
      instrument_token: data.instrument_token,
      quantity: Math.abs(data.net_quantity),
      order_type: 'MARKET',
      product_type: data.product_type,
      price: data.ltp,
      trigger_price: data.ltp,
      tradingsymbol: data.tradingsymbol,
      expiry: data.expiry,
    };
  }


  submitOrder() {
    if (this.selectedRows.length > 0) {
      let positions = this.selectedRows.map((dt) => this.buildOrder(dt))
      const data = {
        orders: positions
      };
      this.pService.placeOrder(data).subscribe({
        next: (res) => {
          this.selectedRows = []; // Reset checked
          this.toast.add({ severity: 'success', summary: 'Success', detail: 'Sq. Off successful' });
          this.getpositions();
        },
        error: (err) => {
          const error = JSON.stringify(err.error.message);
          this.toast.add({ severity: 'error', summary: 'Alert', detail: error });
        }
      });
    } else {
      this.toast.add({ severity: 'error', summary: 'Alert', detail: 'Please select positions' });
    }

  }

  sl(position: any) {
    this.selectedPosition = position;
    this.displayDialog = true;
  }

  confirmSl() {
    let data: any;
    var positionssqu: any[] = [
      {
        loginid: this.selectedPosition?.loginid,
        exchange: this.selectedPosition?.exchange,
        stockname: this.selectedPosition?.symbol,
        token: this.selectedPosition?.instrument_token,
        quantity: Math.abs(this.selectedPosition?.net_quantity),
        ordertype: 'SL',
        producttype: this.selectedPosition?.product,
        price: this.price,
        triggerprice: this.trigerprice
      },
    ];
    if (this.selectedPosition.net_quantity > 0) {
      positionssqu[0].transactiontype = 'SELL';
    } else if (this.selectedPosition.net_quantity < 0) {
      positionssqu[0].transactiontype = 'BUY';
    }

    data = {
      loginid: this.selectedPosition.loginid,
      orders: positionssqu,
    };
    this.pService.placeOrder(data).subscribe({
      next: (res) => {
        this.selectedRows = []; // Reset checked
        this.toast.add({ severity: 'success', summary: 'Success', detail: 'Sq. Off successful' });
        this.getpositions();
      },
      error: (err) => {
        const error = JSON.stringify(err.error.message);
        this.toast.add({ severity: 'error', summary: 'Alert', detail: error });
      }
    });

  }



  ngOnDestroy(): void {
    if (this.newposition.length > 0) {
      this.newposition.forEach((e: any) => {
        this.socket.emit('unsubscribe_symbol', {
          symbol: e.tradingsymbol
        });
      })
    }
  }

}
