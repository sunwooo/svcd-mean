import { Component, Input } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'app-page-header',
    templateUrl: './page-header.component.html',
    styleUrls: ['./page-header.component.scss']
})

export class PageHeaderComponent {
    @Input() title: string;
    public user_nm: string = this.cookieService.get("employee_nm");
    public company_nm: string = this.cookieService.get("company_nm");

    constructor(private cookieService: CookieService
    ) {
    }

    ngOnInit() { }

}
