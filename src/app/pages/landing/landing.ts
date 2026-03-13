import { LayoutService } from '@/layout/service/layout.service';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Header } from '../header/header';
import { PrivacyPolicy } from '../privacy-policy/privacy-policy';
import { TermsAndCondition } from '../terms-and-condition/terms-and-condition';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterModule, CommonModule,PrivacyPolicy,TermsAndCondition],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.scss', '../../../assets/css/bootstrap.min.css'],
  encapsulation: ViewEncapsulation.None  // 👈 set mode here
})
export class Landing implements OnInit, AfterViewInit {
  currentRoute='home';
  constructor(private route: ActivatedRoute) { 
  }

  ngAfterViewInit(): void {
    this.route.fragment.subscribe((fragment) => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }
  screenWidth!: number;
  isMobile = false;

  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.screenWidth = window.innerWidth;
    this.isMobile = this.screenWidth <= 767;
  }

  @ViewChild('servicesSection') servicesSection!: ElementRef;
  @ViewChild('aboutSection') aboutSection!: ElementRef;
  @ViewChild('servicesSection1') servicesSection1!: ElementRef;

  scrollTo(type: string) {
    switch (type) {
      case 'service':
        this.servicesSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;

      case 'about':
        this.aboutSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;

      case 'service1':
        this.servicesSection1.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;
      default:
        break;
    }

  }

  isMenuOpen = false;

toggleMenu() {
  this.isMenuOpen = !this.isMenuOpen;
}

closeMenu() {
  this.isMenuOpen = false;
}
  login() { }
}
