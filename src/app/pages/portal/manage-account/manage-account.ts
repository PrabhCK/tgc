import { PortalService } from '@/services/portal.service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import moment from 'moment';
import { environment } from 'src/environments/environment';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-manage-account',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SelectModule, CardModule, ButtonModule,CheckboxModule, ToastModule,ConfirmDialogModule],
  templateUrl: './manage-account.html',
  styleUrl: './manage-account.scss',
  providers: [MessageService, ConfirmationService]
})
export class ManageAccount implements OnInit {
  stockbroker = '';
  loginid: any;
  password: any;
  password2fa: any;
  apikey: any;
  apisecret: any;
  appid: any;
  accesstoken: any;
  status: any;
  message: any;
  name: any;
  startingdate: any;
  endingdate: any;
  userdetails: any;
  username: any;
  token: any;
  accountid: any;
  accountdata: any;
  validated!: boolean;
  validatedData: any;
  mobile: any;
  totp: any;
  totpkey: any;
  email: any;
  pan: any;
  autologin: any = false;
  accountForm: any;
  loginUrl: string = '';
  isAccountDataRecieved!: boolean;
  stocklist = [
    { name: 'aliceblue', image: 'https://takeiteasy.co.in/assets/aliceblue.png', brokerage: 20, link: 'https://ekyc.aliceblueonline.com/?source=SVZG285' },
    {name: 'bajaj',image:'/assets/bajaj.png'}
    // { name: 'angelbroking', image: 'https://takeitheze.in/assets/angel.png', brokerage: 20, link: 'https://tinyurl.com/22oewf7a' },
  ];
  stockBrokers=[
    {label:'ALICEBLUE',value:'ALICEBLUE'}
  ];
  
  toast = inject(MessageService);

  constructor(
    private pService: PortalService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService

  ) {
    this.userdetails = JSON.parse(localStorage.getItem('user') || '{}');
    this.username = this.userdetails.name;
    this.token = this.userdetails.accesstoken;
  }

  ngOnInit(): void {
    this.getAccountData();
    this.loadAccountForm();
  }

  loadAccountForm() {
    this.accountForm = this.fb.group({
      stockbroker: [''],
      loginid: [''],
      password: [''],
      password2fa: [''],
      apikey: [''],
      apisecret: [''],
      appid: [''],
      appkey:[''],
      totpkey: [''],
      name: [''],
      pan: [''],
      email: [''],
      mobile: [''],
      startdate: [''],
      enddate: [''],
      autologin: [false],
    });
  }

  getAccountData() {
   
    this.isAccountDataRecieved = true;
    this.pService.getAccountData().subscribe(
      (res: any) => {
        res=
        this.accountdata = res;
        this.accountForm = this.fb.group({
          stockbroker: [this.accountdata.stockbroker],
          loginid: [this.accountdata.loginid],
          password: [this.accountdata.password],
          password2fa: [this.accountdata.password2fa],
          apikey: [this.accountdata.apikey],
          totpkey: [this.accountdata.totpkey],
          apisecret: [this.accountdata.apisecret],
          appid: [this.accountdata.appid],
          appkey: [this.accountdata.appkey],
          name: [this.accountdata.name],
          pan: [this.accountdata.pan],
          email: [this.accountdata.email],
          mobile: [this.accountdata.mobile],
          startdate: [{ value: this.accountdata.startdate, disabled: true }],
          enddate: [{ value: this.accountdata.enddate, disabled: true }],
          autologin: [this.accountdata.autologin],
        });
        this.accountForm.get('stockbroker').disable();
        this.accountForm.get('loginid').disable();
        this.accountdata.name
          ? this.accountForm.get('name').disable()
          : this.accountForm.get('name').enable();
        this.accountdata.pan
          ? this.accountForm.get('pan').disable()
          : this.accountForm.get('pan').enable();
        this.accountdata.email
          ? this.accountForm.get('email').disable()
          : this.accountForm.get('email').enable();
        this.accountdata.mobile
          ? this.accountForm.get('mobile').disable()
          : this.accountForm.get('mobile').enable();
        this.isAccountDataRecieved = false;
      },
      (err) => {
        if (err.status == 404) {
          this.isAccountDataRecieved = false;
          this.accountForm = this.fb.group({
            stockbroker: [''],
            loginid: [''],
            password: [''],
            password2fa: [''],
            apikey: [''],
            appid: [''],
            appkey: [''],
            totpkey: [''],
            apisecret: [''],
            name: [''],
            pan: [''],
            email: [''],
            mobile: [''],
            startdate: [
              { value: moment().format('YYYY-MM-DD'), disabled: true },
            ],
            enddate: [{ value: '', disabled: true }],

            autologin: [false],
          });
        }
      },
    );
  }

  deleteAcc() {
    this.confirmationService.confirm({
      message: 'Do you want to delete account information?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.pService.deleteAccount().subscribe(
          (res: any) => {
            this.toast.add({ severity: 'success', summary: 'Success', detail: 'Accound information deleted successfully' });

            this.accountdata = undefined;
            this.accountForm.enable(); // Enables all controls
            this.accountForm.reset();

          },
          (err: any) => {
            this.toast.add({ severity: 'error', summary: 'Alert', detail: err });
          },
        );
      }
    })
  }


  getAutoLoginValue(e:any) {
    if (e.checked) {
      this.autologin = true;
    } else {
      this.autologin = false;
    }
  }

  isBrokerValue() {
    if (
      this.accountForm.get('stockbroker').value == '' ||
      this.accountForm.get('stockbroker').value == null
    ) {
      return false;
    } else {
      return true;
    }
  }

  validate() {
    if (this.accountdata?.id) {
      let data: any = {};
      if (this.autologin || this.accountdata.autologin) {
        data = {
          stockbroker: this.accountForm.getRawValue().stockbroker,
          loginid: this.accountForm.getRawValue().loginid,
          apikey: this.accountForm.getRawValue().apikey,
          appid: this.accountForm.getRawValue().appid,
          appkey: this.accountForm.getRawValue().appkey,
          apisecret: this.accountForm.getRawValue().apisecret,
          autologin: this.accountForm.getRawValue().autologin,
          password: this.accountForm.getRawValue().password,
          password2fa: this.accountForm.getRawValue().password2fa,
          totpkey: this.accountForm.getRawValue().totpkey,
        };
      } else {
        data = {
          stockbroker: this.accountForm.getRawValue().stockbroker,
          loginid: this.accountForm.getRawValue().loginid,
          apikey: this.accountForm.getRawValue().apikey,
          appid: this.accountForm.getRawValue().appid,
          appkey: this.accountForm.getRawValue().appkey,
          autologin: this.accountForm.getRawValue().autologin,
          // password:this.accountForm.value.password,
          // password2fa:this.accountForm.value.password2fa,
          // totpkey:this.accountForm.value.totpkey
        };
      }
      if (this.accountForm.getRawValue().stockbroker == 'STOXKART') {
        delete data.password2fa
      }
      if (this.accountForm.getRawValue().stockbroker == 'ALICEBLUE') {
        delete data.apisecret
      }

      this.pService.validateAccount(data).subscribe(
        (res: any) => {
          this.toast.add({ severity: 'success', summary: 'Success', detail: 'Trading Account Validated' });

          this.validated = true;
          this.valiidatesData(res);
        },
        (err) => {
          var error = err.error.message;
          this.toast.add({ severity: 'error', summary: 'Alert', detail: error });
          console.log(err.error.message);
        },
      );
    } else {
      if (
        this.accountForm.getRawValue().stockbroker == '' ||
        this.accountForm.getRawValue().stockbroker == null ||
        this.accountForm.getRawValue().stockbroker == undefined
      ) {
        this.toast.add({ severity: 'error', summary: 'Alert', detail: 'Select Stock Broker' });
      } else if (
        this.accountForm.getRawValue().loginid == '' ||
        this.accountForm.getRawValue().loginid == null ||
        this.accountForm.getRawValue().loginid == undefined
      ) {
        this.toast.add({ severity: 'error', summary: 'Alert', detail: 'Enter Login ID' });
      } else if (
        (this.accountForm.getRawValue().password == '' ||
          this.accountForm.getRawValue().password == null ||
          this.accountForm.getRawValue().password == undefined) &&
        this.autologin &&
        this.accountForm.get('stockbroker').getRawValue() != 'ANGELBROKING'
      ) {
        this.toast.add({ severity: 'error', summary: 'Alert', detail: 'Enter Password' });

      } else if (
        this.accountForm.getRawValue().appid == '' ||
        this.accountForm.getRawValue().appid == null ||
        this.accountForm.getRawValue().appid == undefined
      ) {
        this.toast.add({ severity: 'error', summary: 'Alert', detail: 'Enter App Key' });
      }  else if (
        this.accountForm.getRawValue().appkey == '' ||
        this.accountForm.getRawValue().appkey == null ||
        this.accountForm.getRawValue().appkey == undefined
      ) {
        this.toast.add({ severity: 'error', summary: 'Alert', detail: 'Enter App Secret Key' });
      }
      else if (
        (this.accountForm.getRawValue().totpkey == '' ||
          this.accountForm.getRawValue().totpkey == null ||
          this.accountForm.getRawValue().totpkey == undefined) &&
        this.autologin
      ) {
        this.toast.add({ severity: 'error', summary: 'Alert', detail: 'Enter TOTP key' });
      }
      // else if (
      //   (this.accountForm.getRawValue().password2fa == '' ||
      //     this.accountForm.getRawValue().password2fa == null ||
      //     this.accountForm.getRawValue().password2fa == undefined) &&
      //   this.autologin &&
      //   this.accountForm.get('stockbroker').getRawValue() != 'STOXKART'

      // ) {
      //   this.toast.add({ severity: 'error', summary: 'Alert', detail: 'Enter Security Answer(2FA)' });
      // } 
      else {
        let data = {};
        if (this.autologin) {
          data = {
            stockbroker: this.accountForm.getRawValue().stockbroker,
            loginid: this.accountForm.getRawValue().loginid,
            apikey: this.accountForm.getRawValue().apikey,
            appid: this.accountForm.getRawValue().appid,
            appkey: this.accountForm.getRawValue().appkey,
            apisecret: this.accountForm.getRawValue().apisecret,
            autologin: this.accountForm.getRawValue().autologin,
            password: this.accountForm.getRawValue().password,
            password2fa: this.accountForm.getRawValue().password2fa,
            totpkey: this.accountForm.getRawValue().totpkey,
          };
        }
        // } else {
        //   data = {
        //     stockbroker: this.accountForm.getRawValue().stockbroker,
        //     loginid: this.accountForm.getRawValue().loginid,
        //     apikey: this.accountForm.getRawValue().apikey,
        //     appid: this.accountForm.getRawValue().appid,
        //     appkey: this.accountForm.getRawValue().appkey,
        //     autologin: this.accountForm.getRawValue().autologin,
        //   };
        // }
        this.validated = false;
        this.pService.validateAccount(data).subscribe(
          (res: any) => {
            this.validated = true;
            this.toast.add({ severity: 'success', summary: 'Success', detail: 'Trading Account Validated' });
            this.valiidatesData(res);
          },
          (err) => {
            var error = err.error.message;
            this.toast.add({ severity: 'error', summary: 'Alert', detail: error });
            console.log(err.error.message);
          },
        );
      }
    }
  }

  gotoLogin() {
    let data = {
      stockbroker: this.accountForm.get('stockbroker').value,
      loginid: this.accountForm.get('loginid').value,
      apikey: this.accountForm.get('apikey').value,
    };
    this.pService.getLoginUrl(data).subscribe(
      (res: any) => {
        window.open(res.loginurl, '_blank');
        //  this.loginUrl=res;
      },
      (err) => {
        this.toast.add({ severity: 'error', summary: 'Alert', detail: err.message });

      },
    );
  }

  valiidatesData(res: any) {
    this.name = res?.profile.name;
    this.mobile = res?.profile.mobile;
    this.pan = res?.profile.pan;
    this.email = res?.profile.email;
    if (this.validated) {
      this.accountForm.controls['stockbroker'].disable();
      this.accountForm.controls['loginid'].disable();
      this.accountForm.controls['password'].disable();
      this.accountForm.controls['password2fa'].disable();
      this.accountForm.controls['apikey'].disable();
      this.accountForm.controls['apisecret'].disable();
      this.accountForm.controls['totpkey'].disable();
    }

    const isValid = (value: any) => !!value && value.trim() !== '';
    isValid(this.name)
      ? this.accountForm.controls['name'].disable()
      : this.accountForm.controls['name'].enable();

    isValid(this.mobile)
      ? this.accountForm.controls['mobile'].disable()
      : this.accountForm.controls['mobile'].enable();

    isValid(this.pan)
      ? this.accountForm.controls['pan'].disable()
      : this.accountForm.controls['pan'].enable();

    isValid(this.email)
      ? this.accountForm.controls['email'].disable()
      : this.accountForm.controls['email'].enable();

    this.accountForm.controls['name'].patchValue(res?.profile.name);
    this.accountForm.controls['mobile'].patchValue(res?.profile.mobile);
    this.accountForm.controls['pan'].patchValue(res?.profile.pan);
    this.accountForm.controls['email'].patchValue(res?.profile.email);
  }

  getAllFormValues() {
    const formValues:any = {};
    Object.keys(this.accountForm.controls).forEach((key) => {
      formValues[key] = this.accountForm.get(key).value;
    });
    return formValues;
  }

  saveTradingAcc() {
    let data: any = this.getAllFormValues();
    data.pm_username = environment.pmusername;
    if (data.stockbroker == 'STOXKART' || data.stockbroker == 'ALICEBLUE') {
      delete data.password2fa;
    }
    if (data.stockbroker == 'ALICEBLUE') {
      delete data.apisecret
    }
    if (this.accountdata?.id) {
      this.pService.updateAcoount(data).subscribe(
        (res) => {
          this.toast.add({ severity: 'success', summary: 'Success', detail: 'Trading Account Updated' });
        },
        (error) => {
          this.toast.add({ severity: 'error', summary: 'Alert', detail: error.message })
        })

    } else {
      this.pService.createAccount(data).subscribe(
        (res) => {
          this.toast.add({ severity: 'success', summary: 'Success', detail: 'Trading Account Updated' });
        },
        (error) => {
          this.toast.add({ severity: 'error', summary: 'Alert', detail: error.message })
        })
    }
  }
  generateTOtp() {
    let data = {
      totpkey: this.accountdata.totpkey
    }
    this.pService.generateTotp(data).subscribe((res: any) => {
      this.totp = res?.totp;
      this.toast.add({
        severity: 'success',
        summary: 'TOTP generated successfully!',
        detail: `TOTP: ${this.totp}`,
        life: 5000 // milliseconds to show
      });
    }, (error: any) => {
      this.toast.add({ severity: 'error', summary: 'Alert', detail: error.message });
    })
  }
}

