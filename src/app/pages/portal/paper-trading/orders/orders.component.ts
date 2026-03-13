import { PortalService } from '@/services/portal.service';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  standalone: true,
  imports: [CardModule, FormsModule, ButtonModule, TableModule, CheckboxModule, InputTextModule, CommonModule, DialogModule, TagModule, SelectModule, ConfirmDialogModule, ToastModule],
  providers: [MessageService, ConfirmationService]
})
export class OrdersComponent implements OnInit, AfterViewInit, OnDestroy {
  orderType = 'All'
  orderTypeOptions: any[] = [
    { label: 'All', value: 'All' },
    { label: 'Open', value: 'Open' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Cancelled', value: 'Cancelled' },
    { label: 'Rejected', value: 'Rejected' },
    { label: 'Trigger Pending', value: 'Trigger Pending' },
    { label: 'Unknown', value: 'Unknown' },
  ];
  orderTypes = [
    { label: 'LIMIT', value: 'LIMIT' },
    { label: 'MARKET', value: 'MARKET' },
    { label: 'SL-L', value: 'SL' },
    { label: 'SL-M', value: 'SL-M' }
  ];
  array: any[] = [];
  groupList: any;
  filteredarray: any;
  clientlist: any;
  userdetails: any;
  username: any;
  token: any;
  uid: any;
  orderbook: any[] = [];
  allides: any[] = [];


  cancellength: any = 0;
  selectedrow: any[] = [];
  userselected: any;
  selectedordertype: any;

  newarray: any;
  tosetselect: any;
  changearray: any = 'All';
  isChecked = false;

  strategieslist: any;
  filteredarraystrat: any;
  tabledata: any[] = [];
  @ViewChild('modifyorder', { static: true }) modifyorder!: TemplateRef<any>;
  filteredid: any;
  idtoedit: any = {};
  poBook: any[] = [];
  modifyDialogVisible: boolean = false;
  selectedRows: any[] = [];

  toast = inject(MessageService);

  constructor(

    private pService: PortalService,
    private confirmationService: ConfirmationService
  ) {
    this.userdetails = JSON.parse(localStorage.getItem('user') || '{}');
    // this.username = this.userdetails.name;
    // this.uid = this.userdetails.uid;
    // this.token = this.userdetails.accesstoken;
    // this.newarray = JSON.parse(localStorage.getItem('array') || '');
    // this.tosetselect = JSON.parse(localStorage.getItem('selectid') || '');

    if (this.tosetselect != undefined) {
      this.changearray = this.tosetselect;
    }

    if (this.newarray != undefined) {
      this.array = this.newarray;
    }
    // this.getOrderBookClients();
  }

  ngOnInit() {
    this.pService.orderPlaced$.subscribe(() => {
      this.getOrderBookClients();
    });
  }

  ngAfterViewInit() {

      this.getOrderBookClients();
    
  }

  getOrderBookClients() {
    if (this.userdetails?.packagename == 'PRO TRADER') { //if usr

      this.pService.getPaperTradeOrders().subscribe(
        (res: any) => {
          this.orderbook = res;
          this.poBook = this.orderbook;
          this.allides = [];
          for (var i = 0; i <= this.orderbook.length - 1; i++) {
            this.allides.push(this.orderbook[i].loginid);
          }
        },
        (err) => {
          var error = JSON.stringify(err.error.message);
          console.log(err.error.message);
        }
      );
    }
  }

  onOrderType(event: any) {

    this.selectedordertype = event.value;
    if (event.value != 'All') {
      this.orderbook = this.poBook.filter((dt) => {
        return dt.status == this.selectedordertype;
      });
    } else {
      this.getOrderBookClients();
    }
  }

  buildOrder(data: any) {
    return {
      loginid: data?.loginid,
      orderid: data?.order_id,
      exchange: data?.exchange,
      symbol: data?.symbol,
    };
  }

  /** ✅ Check if all rows are selected */
  isAllChecked(): boolean {
    return this.orderbook.length > 0 && this.selectedRows.length === this.orderbook.length;
  }

  /** ✅ When header checkbox is clicked */
  checkUncheckAll(event: any) {
    if (event.checked) {
      this.selectedRows = [...this.orderbook];
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
    this.selectedRows = [...this.orderbook];
  }

  /** ✅ Unselect all manually */
  unselectAllRows() {
    this.selectedRows = [];
  }



  editOrder(fr: any) {
    const logindata = {
      transaction_type: this.idtoedit.transaction_type,
      quantity: this.idtoedit.quantity,
      order_type: this.idtoedit.order_type,
      product_type: this.idtoedit.product_type,
      price: this.idtoedit.price,
      trigger_price: this.idtoedit.trigger_price,
    };

    this.pService.updateOrderInfo(logindata).subscribe(
      (res) => {
        this.toast.add({ severity: 'success', summary: 'Success', detail: 'Orders Updated' });
        this.pService.emitOrderPlaced();
        this.getOrderBookClients();
      },
      (err) => {
        var error = JSON.stringify(err.error.message);
        this.toast.add({ severity: 'error', summary: 'Alert', detail: error });
        console.log(err.error.message);
      }
    );
  }

  openModify(order: any) {
    this.idtoedit = { ...order };
    this.modifyDialogVisible = true;
  }

  getStatusSeverity(status: string) {
    switch (status) {
      case 'Rejected':
        return 'danger';
      case 'Completed':
        return 'success';
      case 'Open':
        return 'info';
      case 'Cancelled':
        return 'warn';
      default:
        return 'secondary';
    }
  }
  getTtypeSeverity(type: string) {
    if (type == 'BUY') {
      return 'success'
    } else {
      return 'danger'

    }
  }

  cancelSelected() {
    this.confirmationService.confirm({
      message: 'Do you want to cancel selected order?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.selectedRows.length > 0) {
          let ordersArray = [];
          ordersArray = this.selectedRows.map((client) => {
            return client.order_id;
          })
          let dt = {
            order_ids: ordersArray,
          };
          this.pService.cancelSelectedPo(dt).subscribe(
            (res) => {
              this.selectedRows = [];
              this.pService.emitOrderPlaced();
              this.getOrderBookClients();
              this.toast.add({ severity: 'success', summary: 'Success', detail: 'Order Cancelled successfully' });
            },
            (err) => {
              var error = JSON.stringify(err.error.message);
              this.selectedRows = [];
              this.toast.add({ severity: 'error', summary: 'Alert', detail: error });
              console.log(err.error.message);
            }
          );
        } else {
          this.toast.add({ severity: 'error', summary: 'Alert', detail: 'Please Select Order' });
        }
      }
    });
  }


  cancelAll() {
    this.confirmationService.confirm({
      message: 'Do you want to cancel all orders?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.pService.cancelAll().subscribe(
          (res) => {
            this.pService.emitOrderPlaced();
            this.getOrderBookClients();
          },
          (err) => {
            var error = JSON.stringify(err.error.message);
            this.toast.add({ severity: 'error', summary: 'Alert', detail: error });
          }
        );
      }
    });
  }
  ngOnDestroy(): void {
  }
}
