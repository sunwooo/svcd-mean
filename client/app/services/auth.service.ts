import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserService } from './user.service';

import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

    public loggedIn = false;
    public email = '';
    public employee_nm = '';
    public user_flag = '9';
    public group_flag = '';
    public company_cd = '';
    public company_nm = '';
    public dept_cd = '';
    public dept_nm = '';
    public position_nm = '';
    public jikchk_nm = '';
    public office_tel_no = '';
    public hp_telno = '';

    private jwtHelper: JwtHelperService = new JwtHelperService();
    private tokenName = 'isu-service-desk';


    constructor(private userService: UserService,
        public activatedRoute: ActivatedRoute,
        private router: Router) {

        const token = localStorage.getItem(this.tokenName);
        
        //console.log("=======================================");
        //console.log('token...',token);
        //console.log("=======================================");

        if (token) {
            const decodedUser = this.decodeUserFromToken(token);
            this.setCurrentUser(decodedUser);
        }
    }

    login(emailAndPassword) {
        return this.userService.login(emailAndPassword).map(

            res => {
                localStorage.setItem(this.tokenName, res.token);
                const decodedUser = this.decodeUserFromToken(res.token);
                
                //console.log("=======================================");
                //console.log('res.token : ',res.token);
                //console.log('decode : ',decodedUser);
                //console.log('this.user_flag : ',this.user_flag);
                //console.log("=======================================");
                
                this.setCurrentUser(decodedUser);

                if(this.user_flag == '9'){
                    this.router.navigate(['/svcd/0001U']); //일반사용자
                }else if(this.user_flag == '5'){
                    this.router.navigate(['/svcd/0001C']); //회사별담당자
                }else{
                    this.router.navigate(['/svcd/0001']);  
                }

                return this.loggedIn;
            }

        );
    }

    logout() {
        localStorage.removeItem(this.tokenName);
        this.loggedIn = false;
        this.router.navigate(['']);
    }

    // 토큰 유효성 검증
    isAuthenticated(): boolean {

        const token = this.getToken();

        //console.log("=======================================");
        //console.log('isAuthenticated token : ',token);
        //console.log("=======================================");

        return token ? this.isTokenExpired(token) : false;
    }

    getToken(): string {
        return localStorage.getItem(this.tokenName);
    }

    /*
    token 유효 기간 체크
    The JwtHelper class has several useful methods that can be utilized in your components:

    decodeToken
    getTokenExpirationDate
    isTokenExpired

    npm install angular2-jwt
    https://github.com/auth0/angular2-jwt
    */
    isTokenExpired(token: string) {

        //console.log("=======================================");
        //console.log('isTokenExpired this.jwtHelper.isTokenExpired(token) : ',this.jwtHelper.isTokenExpired(token));
        //console.log("=======================================");

        return this.jwtHelper.isTokenExpired(token);
    }

    decodeUserFromToken(token) {
        return this.jwtHelper.decodeToken(token).user;
    }

    setCurrentUser(decodedUser) {
        this.loggedIn       = true;
        this.employee_nm    = decodedUser.employee_nm;
        this.email          = decodedUser.email;
        this.user_flag      = decodedUser.user_flag;
        this.group_flag     = decodedUser.group_flag;
        this.company_cd     = decodedUser.company_cd;
        this.company_nm     = decodedUser.company_nm;
        this.dept_cd        = decodedUser.dept_cd;
        this.dept_nm        = decodedUser.dept_nm;
        this.position_nm    = decodedUser.position_nm;
        this.jikchk_nm      = decodedUser.jikchk_nm;
        this.office_tel_no  = decodedUser.office_tel_no;
        this.hp_telno       = decodedUser.hp_telno;
    }
}





