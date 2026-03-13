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
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule, TableModule, DialogModule,InputIconModule,IconFieldModule, ButtonModule, InputTextModule, SelectModule, TextareaModule, CardModule, ToastModule, ConfirmDialogModule],
  templateUrl: './users.html',
  styleUrl: './users.scss',
  providers: [MessageService, DialogService, ConfirmationService]
})
export class Users implements OnInit {
  token: any;
  userdata: any;
  userlist: any[] = [];
  packagelist: any[] = [];
  totalRecords = 0;
  loading = false;

  // Dialogs
  showCreateDialog = false;
  showEditDialog = false;

  name = '';
  phone = '';
  email = '';
  password = '';
  startdate = '';
  enddate = '';
  institute_code = '';
  comment = '';
  packageid = '';

  editingdata: any = {
    packageid:null
  };
  editingIndex = 0;
  globalSearchText: any;
  constructor(
    private http: HttpClient,
    private adminService: AdminService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {
    this.userdata = JSON.parse(localStorage.getItem('user')!);
    this.token = this.userdata.accesstoken;
    this.institute_code = this.userdata.institute_code?.toUpperCase();
  }

  ngOnInit(): void {
    this.fetchPackages();
    this.getAllUsers({ first: 0, rows: 10 });
  }

  fetchPackages() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.token,
      }),
    };
    this.http.get(environment.baseurl + '/packages', httpOptions).subscribe(
      (res: any) => {
        this.packagelist = res;
      },
      (err) => {
        // const msg = this.errorHandler.handleError(err);
        this.messageService.add({ severity: 'error', summary: 'Alert', detail: err.error.message });
      }
    );
  }

  getAllUsers(event: any) {
    this.loading = true;
    const payload = {
      draw: 0,
      start: event.first,
      length: event.rows,
      search: this.globalSearchText
    };

    this.adminService.getAllUsers(payload).subscribe(
      (res: any) => {
        this.userlist = res.data;
        this.totalRecords = res.recordsFiltered;
        this.loading = false;
      },
      (err) => {
        // const msg = this.errorHandler.handleError(err);
        this.messageService.add({ severity: 'error', summary: 'Alert', detail: err.error.message });
        this.loading = false;
      }
    );
  }

  formatDateDisplay(dateStr: string): any {
    // Check for dd-MM-yyyy
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
      return dateStr;
    }
  }

  onGlobalSearch(event: any) {
  this.globalSearchText = event.target.value;
  this.getAllUsers({ first: 0, rows: 10 }); // re-fetch from page 1
}

  // ✅ PrimeNG confirm dialog delete
  confirmDelete(user: any) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete user ?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => this.deleteUser(user),
    });
  }

  deleteUser(user: any) {
    this.adminService.deleteUser(user.id).subscribe(
      (res) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Deleted successfully' });
        this.getAllUsers({first:0,rows:10})
      },
      (err) => {
        // const msg = this.errorHandler.handleError(err);
        this.messageService.add({ severity: 'error', summary: 'Alert', detail: err.error.message });
      }
    );
  }

  // ✅ Dialog create user
  openCreateDialog() {
    this.showCreateDialog = true;
    this.name = '';
    this.email = '';
    this.phone = '';
    this.password = '';
    this.packageid = '';
  }

  createUser(f: NgForm) {
    if (!this.email || !this.password) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Email and password required' });
      return;
    }

    if (this.password.length < 6) {
      this.messageService.add({ severity: 'error', summary: 'Alert', detail: 'Password must be at least 6 characters' });
      return;
    }

    const logindata = {
      username: this.email,
      password: this.password,
      name: this.name,
      phone: this.phone,
      email: this.email,
      packageid: this.packageid,
    };

    this.adminService.createUsers(logindata).subscribe(
      (res) => {
        this.showCreateDialog = false;
        this.getAllUsers({ first: 0, rows: 10 });
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User created successfully' });
      },
      (err) => {
        this.messageService.add({ severity: 'error', summary: 'Alert', detail: err.error.message });
      }
    );
  }

  open() {
    this.showCreateDialog = true;
  }

  editUser(user: any) {
    this.editingdata = { ...user };
    this.showEditDialog = true;
  }

  editComment() {

  }
  editRow(i: any, data: any) {

  }

  updateUser(f: any) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.token,
      }),
    };

    this.http
      .put(environment.baseurl + '/users/' + this.editingdata.id, this.editingdata, httpOptions)
      .subscribe(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Updated successfully' });
          this.showEditDialog = false;
          this.getAllUsers({ first: 0, rows: 10 });
        },
        (err) => {
          // const msg = this.errorHandler.handleError(err);
          this.messageService.add({ severity: 'error', summary: 'Alert', detail: err.error.message });
        }
      );
  }

  exportToExcel() {
    const payload = {
      draw: 0,
      start: 0,
      length: -1, // 👈 fetch all records
    };

    this.adminService.getAllUsers(payload).subscribe(
      (res: any) => {
        const users = res.data;

        // Create worksheet from JSON
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(users);

        // Create workbook and append sheet
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Users');

        // Download Excel file
        XLSX.writeFile(wb, 'all-users.xlsx');
      },
      (err) => {
        this.messageService.add({ severity: 'error', summary: 'Alert', detail: 'Failed to export users' });
      }
    );
  }
}