import { PortalService } from '@/services/portal.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import moment from 'moment';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
@Component({
  selector: 'app-rsi',
  imports: [CommonModule, FormsModule, InputTextModule, CardModule],
  templateUrl: './rsi.html',
  styleUrl: './rsi.scss'
})
export class Rsi implements OnInit {
  emaCrossoverData: any = [];
  data_available!: boolean;
  selected_date: string = '2023-04-28';
  userdata: any;
  today: Date;

  constructor(public pService: PortalService) {
    this.today = new Date();
    let data = '';
    this.selected_date = moment().format('YYYY-MM-DD');
    this.userdata = JSON.parse(localStorage.getItem('user') || '{}');

  }
  ngOnInit(): void {
    if (this.userdata?.packagename == 'PRO TRADER' ) {
      this.getEmaCrossOver();
    }
  }

  getEmaCrossOver() {
    if (this.userdata?.packagename == 'PRO TRADER' ) { //if usr
      if (this.selected_date) {
        this.pService
          .getStockIntraday(
            'tgc_rsi',
            moment(this.selected_date).format('YYYY-MM-DD'),
          )
          .subscribe(
            (res: any) => {
              console.log(res);
              if (res.stocks.length != 0) {
                this.emaCrossoverData = res.stocks;
                this.data_available = true;
              } else {
                this.data_available = false;
              }
            },
            (err) => {
            },
          );
      }
    }
  }

  openPlaceOrder(dt: any) {

  }
}

