import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutingModule } from '../../routing.module';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-svcd-nav',
    templateUrl: './svcd-nav.component.html',
    styleUrls: ['./svcd-nav.component.scss']
})
export class SvcdNavComponent implements OnInit {

    public user_flag = '9';
    public group_flag = 'out';

    constructor(private auth: AuthService,
                private router: Router,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
            this.user_flag = this.auth.user_flag;
            this.group_flag = this.auth.group_flag;
    }

    isView(user_flag : string) : boolean{
        if(user_flag == this.auth.user_flag){
            return true;
        }else{
            return false;
        }
    }
    
}