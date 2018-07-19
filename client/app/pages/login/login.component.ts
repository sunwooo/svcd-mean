import { Component, OnInit, Renderer, ViewChild, ChangeDetectorRef, ElementRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
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
    encapsulation: ViewEncapsulation.None,
    providers: [CookieService]
})
export class LoginComponent implements OnInit {

    email;
    password;
    remember_me;

    closeResult: string;

    constructor(
        private auth: AuthService,
        private router: Router,
        public toast: ToastComponent,
        private cookieService: CookieService,
        private renderer: Renderer,
        private changeDetector: ChangeDetectorRef,
        private modalService: NgbModal
    ) { }

    toggleModal(isVisible: boolean) {
        if (!isVisible) {
            //this.ngxSmartModalService.closeLatestModal();
        }
    }

    ngOnInit() {

        this.getLocalStorage();

        if (this.auth.loggedIn) {
            this.router.navigate(['svcd/index']);
        }
    }

    ngAfterViewInit() {
        console.log("====== login.c ngAfterViewInit() ======");
    }

    setFocus() {
        let onElement = this.renderer.selectRootElement('#company_nm');
        console.log(onElement);
        onElement.focus();
    }

    login(form: NgForm) {

        console.log('===================================================================================');
        console.log('this.auth.loggedIn : ', this.auth.loggedIn);
        console.log('this.email : ', form.value);
        console.log('===================================================================================');

        //form.value 대신 {'email': this.mail, 'password': this.password} 사용가능
        this.auth.login(form.value).subscribe(
            res => {
                this.setLocalStorage();
                this.router.navigate(['svcd/index'])
            },

            error => {
                this.toast.open('등록된 계정이 없거나 비밀번호가 틀립니다.', 'danger');
                console.log("=========>", this.toast);
            }
        );
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

        console.log('================================getCookie()========================================');
        console.log('this.cookieService.check(\'remember_me\') : ', localStorage.getItem('remember_me'));
        console.log('this.cookieService.check(\'email\') : ', localStorage.getItem('email'));
        console.log('===================================================================================');

        if (localStorage.getItem('remember_me')) {
            this.remember_me = true;
            this.email = localStorage.getItem('email');
            //this.email.setValue(this.cookieService.get('email'));

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

    openAddUser(modalId) {
        this.modalService.open(modalId, { size: 'lg', centered: true });
    }

}
