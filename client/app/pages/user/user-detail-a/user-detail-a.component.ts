import { Component, OnInit, EventEmitter } from '@angular/core';
import { Input, Output } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../services/user.service';
import { NgForm } from '@angular/forms';
import { CommonApiService } from '../../../services/common-api.service';
import { ToastComponent } from '../../../shared/toast/toast.component';

@Component({
    selector: 'app-user-detail-a',
    templateUrl: './user-detail-a.component.html',
    styleUrls: ['./user-detail-a.component.css']
})
export class UserDetailAComponent implements OnInit {
    @Input() userDetail: any; //조회 user
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
        this.commonApi.getCompany(this.userDetail).subscribe(
            (res) => {
                //console.log("res : ", res);
                this.companyObj = res;

                //idx를 찾아서 조회시 초기값 세팅
                var tmpIdx = 0;
                this.companyObj.forEach(element => {
                    if (element.company_cd == this.userDetail.company_cd) {
                        this.selectedComIdx = tmpIdx;
                    }
                    tmpIdx++;
                });
            },
            (error: HttpErrorResponse) => {
            }
        );
    }

    /**
     * 회사리스트 선택후 company_cd, compant_nm 세팅
     */
    setCompany(idx) {
        this.userDetail.company_cd = this.companyObj[idx].company_cd;
        this.userDetail.company_nm = this.companyObj[idx].company_nm;
    }

    /**
     * 사원정보 수정
     * @param form 
     */
    updateUser(form: NgForm) {

        form.value.user.id = this.userDetail._id;

        //console.log('======= save(form : NgForm) =======');
        //console.log("form.value > ", form.value);
        //console.log("form > ", form);
        //console.log("userDetail > ", this.userDetail);
        //console.log('===================================');

        this.userService.putUser(form.value).subscribe(
            (res) => {
                if (res.success) {
                    this.userDetail.company_cd = form.value.company_cd;
                    this.userDetail.company_nm = form.value.company_nm;
                    this.userDetail.sabun = form.value.sabun;
                    this.userDetail.password = form.value.password;
                    this.userDetail.employee_nm = form.value.employee_nm;
                    this.userDetail.dept_nm = form.value.dept_nm;
                    this.userDetail.position_nm = form.value.position_nm;
                    this.userDetail.jikchk_nm = form.value.jikchk_nm;
                    this.userDetail.hp_telno = form.value.hp_telno;
                    this.userDetail.office_tel_no = form.value.office_tel_no;
                    this.userDetail.group_flag = form.value.group_flag;
                    this.userDetail.user_flag = form.value.user_flag;
                    this.userDetail.email_send_yn = form.value.email_send_yn;
                    this.userDetail.access_yn = form.value.access_yn;
                    this.userDetail.using_yn = form.value.using_yn;

                    this.toast.open('수정되었습니다.', 'success');
                    this.openerReload.emit();

                    //모달창 닫기
                    this.cValues('Close click');
                }
            },
            (error: HttpErrorResponse) => {
                this.toast.open('오류입니다. ' + error.message, 'danger');
            }
        );
    }

    /**
     * 사용자관리 삭제
     * @param higherProcessId
     */
    deleteaUser(userId) {
        //console.log("deleteaUser userId :" , userId);

        this.userService.delete(userId).subscribe(
            (res) => {
                if(res.success){
                    this.toast.open('삭제되었습니다.', 'success');
                    this.openerReload.emit();

                    //모달창 닫기
                    this.cValues('Close click');
                }
            },
            (error: HttpErrorResponse) => {
                this.toast.open('오류입니다. ' + error.message, 'danger');
            },
        );
    }

    /**
     * 모달 닫기
    */
    closeModal($event) {
        this.cValues('Close click');
    }

}
