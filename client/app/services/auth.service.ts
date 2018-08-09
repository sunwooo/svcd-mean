import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserService } from './user.service';

import 'rxjs/add/operator/map';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthService {

    public loggedIn = false;
    public user_flag = '9';
    public email = '';

    private jwtHelper: JwtHelperService = new JwtHelperService();

    constructor(private userService: UserService,
        public cookieService: CookieService,
        public activatedRoute: ActivatedRoute,
        private router: Router) {

        
        this.activatedRoute.params.subscribe(params =>{
            console.log("==========> params : ", params);
        });

        this.activatedRoute.queryParamMap.subscribe(queryParamMap => {
            console.log("==========> queryParamMap : ", queryParamMap);
        });

        const token = this.cookieService.get('email');
        
        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        console.log('xxxxxxxxxxxxxxxxxxxxxxx',this.cookieService.getAll());
        console.log('xxxxxxxxxxxxxxxxxxxxxxx',this.cookieService.get('email'));
        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

        console.log("======== AuthService constructor ========");
        console.log("token... cookie.email : ", token);
        console.log("=========================================");

        if (token) {

            console.log("================================================");
            console.log("================= token true ================");
            console.log("================================================");

            this.loggedIn = true;

        }else{
            console.log("=================================================");
            console.log("================= token false ================");
            console.log("=================================================");         
        }


    }

    login(emailAndPassword) {

        //console.log("========auth.login()========");
        //console.log("this.loginForm.value : ", emailAndPassword);
        //console.log("============================");

        return this.userService.login(emailAndPassword).map(

            res => {
                localStorage.setItem('token', res.token);
                const decodedUser = this.decodeUserFromToken(res.token);
                console.log('res.token...',res.token);
                console.log('decode...',decodedUser);
                this.setCurrentUser(decodedUser);
                return this.loggedIn;
            }

        );
    }

    logout() {

        //console.log("========auth.logout()========");
        //console.log("logout : ");
        //console.log("============================");

        this.cookieService.deleteAll();
        this.loggedIn = false;
        this.router.navigate(['']);
    }

    decodeUserFromToken(token) {
        return this.jwtHelper.decodeToken(token).user;
    }

    setCurrentUser(decodedUser) {
        
        var expiredDate = new Date();
        expiredDate.setDate( expiredDate.getDate() + 1 );

        this.loggedIn = true;
        this.user_flag = decodedUser.user_flag;
        this.email = decodedUser.email;
        this.cookieService.deleteAll();

        this.cookieService.set('email', decodedUser.email, expiredDate);
        this.cookieService.set('employee_nm', decodedUser.employee_nm, expiredDate);
        this.cookieService.set('user_flag', decodedUser.user_flag, expiredDate);
        this.cookieService.set('group_flag', decodedUser.group_flag, expiredDate);
        this.cookieService.set('company_cd', decodedUser.company_cd, expiredDate);
        this.cookieService.set('company_nm', decodedUser.company_nm, expiredDate);
        this.cookieService.set('dept_cd', decodedUser.dept_cd, expiredDate);
        this.cookieService.set('dept_nm', decodedUser.dept_nm, expiredDate);
        this.cookieService.set('position_nm', decodedUser.position_nm, expiredDate);
        this.cookieService.set('jikchk_nm', decodedUser.jikchk_nm, expiredDate);
        this.cookieService.set('office_tel_no', decodedUser.office_tel_no, expiredDate);
        this.cookieService.set('hp_telno', decodedUser.hp_telno, expiredDate);

        /*
        this.cookieService.set('_id', decodedUser._id, {expire:expiredDate});
        this.cookieService.set('email', decodedUser.email, expiredDate);
        this.cookieService.set('employee_nm', decodedUser.employee_nm, expiredDate);
        this.cookieService.set('user_flag', decodedUser.user_flag, expiredDate);
        this.cookieService.set('group_flag', decodedUser.group_flag, expiredDate);
        this.cookieService.set('company_cd', decodedUser.company_cd, expiredDate);
        this.cookieService.set('company_nm', decodedUser.company_nm, expiredDate);
        this.cookieService.set('dept_cd', decodedUser.dept_cd, expiredDate);
        this.cookieService.set('dept_nm', decodedUser.dept_nm, expiredDate);
        this.cookieService.set('position_nm', decodedUser.position_nm, expiredDate);
        this.cookieService.set('jikchk_nm', decodedUser.jikchk_nm, expiredDate);
        this.cookieService.set('office_tel_no', decodedUser.office_tel_no, expiredDate);
        this.cookieService.set('hp_telno', decodedUser.hp_telno, expiredDate);
        */
    }

}
