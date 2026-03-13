import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from '../app-configurator/app.configurator';
import { LayoutService } from '../../service/layout.service';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { AuthService } from '@/services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterModule, CommonModule, StyleClassModule, MenuModule, MenubarModule],
  templateUrl: './app.topbar.html',
  styleUrls: ['./app.topbar.scss']
})
export class AppTopbar implements OnInit {
  profileItems: MenuItem[] = [];
  menuItems: MenuItem[] = [];
  userdetails: any;
  constructor(public layoutService: LayoutService, public router: Router, private auth: AuthService) { }

  ngOnInit(): void {
    this.userdetails = JSON.parse(localStorage.getItem('user') || '{}');
    if (this.userdetails.role == 'user') {
      this.menuItems = [
        {
          label: 'Dashboard', icon: 'pi pi-clock',
          items: [
            { label: 'Pre-Open market', routerLink: '/portal/pre-open-market' },
            { label: 'Fii & Dii Activity', routerLink: '/portal/fii-dii-activity', },
            { label: 'Adv. Support resistance', routerLink: '/portal/adv-support-resistance' },
            { label: 'Trade Analysis', routerLink: '/portal/trade-analysis' },
            { label: 'Option Chain', routerLink: '/portal/option-chain' },
            { label: 'Streaming Data', routerLink: '/portal/streaming-data' },
            { label: 'Paper Trading', routerLink: '/portal/paper-trading' }
          ]
        },
        {
          label: 'Stocks Scans', icon: 'pi pi-database',
          items: [
            { label: 'Breaks Out', routerLink: '/portal/breaks-out' },
            { label: 'Ema Cross Over', routerLink: '/portal/ema-cross-over' },
            { label: 'RSI', routerLink: '/portal/rsi' },
            { label: 'Candlesticks', routerLink: '/portal/candlesticks' },
          ]
        },
        { label: 'Portfolio', icon: 'pi pi-briefcase', routerLink: '/portal/trading-terminal' },
        { label: 'Derivative Algo', icon: 'pi pi-desktop', routerLink: '/portal/derivative-algo' },

      ];
    } else if (this.userdetails.role == 'admin') {
      this.menuItems = [
        { label: 'Dashboard', icon: 'pi pi-clock', routerLink: '/admin/dashboard' },
        { label: 'Users', icon: 'pi pi-clock', routerLink: '/admin/users' },
        { label: 'Package', icon: 'pi pi-clock', routerLink: '/admin/packages' },
      ]

    }


    this.profileItems = [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        command: () => {
          this.router.navigate(['/portal/profile']);
        }
      },
      {
        label: 'Trading Account',
        icon: 'pi pi-cog',
        command: () => {
          this.router.navigate(['/portal/account']);
        }
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => {
          this.auth.logout();
        }
      }
    ];
  }


  toggleDarkMode() {
    this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
  }
}
