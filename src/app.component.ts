import { LayoutService } from '@/layout/service/layout.service';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule],
    template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {
    layoutService = inject(LayoutService);

    ngOnInit(): void {
        this.layoutService.layoutConfig.update((state) => (
            { ...state, primary: 'sky' }
        ));

    }

}
