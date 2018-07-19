import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserService } from './user.service';

import 'rxjs/add/operator/map';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthService {

    public loggedIn = false;

    private jwtHelper: JwtHelperService = new JwtHelperService();

    constructor(private userService: UserService,
        public cookieService: CookieService,
        private router: Router) {

        const token = this.cookieService.get('_id');
        
        console.log('xxxx',this.cookieService.getAll());
        console.log('xxxx',this.cookieService.get('email'));

        console.log("======== AuthService constructor ========");
        console.log("token : ", token);
        console.log("=========================================");

        if (token) {

            console.log("================================================");
            console.log("================= cookie(login) ================");
            console.log("================================================");

            this.loggedIn = true;

        }else{
            
            console.log("=================================================");
            console.log("================= cookie(logout) ================");
            console.log("=================================================");

            this.router.navigate(['login']);
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
        this.router.navigate(['login']);
    }

    decodeUserFromToken(token) {
        return this.jwtHelper.decodeToken(token).user;
    }

    setCurrentUser(decodedUser) {
        
        var expiredDate = new Date();
        expiredDate.setDate( expiredDate.getDate() + 0.5 );

        this.loggedIn = true;
        //this.cookieService.deleteAll();

        console.log("this.cookieService : ", this.cookieService);
        console.log("decodedUser._id : ", decodedUser._id);

        this.cookieService.set('_id', decodedUser._id );
        this.cookieService.set('email', decodedUser.email);
        this.cookieService.set('employee_nm', decodedUser.employee_nm);
        this.cookieService.set('user_flag', decodedUser.user_flag);
        this.cookieService.set('group_flag', decodedUser.group_flag);
        this.cookieService.set('company_cd', decodedUser.company_cd);
        this.cookieService.set('company_nm', decodedUser.company_nm);
        this.cookieService.set('dept_cd', decodedUser.dept_cd);
        this.cookieService.set('dept_nm', decodedUser.dept_nm);
        this.cookieService.set('position_nm', decodedUser.position_nm);
        this.cookieService.set('jikchk_nm', decodedUser.jikchk_nm);
        this.cookieService.set('office_tel_no', decodedUser.office_tel_no);
        this.cookieService.set('hp_telno', decodedUser.hp_telno);

        console.log("this.cookieService.get('_id') : ",this.cookieService.get('_id'));

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
