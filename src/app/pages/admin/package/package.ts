import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { AdminService } from '../admin';
import { ErrorhandlerService } from '@/services/errorhandler.service';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumber, InputNumberModule } from 'primeng/inputnumber';
@Component({
  selector: 'app-package',
  imports: [CommonModule, FormsModule, RadioButtonModule, InputNumberModule, TableModule, DialogModule, ButtonModule, InputTextModule, SelectModule, TextareaModule, CardModule, ToastModule, ConfirmDialogModule],
  templateUrl: './package.html',
  styleUrl: './package.scss',
  providers: [MessageService, DialogService, ConfirmationService]
})
export class Package implements OnInit {
  userdata: any;
  totalRecords = 0;
  packagelist: any[] = [];
  showCreateDialog = false;
  showEditDialog = false;


  name: any = '';
  price: any = '';
  isdiscount: any = true;
  period: any = '';
  status: any = '';
  discountedprice: any = 0;
  description: any = '';
  features: any = [];
  editingdata: any={};
  disabled_features: any;
  loading!: boolean;
  globalSearchText: any;
  statusOptions = [
    { label: 'Active', value: 'Active' },
    { label: 'Disabled', value: 'Disabled' }
  ];
  constructor(
    private http: HttpClient,
    private adminService: AdminService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private errorHandler: ErrorhandlerService
  ) {
    this.userdata = JSON.parse(localStorage.getItem('user')!);
  }

  ngOnInit(): void {
    this.getAllPackages();
  }

  getAllPackages() {
    this.loading = true;


    this.adminService.getAllPackages().subscribe(
      (res: any) => {
        this.packagelist = res;
        this.totalRecords = res.recordsFiltered;
        this.loading = false;
      },
      (err) => {
        const msg = this.errorHandler.handleError(err);
        this.messageService.add({ severity: 'error', summary: 'Alert', detail: msg });
        this.loading = false;
      }
    );
  }
  createPackage(f: any) {
    let data = {
      name: this.name,
      price: this.price,
      isdiscount: this.isdiscount,
      discountedprice: this.discountedprice,
      period: this.period,
      description: this.description,
      disabled_features: this.disabled_features,
      features: this.features,
      status: this.status,
    }
    this.adminService.createPackge(data).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Package Created Successfully' });
        this.showCreateDialog=false;
        this.getAllPackages();
      },
      error: (err) => {
        const msg = this.errorHandler.handleError(err);
        this.messageService.add({ severity: 'error', summary: 'Alert', detail: msg });
      }
    })
  }

  open() {
    this.showCreateDialog = true;
  }

  editPackage(data: any) {
    this.editingdata = { ...data };
    this.showEditDialog = true;
  }

  updatePackage(f: any) {
    this.adminService.updatePackge(this.editingdata).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Package updated Successfully' });
        this.showEditDialog = false;
        this.getAllPackages();
      },
      error: (err) => {
        const msg = this.errorHandler.handleError(err);
        this.messageService.add({ severity: 'error', summary: 'Alert', detail: msg });
      }
    })
  }

  confirmDelete(dt: any) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete package ?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => this.deletePackage(dt),
    });
  }

  deletePackage(pk: any) {
    this.adminService.deletePackage(pk.id).subscribe(
      (res) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Deleted successfully' });
        this.getAllPackages()
      },
      (err) => {
        // const msg = this.errorHandler.handleError(err);
        this.messageService.add({ severity: 'error', summary: 'Alert', detail: err.error.message });
      }
    );
  }

}
