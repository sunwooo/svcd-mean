import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonApiService } from '../../../services/common-api.service';
import { ToastComponent } from '../../../shared/toast/toast.component';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-user-new',
    templateUrl: './user-new.component.html',
    styleUrls: ['./user-new.component.css']
})
export class UserNewComponent implements OnInit {

    @Input() userDetailNew: any; //조회 user
    @Input() user_id: any;
    @Input() cValues;  //모달창 닫기용
    @Input() dValues;  //모달창 무시용
    @Output() openerReload = new EventEmitter<any>(); //삭제 후 다시 조회를 위한 이벤트

    public companyObj: any = [];                //회사리스트 Object
    public selectedComIdx = 0;                  //회사리스트 Object내 회사  index

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
        , private toast: ToastComponent) { }

    ngOnInit() {
        this.getCompanyList();
    }

    /**
       * 회사리스트 조회
       */
    getCompanyList() {
        this.commonApi.getCompany(this.userDetailNew).subscribe(
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
        console.log("=== userDetailNew : ", this.userDetailNew);
        console.log("=== companyObj : ", this.companyObj[idx]);
        this.userDetailNew.company_cd = this.companyObj[idx].company_cd;
        this.userDetailNew.company_nm = this.companyObj[idx].company_nm;
    }

    /**
     * 사원정보 추가
     * @param form 
     */
    insertUser(form: NgForm) {

        //form.value.user.id = this.userDetailNew._id;

        console.log('======= save(form : NgForm) =======');
        console.log("form.value > ", form.value);
        //console.log("form > ", form);
        console.log("userDetailNew > ", this.userDetailNew);
        console.log('===================================');

        /*
        this.userService.insertUser(form.value).subscribe(
            (res) => {
                if (res.success) {
                    this.userDetailNew.company_cd = form.value.company_cd;
                    this.userDetailNew.company_nm = form.value.company_nm;
                    this.userDetailNew.email = form.value.email;
                    this.userDetailNew.sabun = form.value.sabun;
                    this.userDetailNew.password = form.value.password;
                    this.userDetailNew.employee_nm = form.value.employee_nm;
                    this.userDetailNew.dept_nm = form.value.dept_nm;
                    this.userDetailNew.position_nm = form.value.position_nm;
                    this.userDetailNew.jikchk_nm = form.value.jikchk_nm;
                    this.userDetailNew.hp_telno = form.value.hp_telno;
                    this.userDetailNew.office_tel_no = form.value.office_tel_no;
                    this.userDetailNew.group_flag = form.value.group_flag;
                    this.userDetailNew.user_flag = form.value.user_flag;
                    this.userDetailNew.email_send_yn = form.value.email_send_yn;
                    this.userDetailNew.access_yn = form.value.access_yn;
                    this.userDetailNew.using_yn = form.value.using_yn;

                    this.toast.open('추가되었습니다.', 'success');
                    this.openerReload.emit();

                    //모달창 닫기
                    this.cValues('Close click');
                }
            },
            (error: HttpErrorResponse) => {
                this.toast.open('오류입니다. ' + error.message, 'danger');
            }
        );
        */
    }

    /**
     * 모달 닫기
    */
    closeModal($event) {
        this.cValues('Close click');
    }
}
