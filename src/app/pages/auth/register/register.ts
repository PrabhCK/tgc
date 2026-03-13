import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
// import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { first } from 'rxjs';
import { AuthService } from '@/services/auth.service';
import { MessageService } from 'primeng/api';
import { alphabeticValidator } from '../alphabetic-validator';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [RouterModule, ButtonModule, FormsModule, ReactiveFormsModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule,ToastModule],
    templateUrl: './register.html',
    providers:[MessageService],
    styleUrls:['./register.scss']
})
export class Register implements OnInit {
    registerForm!: FormGroup;
    instituteCode: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private auth: AuthService,
        private router: Router,
        private toast: MessageService,
    ) { }

    ngOnInit(): void {
        // Redirect if user is already logged in
        const userData = localStorage.getItem('user');
        if (userData) {
            this.router.navigate(['/portal']);
            return;
        }

        // Initialize Form
        this.registerForm = this.fb.group({
            username: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            name: ['', [Validators.required, alphabeticValidator]],
            phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
            birthyear: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
            // institute_code: [{ value: '', disabled: false }]
        });

        // Fetch Institute Code from URL Params
        // this.route.paramMap.subscribe(params => {
        //     this.instituteCode = params.get('icode');
        //     if (this.instituteCode) {
        //         this.registerForm.get('institute_code')?.patchValue(this.instituteCode);
        //         this.registerForm.get('institute_code')?.disable();
        //     }
        // });
    }

    get formControls() {
        return this.registerForm.controls;
    }

    validateNameInput(event: KeyboardEvent) {
        const charCode = event.key.charCodeAt(0);
        if (!/^[a-zA-Z\s]$/.test(event.key)) {
            event.preventDefault();
        }
    }

    validateNumericInput(event: KeyboardEvent) {
        if (!/^\d$/.test(event.key)) {
            event.preventDefault();
        }
    }

    register() {
        if (this.registerForm.invalid) return;

        const user = { ...this.registerForm.getRawValue() };
        user.email = user.username.toLowerCase();
        user.username = user.username.toLowerCase();

        this.auth.registration(user).subscribe({
            next: (res: any) => {
                if (res.status == "500") {
                    this.toast.add({ severity: 'error', summary: 'Alert', detail: 'Something went wrong' });
                } else if (res.status == "400") {
                    this.toast.add({ severity: 'error', summary: 'Alert', detail: 'Bad Request' });
                }  else  if (res.status =="409") {
                    this.toast.add({ severity: 'error', summary: 'Alert', detail: res.error.message });
                } 
                
                else {
                    this.toast.add({ severity: 'success', summary: 'Success', detail: 'User created successfully' });
                    this.router.navigate(res.role === 'admin' ? ['/admin/dashboard'] : ['/portal/pre-open-market']);
                }
            },
            error: (err: any) => {
                this.toast.add({ severity: 'error', summary: 'Alert', detail: 'Registration Failed' });
            }
        });
    }

}
