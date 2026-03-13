import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin';
import { ErrorhandlerService } from '@/services/errorhandler.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-dashboard',
  imports: [ToastModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
    providers: [MessageService]

})
export class Dashboard implements OnInit {
  dashboardData: any = {};
  constructor(private adminService: AdminService, public erroHandler: ErrorhandlerService, private messageService: MessageService,) { }
  ngOnInit() {
    this.getDashboardData();
  }
  getDashboardData() {
    this.adminService.getDashboardData().subscribe({
      next: (res) => {
        this.dashboardData = res;
      },
      error: (err) => {
        let message = this.erroHandler.handleError(err);
        this.messageService.add({ severity: 'error', summary: 'Alert', detail: err.error.message });

      }
    })
  }
}
