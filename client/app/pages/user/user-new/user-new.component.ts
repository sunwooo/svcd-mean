import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonApiService } from '../../../services/common-api.service';
import { ToastComponent } from '../../../shared/toast/toast.component';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-new',
    templateUrl: './user-new.component.html',
    styleUrls: ['./user-new.component.css']
})
export class UserNewComponent implements OnInit {

    public companyObj: any = [];                //회사리스트 Object
    public selectedComIdx = 0;                  //회사리스트 Object내 회사  index
    public company_cd = "";
    public company_nm = "";
    public company_select = "";
    private formData: any = {};                 //전송용 formData
    

    public userFlagObj: { name: string; value: string; }[] = [
        { name: '그룹관리자', value: '1' },
        { name: '업무관리자(팀장)', value: '3' },
        { name: '업무담당자', value: '4' },
        { name: '고객사관리자', value: '5' },
        { name: '일반사용자', value: '9' }
    ];
    public groupFlagObj: { name: string; value: string; }[] = [
        { name: '외부고객사', value: 'out' },
        { name: '그룹사', value: 'in' }
    ];
    public emailSendYnObj: { name: string; value: string; }[] = [
        { name: '사용', value: 'Y' },
        { name: '미사용', value: 'N' }
    ];
    public accessYnObj: { name: string; value: string; }[] = [
        { name: '승인', value: 'Y' },
        { name: '미승인', value: 'N' }
    ];
    public usingYnObj: { name: string; value: string; }[] = [
        { name: '사용', value: 'Y' },
        { name: '미사용', value: 'N' }
    ];

    constructor(private userService: UserService
        , private commonApi: CommonApiService
        , private router: Router
        , private toast: ToastComponent) { }

    ngOnInit() {
        this.getCompanyList();
    }

    /**
       * 회사리스트 조회
       */
    getCompanyList() {
        this.commonApi.getCompany(this.formData).subscribe(
            (res) => {
                //console.log("res : ", res);
                this.companyObj = res;
            },
            (error: HttpErrorResponse) => {
            }
        );
    }

    /**
     * 회사리스트 선택후 company_cd, compant_nm 세팅
     */
    setCompany(idx) {
        this.company_cd = this.companyObj[idx].company_cd;
        this.company_nm = this.companyObj[idx].company_nm;
    }

    /**
     * 사원정보 추가
     * @param form 
     */
    insertUser(form: NgForm) {
        form.value.email = this.email;
        console.log('======= user-new.ts > insertUser start =======');
        console.log('form : ', form.value);
        
        /*
        this.userService.insertUser(form.value).subscribe(
            (res) => {
                if (res.success) {

                    this.toast.open('추가되었습니다.', 'success');

                    //사용자정보관리 조회화면으로 이동
                    this.goList();
                }
            },
            (error: HttpErrorResponse) => {
                this.toast.open('오류입니다. ' + error.message, 'danger');
            }
        );
        */
    }

    goList(){
        this.router.navigate(['/svcd/4400']);
    }
}
