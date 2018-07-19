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

    constructor(private cookieService: CookieService,
                private router: Router, 
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        //console.log("XXXXXXXXXXXXXXXXXXXX", this.router);
        //this.router.navigate(['svcd/content']);
        //this.router.navigate(['svcd']);
        //console.log("yyyyyyyyyyyyyyyyyy");
    }

    isView(user_flag : string) : boolean{
        if(user_flag == this.cookieService.get("user_flag") ){
            return true;
        }else{
            return false;
        }
    }
    
}