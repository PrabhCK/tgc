import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { PositionsComponent } from './positions/positions.component';
import { OrdersComponent } from './orders/orders.component';
import { PortalService } from '@/services/portal.service';
import { environment } from 'src/environments/environment';
import { io } from 'socket.io-client';
import { TabsModule } from 'primeng/tabs';
import { PlaceOrder } from './place-order/place-order';

@Component({
  selector: 'app-trading-terminal',
  imports: [CommonModule, FormsModule, ButtonModule, ToastModule, CardModule, FormsModule, TabsModule, PositionsComponent, OrdersComponent, PlaceOrder],
  templateUrl: './trading-terminal.html',
  styleUrl: './trading-terminal.scss',
  providers: [MessageService, ConfirmationService],
  standalone: true

})
export class TradingTerminal implements OnInit {

  isMobile = false;
  activeIndex = 0;
  items = [
    { title: 'Portfolio', icon: 'briefcase-outline', link: '/pages/portfolio' },
    { title: 'Watchlist', icon: 'star-outline', link: '/pages/watchlist' }
  ];
  socket = io(environment.socketUrl, {});
  bankNiftyData: any;
  niftyData: any;
  marginData: any;
  toast = inject(MessageService);
  userdata: any;
  accountData: any = {};
  @ViewChild('orderComp') orderComponent!: OrdersComponent;

  constructor(
    private pService: PortalService,
  ) {
    this.userdata = JSON.parse(localStorage.getItem('user') || '{}');

  }
  ngOnInit(): void {
    this.checkScreenSize();
    if (this.userdata?.packagename) {
      this.getAccountData();
      this.getmarginData();
    }
  }

  getAccountData() {
    this.pService.getAccountData().subscribe(
      (res: any) => {
        this.accountData = res;
      },
      (e: any) => {

        if (e.status == 500) {
          this.toast.add({ severity: 'error', summary: 'Alert', detail: e.message });
        } else if (e.status == 404) {
          // this.toast.showError('Add your trading account in account section.', 'Error');
        }
      }
    );
  }

  getmarginData() {
    this.pService.getMarginData().subscribe({
      next: (res: any) => {
        this.marginData = res[0];
      },
      error: (err: any) => {
        this.toast.add({ severity: 'error', summary: 'Alert', detail: err.error.message });
      }

    })
  }

  @HostListener('window:resize', [])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }

  tabchange(value: any) {
    this.activeIndex = value;
    if (this.activeIndex == 1 && this.orderComponent) {
      this.orderComponent.ngOnInit(); // 👈 call method manually
    }
  }



}

