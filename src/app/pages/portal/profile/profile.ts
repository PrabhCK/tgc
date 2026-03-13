import { Component, inject, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PortalService } from '@/services/portal.service';
import { HttpHeaders } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule,FormsModule,ReactiveFormsModule, CardModule, InputTextModule, ButtonModule, InputGroupModule, InputGroupAddonModule,ToastModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  providers:[MessageService]
})
export class Profile {
  baseurl = environment.baseurl + '/users';
  userdata: any = {};
  userLocal: any;
  email = '';
  cPasswordForm: any;
  isTextFieldType!: boolean;
  isTextFieldType1!: boolean;
  tradingviewid: any;
  toast = inject(MessageService);

  constructor(
    private fb: FormBuilder,
    private portalService: PortalService,
  ) {
    this.userLocal = JSON.parse(localStorage.getItem('user') || '{}');
    this.data();
    this.cPasswordForm = this.fb.group({
      password: [''],
      cpassword: ['']
    })
  }

  data() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        Authorization: 'Bearer ' + this.userLocal.accesstoken,
      }),
    };

    this.portalService.getProfileDetails(this.userLocal.id).subscribe(
      (res: any) => {
        this.userdata = res;
        console.log(this.userdata);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  togglePasswordFieldType() {
    this.isTextFieldType = !this.isTextFieldType;
  }
  togglePasswordFieldType1() {
    this.isTextFieldType1 = !this.isTextFieldType1;
  }

  changeEmail() {
    let data = {
      email: this.email
    }
    this.portalService.changeEmail(data).subscribe((res) => {
      this.data();
      this.toast.add({ severity: 'success', summary: 'Success', detail: 'Email changed successfully' });
      this.data();
    }, (err) => {
      this.toast.add({ severity: 'error', summary: 'Alert', detail: 'Something went wrong' });
    })
  }

  changePassword() {
    let data = {
      password: this.cPasswordForm.value.password
    }
    this.portalService.changePassword(data).subscribe((res) => {
      this.data();
      this.toast.add({ severity: 'success', summary: 'Success', detail: 'Password changed successfully' });
    }, (err) => {
      this.toast.add({ severity: 'error', summary: 'Alert', detail: 'Something went wrong' });
    })
  }
  
}
