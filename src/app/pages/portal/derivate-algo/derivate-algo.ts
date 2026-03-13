import { PortalService } from '@/services/portal.service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-derivate-algo',
  imports: [CommonModule, FormsModule, RadioButtonModule, ToastModule, DialogModule, SelectModule, TooltipModule, ButtonModule, CardModule, ConfirmDialogModule],
  templateUrl: './derivate-algo.html',
  styleUrl: './derivate-algo.scss',
  providers: [MessageService, ConfirmationService]
})
export class DerivateAlgo implements OnInit {
  user: any = localStorage.getItem('user');
  tooltipforStatus =
    'If you select Start, then it will take trades in your trading account. If you want to stop trading, select Stop.';
  strategyList: any[] = [];
  accountData: any;
  disclaimerVisible = true;
  toast = inject(MessageService);
  userdata: any;
  constructor(public pService: PortalService, private confirmationService: ConfirmationService
  ) {
        this.userdata = JSON.parse(localStorage.getItem('user')||'{}');

  }
  ngOnInit(): void {
    if ( this.userdata?.packagename == 'PRO TRADER'|| this.userdata?.packagename == 'ALGO TRADER') { //if usr
      this.getAccountData();
      this.getStrategyList();
    }
  }
  getAccountData() {
    this.pService.getAccountData().subscribe(
      (res: any) => {
        this.accountData = res;
      },
      (e) => {
        if (e.status == 500) {
          this.toast.add({ severity: 'error', summary: 'Alert', detail: 'Something went wrong' });
        } else if (e.status == 404) {
          this.toast.add({ severity: 'error', summary: 'Alert', detail: 'Account us not added, please add it in account section' });
        }
      },
    );
  }

  getStrategyList() {
    this.pService.getMarketPlaceStrategy().subscribe(
      (res: any) => {

        this.strategyList = res;
        this.strategyList.forEach((element: any) => {
          element.numbers = Array(element.max_quantity)
            .fill(1)
            .map((x, i) => i + 1); // [0,1,2,3,4]
        });
        // this.strategyList[0].img = 'assets/strategy/1.png';
        // this.strategyList[1].img = 'assets/strategy/2.png';
        // this.strategyList[2].img = 'assets/strategy/3.png';
        // this.strategyList[3].img = 'assets/strategy/4.png';
        // this.strategyList[4].img = 'assets/strategy/5.png';
        // this.strategyList[5].img = 'assets/strategy/6.png';
      },
      (err) => {
        var error = JSON.stringify(err.error.message);
        this.toast.add({ severity: 'error', summary: 'Alert', detail: error });
        // this.router.navigate(['/portal/pricing']);
      },
    );
  }

  onImgError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'https://placehold.co/250x160?text=Image not available';
  }
  subscribe(i: any) {
    if (this.accountData) {
      window.open(i.paymentlink, "_blank");
    } else {
      this.toast.add({ severity: 'error', summary: 'Alert', detail: 'Account us not added, please add it in account section' });
    }
  }

  confirm(dt: any) {
    // if (this.loginid) {
    this.confirmationService.confirm({
      message: 'Are you sure to do changes?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.update(dt);
      }
    });
    // } else {
    //   this.toast.add({ severity: 'error', summary: 'Alert', detail: 'Add your trading account in account section' });
    // }
  }

  update(i: any) {
    let data = {
      start_trading: i.start_trading,
      quantity: i.quantity ? Number(i.quantity) : 1,
      groupname: i.name,
    };
    this.pService.updateMarketplaceStrategy(data).subscribe(
      (res: any) => {
        this.toast.add({ severity: 'success', summary: 'Success', detail: 'Updated successfully' });
      },
      (err) => {
        var error = JSON.stringify(err.error.message);
        this.toast.add({ severity: 'error', summary: 'Alert', detail: error });
      },
    );
  }
}
