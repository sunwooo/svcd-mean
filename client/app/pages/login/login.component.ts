import { Component, OnInit, Renderer, ViewChild, ChangeDetectorRef, ElementRef, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../../services/auth.service';
import { ToastComponent } from '../../shared/toast/toast.component';
import { AccountComponent } from '../account/account.component';
import { NgForm } from '@angular/forms';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

    public email;
    public password;
    public remember_me;
    //public type = 'sso';
    public user_flag = '9';
    public group_flag = 'out';
    private formValue: any = {}; //전송용 데이타

    constructor(
        private auth: AuthService,
        private router: Router,
        public activatedRoute: ActivatedRoute,
        public toast: ToastComponent,
        private renderer: Renderer,
        private changeDetector: ChangeDetectorRef,
        private modalService: NgbModal
    ) { }

    ngOnInit() {

        this.getLocalStorage();

        this.user_flag = this.auth.user_flag;
        this.group_flag = this.auth.group_flag;

        if (this.auth.loggedIn) {
            
            if(this.user_flag == '9'){
                this.router.navigate(['/svcd/0001U']); //일반사용자
            }else if(this.user_flag == '5'){
                this.router.navigate(['/svcd/0001C']); //회사별담당자
            }else{
                this.router.navigate(['/svcd/0001']);  
            }
        
        }
        /*
        else{

            this.activatedRoute.queryParams.subscribe(queryParams => {

                this.formValue.email = queryParams.email;
                this.formValue.password = queryParams.password;
                this.formValue.key = queryParams.key;
                this.formValue.type = queryParams.type;

                if(this.formValue.email && (this.formValue.password || this.formValue.key)){
                    this.login(); 
                }
            });   
        }
        */
    }

    /**
     * login 실행
     */
    login() {

        //console.log('===================================================================================');
        //console.log('this.auth.loggedIn : ', this.auth.loggedIn);
        //console.log('this.email : ', this.formValue);
        //console.log('===================================================================================');

        //form.value 대신 {'email': this.mail, 'password': this.password} 사용가능
        this.auth.login(this.formValue).subscribe(
            res => {
                this.setLocalStorage();
            },
            error => {
                this.toast.open('등록된 계정이 없거나 비밀번호가 틀립니다.', 'danger');
                //console.log("=========>", this.toast);
            }
        );
    }

    /**
     * 로그인 체크
     * @param form 
     */
    loginCheck(form: NgForm){
        this.formValue = form.value;
        this.login();
    }

    /**
     * set localStorage
     */
    setLocalStorage() {
        if (this.remember_me) {
            localStorage.setItem('email', this.email);
            localStorage.setItem('remember_me', 'checked');
        } else {
            localStorage.removeItem('email');
            localStorage.removeItem('remember_me');
        }
    }

    /**
     * get localStorage
     */
    getLocalStorage() {

        if (localStorage.getItem('remember_me')) {
            this.remember_me = true;
            this.email = localStorage.getItem('email');

            let onElement = this.renderer.selectRootElement('#password');
            onElement.focus();

        } else {
            this.remember_me = false;
            this.email = '';
            //this.email.setValue('');

            let onElement = this.renderer.selectRootElement('#email');
            onElement.focus();

        }
    }

    /**
     * 계정신청 모달 호출
     * @param modalId 
     */
    openAddUser(modalId) {
        this.modalService.open(modalId, { size: 'lg', centered: true , backdrop: 'static', keyboard: false });
    }


}
