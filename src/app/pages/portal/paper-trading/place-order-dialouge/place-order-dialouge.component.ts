import { PortalService } from '@/services/portal.service';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, SimpleChanges, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Dialog, DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-place-order-dialouge',
  templateUrl: './place-order-dialouge.component.html',
  styleUrls: ['./place-order-dialouge.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, DialogModule, ButtonModule],
  providers: [ConfirmationService]
})
export class PlaceOrderDialougeComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>(); // <-- MUST have this

  @Input() data: any = {};
  @Output() cancel = new EventEmitter<any>();
  @Input() header: string = 'Place Order';

 


  constructor(public pservice: PortalService, private confirmationService: ConfirmationService  ) { }

  openAutocomplete() {

  }

  
 closeDialog() {
    this.visible = false;
    this.visibleChange.emit(this.visible); // <-- emit change so parent knows
  }

  onCancel() {
    this.closeDialog();
  }
}
