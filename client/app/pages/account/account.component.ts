import { Component, OnInit, ViewChild, QueryList, ElementRef, Output, EventEmitter, Renderer } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { ToastComponent } from '../../shared/toast/toast.component';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

    @Output() modalView = new EventEmitter<boolean>();

    title = 'Account Settings';
    isLoading = true;

    constructor(
        private auth: AuthService,
        public toast: ToastComponent,
        private userService: UserService,
        private renderer: Renderer
    ) { }

    ngOnInit() {
        this.isLoading = false;
    }

    ngAfterViewInit(){
        
        //console.log('=======================================ngAfterViewInit=======================================');
        //console.log('company_nm is focused');
        //console.log('=============================================================================================');

        let onElement = this.renderer.selectRootElement('#company_nm');
        onElement.focus();

    }

    saveUser(form: NgForm) {

        //console.log('=======================================save(form : NgForm)=======================================');
        //console.log(form.value);
        //console.log('=================================================================================================');

        this.userService.addUser(form).subscribe(
            res => {
                
                //console.log('=============saveUser(form : NgForm) this.userService.addUser(form).subscribe( =========');
                //console.log(res);
                //console.log('========================================================================================');

                form.onReset();
                if(res.success){
                    this.toast.open('신청되었습니다.', 'success');
                    this.modalView.emit(false);
                }else{
                    this.toast.open(res.message, 'danger');
                }

                this.modalView.emit(false);
            }
            ,
            (error: HttpErrorResponse) => {
                if (error.status == 400) {
                    this.toast.open('동일한 Email이 존재합니다.', 'danger');
                //}else if (error.status == 400) {
                //    this.toast.open('승인중인 계정입니다.', 'danger');
                } else {
                    this.toast.open('오류입니다. ' + error.message, 'danger');
                }
            }
        );

    }

}
