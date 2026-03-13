import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';

@Component({
    selector: 'app-notfound',
    standalone: true,
    imports: [RouterModule, AppFloatingConfigurator, ButtonModule],
    template: ` <app-floating-configurator />
        <div class="flex items-center justify-center min-h-screen overflow-hidden">
            <div class="flex flex-col items-center justify-center">
               <div  class="flex justify-center">
                                            <img src="assets/images/white_logo.gif" style="height: 100px;width: 184px; text-align: center;">

                    </div>
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, color-mix(in srgb, var(--primary-color), transparent 60%) 10%, var(--surface-ground) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20 flex flex-col items-center" style="border-radius: 53px">
                        <span class="text-primary font-bold text-3xl">404</span>
                        <h1 class="text-surface-900 dark:text-surface-0 font-bold text-3xl lg:text-5xl mb-2">Not Found</h1>
                        <p-button label="Go to Dashboard" (onClick)="gotoDashboard()"/>
                    </div>
                </div>
            </div>
        </div>`
})
export class Notfound implements OnInit { 
    user:any;
    router=inject(Router);

    constructor(){

    }
    ngOnInit(): void {
        this.user=JSON.parse(localStorage.getItem('user')||'');
    }
    gotoDashboard(){
        if(this.user.role=='admin'){
            this.router.navigate(['/admin/dashboard'])

        }else{
            this.router.navigate(['/portal/dashboard'])
        }
    }
}
