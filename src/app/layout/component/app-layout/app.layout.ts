import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AppTopbar } from '../app-topbar/app.topbar';
import { AppFooter } from '../app.footer';
import { LayoutService } from '../../service/layout.service';
import { AuthService } from '../../../services/auth.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, AppTopbar, RouterModule, AppFooter, DialogModule, ButtonModule],
    template: `<div class="layout-wrapper" [ngClass]="containerClass">
        <app-topbar></app-topbar>
        <div class="layout-main-container">
            <div class="layout-main">
                <router-outlet></router-outlet>
            </div>
            <app-footer></app-footer>
        </div>
        <div class="layout-mask animate-fadein"></div>
	        <p-dialog
	            header="Risk Disclosure Statement"
	            [(visible)]="showDisclaimerDialog"
	            [modal]="true"
	            [closable]="false"
	            [closeOnEscape]="false"
	            [dismissableMask]="false"
	            [draggable]="false"
	            [resizable]="false"
	            [style]="{ width: '95rem', maxWidth: '95vw' }">
	            <ng-template pTemplate="header">
	                <div class="w-full text-center font-semibold text-2xl">Risk Disclosure Statement</div>
	            </ng-template>
	            <div class="line-height-3 text-700 mb-2" style="max-height: 73vh; overflow-y: auto;">
                <p class="mb-2">
                    Investing in financial markets carries inherent risks, and it's important to understand these risks before making any investment decisions. The following are some key risks associated with investing:
                </p>
                <p class="mb-2">
                    1. <strong>Market Volatility:</strong> Financial markets can experience significant price fluctuations, which may result in sudden and substantial gains or losses.
                </p>
                <p class="mb-2">
                    2. <strong>Economic Factors:</strong> Economic conditions, both domestically and globally, can impact the performance of investments. Factors such as inflation, interest rates, and GDP growth can influence market trends.
                </p>
                <p class="mb-2">
                    3. <strong>Company-Specific Risks:</strong> Investing in individual stocks exposes investors to specific risks related to the performance and operations of those companies. These risks include industry competition, management effectiveness, and regulatory issues.
                </p>
                <p class="mb-2">
                    4. <strong>Liquidity Risks:</strong> Some investments may have limited liquidity, making it difficult to buy or sell shares at desired prices. Illiquid investments may result in delays or unfavourable pricing when liquidating positions.
                </p>
                <p class="mb-2">
                    5. <strong>Potential Loss of Capital:</strong> All investments carry the risk of loss, and investors may lose some or all of their invested capital. It's important to only invest funds that you can afford to lose.
                </p>
                <p class="mb-2">
                    6. <strong>Market Timing Risks:</strong> Attempting to time the market by buying and selling securities based on short-term price movements can be challenging and may result in losses.
                </p>
                <p class="mb-2">
                    7. <strong>Currency Risks:</strong> Investing in assets denominated in foreign currencies exposes investors to exchange rate fluctuations, which can impact investment returns.
                </p>
                <p class="mb-2">
                    8. <strong>Regulatory Risks:</strong> Changes in regulations or government policies can affect the value of investments and may result in unforeseen losses.
                </p>
                <p class="mb-2">
                    9. <strong>Information Risks:</strong> The accuracy and reliability of information available to investors can vary, and misinformation or incomplete information may lead to poor investment decisions.
                </p>
                <p class="mb-2">
                    10. <strong>Diversification Risks:</strong> Lack of diversification in a portfolio can increase the overall risk exposure. Diversifying investments across different asset classes and industries can help mitigate risks.
                </p>
                <p class="mb-2">
                    It's important to conduct thorough research, assess your risk tolerance, and consider seeking advice from a qualified financial advisor before making any investment decisions. The information provided on tradingbul.com is for educational and informational purposes only. Remember that past performance is not indicative of future results, and there are no guarantees of investment success.
                </p>
                <p class="mb-0">
                    <strong>Disclaimer:</strong> tradingbul.com does not provide personalized investment advice or recommendations. Investors are solely responsible for their investment decisions, and tradingbul.com shall not be liable for any losses incurred as a result of investments made through this platform.
                </p>
            </div>
	            <div class="flex justify-center">
	                <button pButton type="button" label="Accept" (click)="acceptDisclaimer()"></button>
	            </div>
	        </p-dialog>
    </div> `
})
export class AppLayout implements OnInit {
    overlayMenuOpenSubscription: Subscription;

    menuOutsideClickListener: any;


    @ViewChild(AppTopbar) appTopBar!: AppTopbar;
    userdetails: any;
    showDisclaimerDialog = false;

    constructor(
        public auth: AuthService,
        public layoutService: LayoutService,

        public renderer: Renderer2,
        public router: Router
    ) {
        this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
            if (!this.menuOutsideClickListener) {
                this.menuOutsideClickListener = this.renderer.listen('document', 'click', (event) => {
                    if (this.isOutsideClicked(event)) {
                        this.hideMenu();
                    }
                });
            }

            if (this.layoutService.layoutState().staticMenuMobileActive) {
                this.blockBodyScroll();
            }
        });

        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
            this.hideMenu();
        });
    }

    isOutsideClicked(event: MouseEvent) {
        const sidebarEl = document.querySelector('.layout-sidebar');
        const topbarEl = document.querySelector('.layout-menu-button');
        const eventTarget = event.target as Node;

        return !(sidebarEl?.isSameNode(eventTarget) || sidebarEl?.contains(eventTarget) || topbarEl?.isSameNode(eventTarget) || topbarEl?.contains(eventTarget));
    }

    hideMenu() {
        this.layoutService.layoutState.update((prev) => ({ ...prev, overlayMenuActive: false, staticMenuMobileActive: false, menuHoverActive: false }));
        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
            this.menuOutsideClickListener = null;
        }
        this.unblockBodyScroll();
    }

    ngOnInit(): void {
         this.userdetails = JSON.parse(localStorage.getItem('user') || '{}');
        // Only perform role-based redirect on initial/root pages.
        // If user refreshes any other app route (e.g. /portal/... or /admin/...), keep current route.
        const currentUrl = (this.router.url || '').toLowerCase();
        const isRootLike = currentUrl === '/' || currentUrl === '' || currentUrl === '/home' || currentUrl === '/login';
        if (!this.userdetails || !this.userdetails.role) {
            this.auth.logout();
            return;
        }
        if (isRootLike) {
            if (this.userdetails.role === 'admin') {
                this.router.navigate(['/admin/dashboard']);
            } else if (this.userdetails.role === 'user') {
                this.router.navigate(['/portal/pre-open-market']);
            }
        }

        this.showDisclaimerDialog = this.userdetails.role === 'user' && !this.auth.hasAcceptedDisclaimer();

    }

    acceptDisclaimer(): void {
        this.auth.setDisclaimerAccepted(true);
        this.showDisclaimerDialog = false;
    }

    blockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        } else {
            document.body.className += ' blocked-scroll';
        }
    }

    unblockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        } else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    get containerClass() {
        return {
            'layout-overlay': this.layoutService.layoutConfig().menuMode === 'overlay',
            'layout-static': this.layoutService.layoutConfig().menuMode === 'static',
            'layout-static-inactive': this.layoutService.layoutState().staticMenuDesktopInactive && this.layoutService.layoutConfig().menuMode === 'static',
            'layout-overlay-active': this.layoutService.layoutState().overlayMenuActive,
            'layout-mobile-active': this.layoutService.layoutState().staticMenuMobileActive
        };
    }

    ngOnDestroy() {
        if (this.overlayMenuOpenSubscription) {
            this.overlayMenuOpenSubscription.unsubscribe();
        }

        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
        }
    }
}
