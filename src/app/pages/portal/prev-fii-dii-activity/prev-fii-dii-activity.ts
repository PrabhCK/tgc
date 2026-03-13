import { PrefixPipe } from '@/pipes/prefix.pipe';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxEchartsModule } from 'ngx-echarts';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import moment from 'moment';
import { PortalService } from '@/services/portal.service';
import { Empty } from '../../empty/empty';

@Component({
  selector: 'app-prev-fii-dii-activity',
  imports: [CommonModule, TableModule, FormsModule, SelectModule, DatePickerModule, NgxEchartsModule, ButtonModule, DatePickerModule, InputTextModule, CardModule, Empty, PrefixPipe],
  templateUrl: './prev-fii-dii-activity.html',
  styleUrl: './prev-fii-dii-activity.scss'
})
export class PrevFiiDiiActivity {
  resistancedata: any = {
    NIFTY: [],
    FINNIFTY: [],
    BANKNIFTY: [],
  };
  today: Date;
  selected_date: any;
  userdata: any;
  token: any;
  secondtimerSubscription: any;
  qty: number = 100;
  opendata: any = {};
  stocklist: any;
  stockname: any = 'ADANIENT';
  opendatavalue: any;
  // baseurl = environment.baseurl + '/support_resistance/index';
  tdata: any;
  data_available!: boolean;
  legs!: number;

  constructor(
    private pservice: PortalService
  ) {
    this.today = new Date();
    let data = '';
    this.selected_date = new Date();
    this.userdata = JSON.parse(localStorage.getItem('user') || '{}');
    this.token = this.userdata.accesstoken;
    this.getDate();
  }
  ngOnInit(): void { }

  getDate() {
    this.pservice.getDateofFiiDii().subscribe({
      next: (res: any) => {
        this.selected_date = new Date(res);
        this.initialfetch();
      },
      error: (err) => {

      }
    });
  }

  initialfetch() {
    if (this.stockname == 'NIFTY') {
      this.legs = 3;
    } else if (this.stockname == 'BANKNIFTY') {
      this.legs = 5;
    }
    if (this.selected_date) {
      if (this.selected_date) {
        this.pservice.getFiiDiiData(moment(this.selected_date).format('YYYY-MM-DD'))
          .subscribe({
            next: (res: any) => {
              if (res.index != undefined) {
                this.tdata = res;
                this.data_available = true;
              } else {
                this.data_available = false;
              }
            },
            error: (err: any) => {

            }
          });
      }
    }
  }

  getIndexViewClass(indexview: string): string {
    switch (indexview) {
      case 'Unwounded Long':
      case 'Unwounded Long Aggressively':
        return 'bg-red-400 text-white p-1 rounded text-center';
      case 'Added Long':
      case 'Added Long Aggressively':
        return 'bg-green-600 text-white p-1 rounded text-center';
      case 'Covered Short':
      case 'Covered Short Aggressively':
        return 'bg-green-300 text-dark p-1 rounded text-center';
      case 'Added Short':
      case 'Added Short Aggressively':
        return 'bg-red-600 text-white p-1 rounded text-center';
      default:
        return 'p-1 text-center'; // fallback
    }
  }
  viewClassMap: Record<string, string> = {
    Bearish: 'text-red-600 p-2 rounded text-center',
    Bullish: 'text-green-600 p-2 rounded text-center',

    'Unwounded Long': 'bg-red-400 text-white p-2 rounded text-center',
    'Unwounded Long Aggressively': 'bg-red-200 text-white p-2 rounded text-center',

    'Added Long': 'bg-green-600 text-white p-2 rounded text-center',
    'Added Long Aggressively': 'bg-green-600 text-white p-2 rounded text-center',

    'Covered Short': 'bg-green-300 text-dark p-2 rounded text-center',
    'Covered Short Aggressively': 'bg-green-200 text-white p-2 rounded text-center',

    'Added Short': 'bg-red-600 text-white p-2 rounded text-center',
    'Added Short Aggressively': 'bg-red-600 text-white p-2 rounded text-center'
  };
}
