import { Component } from '@angular/core';
import { Header } from '../header/header';

@Component({
  selector: 'app-privacy-policy',
  imports: [],
  templateUrl: './privacy-policy.html',
  styleUrl: './privacy-policy.scss'
})
export class PrivacyPolicy {

   scrollTo(type: string) {
    switch (type) {
      // case 'service':
      //   this.servicesSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
      //   break;

      // case 'about':
      //   this.aboutSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
      //   break;

      // case 'service1':
      //   this.servicesSection1.nativeElement.scrollIntoView({ behavior: 'smooth' });
      //   break;
      // default:
      //   break;
    }

  }
}
