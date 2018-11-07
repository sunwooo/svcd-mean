import { Component, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-page-header',
    templateUrl: './page-header.component.html',
    styleUrls: ['./page-header.component.scss']
})

export class PageHeaderComponent {
    @Input() title: string;
    public user_nm: string = this.auth.employee_nm;
    public company_nm: string = this.auth.company_nm;

    constructor(private auth: AuthService
    ) {
    }

    ngOnInit() { }

}
