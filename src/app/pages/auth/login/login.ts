import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
// import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { first } from 'rxjs';
import { AuthService } from '@/services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [RouterLink,ToastModule, RouterModule, ButtonModule, FormsModule, ReactiveFormsModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule,MessageModule],
    templateUrl: './login.html',
    styleUrls:['./login.scss'],
    providers: [MessageService]
})
export class Login implements OnInit {
    loginForm: any;
    signUpForm: any;
    userData: any;
    ipAddress: any;
    deviceInfo: any;

    checked: boolean = false;
    fb = inject(FormBuilder);
    router = inject(Router);
    authService = inject(AuthService);
    toast = inject(MessageService);

    ngOnInit(): void {
        this.userData = JSON.parse(localStorage.getItem('user') || 'null');
        if (this.userData) {
            this.router.navigate(['/portal/pre-open-market']);
        } else {
            this.router.navigate(['/auth/login']);
        }

        this.loginForm = this.fb.group({
            mobile: ['', [Validators.required, this.customEmailValidator]],
            password: ['', Validators.compose([Validators.required])],
        });

        this.signUpForm = this.fb.group({
            mobile: ['', Validators.compose([Validators.required])],
            password: ['', Validators.compose([Validators.required])],
            name: ['', Validators.compose([Validators.required])],
            email: [
                '',
                Validators.compose([
                    Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
                    Validators.required,
                ]),
            ],
            termsCondition: [false, Validators.requiredTrue],
        });
    }

    customEmailValidator(control: AbstractControl) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(control.value) ? null : { invalidEmail: true };
    }

    login() {

        this.loginForm.value.username;
        this.authService
            .login(this.loginForm.value.mobile, this.loginForm.value.password)
            .pipe(first())
            .subscribe(
                (dt: any) => {
                    if (dt?.status == 401) {
                        this.toast.add({ severity: 'error', summary: 'Alert', detail: dt.error.message });
                    } else if (dt?.status == 500) {
                        this.toast.add({ severity: 'error', summary: 'Alert', detail: 'Something went wrong' });
                    } else {
                        // this.getIpAddress();
                        if (dt.role == 'user') {
                            this.router.navigate(['/portal/pre-open-market']);
                        } else if (dt.role == 'admin') {
                            this.router.navigate(['/admin/dashboard']);
                        } 
                        this.toast.add({ severity: 'success', summary: 'Success', detail: 'Login successfully' });
                    }
                },
                (error: any) => {
                        this.toast.add({ severity: 'error', summary: 'Alert', detail: error });
                },
            );

    }

    signUp() {
        if (this.signUpForm.invalid) {
            return;
        } else {
            const data = {
                phone: this.signUpForm.value.mobile.e164Number,
                email: this.signUpForm.value.email,
                username: this.signUpForm.value.mobile.e164Number,
                password: this.signUpForm.value.password,
                name: this.signUpForm.value.name,
            };
            this.authService.registration(data).subscribe(
                (dt: any) => {
                    if (dt.status == 409) {
                        // this.toast.showError('User already exist', 'Error');
                    } else if (dt.status == 500) {
                        // this.toast.showError('Something went wrong', 'Error');
                    } else {
                        localStorage.setItem('user', JSON.stringify(dt));
                        // this.modalService.dismissAll();
                        // this.toast.showSuccess('User registered successfully', 'Success');
                        if (dt.role == 'user') {
                            this.router.navigate(['/portal']);
                        } else if (dt.role == 'admin') {
                            this.router.navigate(['/admin/']);
                        }
                    }
                },
                (error: any) => {
                    // this.toast.showError('Something went wrong', 'Error');
                },
            );
        }
    }

}
