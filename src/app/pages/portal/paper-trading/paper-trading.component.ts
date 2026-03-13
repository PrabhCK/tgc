import { PortalService } from '@/services/portal.service';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PositionsComponent } from './positions/positions.component';
import { OrdersComponent } from './orders/orders.component';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-paper-trading',
  templateUrl: './paper-trading.component.html',
  imports: [CommonModule, ButtonModule, ToastModule, CardModule, FormsModule, WatchlistComponent, PositionsComponent, OrdersComponent],
  standalone: true,
  styleUrls: ['./paper-trading.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class PaperTradingComponent implements OnInit {
  isMobile = false;
  tab = 'Positions';
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
  constructor(
    private pService: PortalService,
  ) {
    this.userdata = JSON.parse(localStorage.getItem('user') || '{}');

  }
  ngOnInit(): void {
    this.checkScreenSize();
    this.getmarginData();
  }

  getmarginData() {
    if (this.userdata?.packagename == 'PRO TRADER') { //if usr

      this.pService.getBalance().subscribe({
        next: (res: any) => {
          this.marginData = res;

        },
        error: (err: any) => {
          this.toast.add({ severity: 'error', summary: 'Alert', detail: err.message });


        }

      })
    }
  }

  @HostListener('window:resize', [])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }

  tabchange(value: any) {
    this.tab = value;
  }


  resetBalance() {
    this.pService.resetBalance().subscribe({
      next: (res: any) => {
        this.toast.add({ severity: 'success', summary: 'Success', detail: 'Reseted Successfully' });
        this.getmarginData();
      },
      error: (err: any) => {
        this.toast.add({ severity: 'error', summary: 'Alert', detail: err.message });
      }
    })
  }
}
