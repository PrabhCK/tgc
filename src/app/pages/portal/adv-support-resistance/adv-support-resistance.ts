import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { environment } from 'src/environments/environment';
import moment from 'moment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-adv-support-resistance',
  imports: [CommonModule, DatePickerModule, FormsModule, SelectModule, CardModule, ButtonModule, CheckboxModule, InputTextModule, ToastModule, ConfirmDialogModule],
  templateUrl: './adv-support-resistance.html',
  styleUrl: './adv-support-resistance.scss',
  standalone: true,
  providers: [MessageService, ConfirmationService]

})
export class AdvSupportResistance {
  resistancedata: any = {
    NIFTY: [],
    FINNIFTY: [],
    BANKNIFTY: [],
  };
  today: Date;
  selected_date: string;
  userdata: any;
  token: any;
  secondtimerSubscription: any;
  qty: number = 100;
  opendata: any = {};
  stocklist: any;
  stockname: any = 'ADANIENT';
  opendatavalue: any;
  baseurl = environment.baseurl + '/support_resistance/index';
  tdata: any;
  data_available!: boolean;
  toast = inject(MessageService);
  objectKeys = Object.keys;

  constructor(
    private http: HttpClient,
  ) {
    this.today = new Date();
    let data = '';
    this.selected_date = moment().format('YYYY-MM-DD');
    this.userdata = JSON.parse(localStorage.getItem('user') || '{}');
    this.token = this.userdata.accesstoken;
    this.getDate();
  }
  ngOnInit(): void { }

  getDate() {
    if (this.userdata?.packagename == 'PRO TRADER') { //if usr

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          Authorization: 'Bearer ' + this.token,
        }),
      };

      this.http
        .get(
          environment.baseurl + '/support_resistance/get_date', httpOptions
        )
        .subscribe(
          (res: any) => {
            this.selected_date = res;
            this.initialfetch();

          },
          (err: any) => {
            if (err.status == 403) {
              this.toast.add({ severity: 'error', summary: 'Alert', detail: err.error.message });
            } else {
              this.toast.add({ severity: 'error', summary: 'Alert', detail: err.error.message });
            }
          }
        );
    }
  }

  initialfetch() {
    if (this.userdata?.packagename == 'PRO TRADER') { //if usr

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          Authorization: 'Bearer ' + this.token,
        }),
      };
      if (this.selected_date) {
        this.http
          .get(
            this.baseurl +
            '?date=' +
            moment(this.selected_date).format('YYYY-MM-DD'),
            httpOptions
          )
          .subscribe(
            (res: any) => {
              if (res?.BANKNIFTY?.s1 != undefined) {
                this.resistancedata = res;
                this.data_available = true;
              } else {
                this.data_available = false;
              }
            },
            (err: any) => {
              this.toast.add({ severity: 'error', summary: 'Alert', detail: err.error.messsage });
            }
          );
      }
    }
  }
}
