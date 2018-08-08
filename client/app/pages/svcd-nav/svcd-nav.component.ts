import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutingModule } from '../../routing.module';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'app-svcd-nav',
    templateUrl: './svcd-nav.component.html',
    styleUrls: ['./svcd-nav.component.scss']
})
export class SvcdNavComponent implements OnInit {

    public user_flag = '9';

    constructor(private cookieService: CookieService,
                private router: Router, 
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        if(this.cookieService.get("user_flag"))
            this.user_flag = this.cookieService.get("user_flag");
    }

    isView(user_flag : string) : boolean{
        if(user_flag == this.cookieService.get("user_flag") ){
            return true;
        }else{
            return false;
        }
    }
    
}