import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonApiService } from '../../../services/common-api.service';
import { ToastComponent } from '../../../shared/toast/toast.component';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-user-my-info',
    templateUrl: './user-my-info.component.html',
    styleUrls: ['./user-my-info.component.css']
})
export class UserMyInfoComponent implements OnInit {

    @Input() myPageDetail: any; //조회 user
    @Input() user_id: any;
    @Input() cValues;  //모달창 닫기용
    @Input() dValues;  //모달창 무시용
    @Output() openerReload = new EventEmitter<any>(); //삭제 후 다시 조회를 위한 이벤트

    public show_addr: string;
    public zip_cd: string;
    public addr: string;
    public companyObj: any = [];                //회사리스트 Object
    public selectedComIdx = 0;                  //회사리스트 Object내 회사  index
    private formData: any = {};                 //전송용 formData
    private userObj: any = [];                  //조회 user

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
        , private toast: ToastComponent
        , private router: Router) { }

    ngOnInit() {
        this.getCompanyList();
        this.getMyPage();
    }

    /**
     * 회사리스트 조회
     */
    getCompanyList() {
        this.commonApi.getCompany(this.myPageDetail).subscribe(
            (res) => {
                //console.log("res : ", res);
                this.companyObj = res;

                //idx를 찾아서 조회시 초기값 세팅
                var tmpIdx = 0;
                /*
                this.companyObj.forEach(element => {
                    if (element.company_cd == this.myPageDetail.company_cd) {
                        this.selectedComIdx = tmpIdx;
                    }
                    tmpIdx++;
                });
                */
            },
            (error: HttpErrorResponse) => {
            }
        );
    }

    /**
     * 회사리스트 선택후 company_cd, compant_nm 세팅
     */
    setCompany(idx) {
        this.myPageDetail.company_cd = this.companyObj[idx].company_cd;
        this.myPageDetail.company_nm = this.companyObj[idx].company_nm;
    }

    /**
    * 마이페이지 조회
    */
    getMyPage() {
        console.log("getMyPage start!!!");

        this.userService.myPageList(this.formData).subscribe(
            (res) => {
                console.log("res >>> ", res);
                

                this.userObj = [];
                var tmp = this.userObj.concat(res.user);
                this.userObj = tmp;

                if (this.userObj.length == 0) {
                    this.toast.open('조회데이타가 없습니다..', 'success');
                }

                //this.userObj = res.user;
            },
            (error: HttpErrorResponse) => {
                console.log("getMyPage error : ", error);
            },
        );
    }


    /**
     * 사원정보 수정
     * @param form 
     */
    myPageUpdate(form: NgForm) {

        form.value.user.id = this.myPageDetail._id;

        //console.log('======= save(form : NgForm) =======');
        //console.log("form.value > ", form.value);
        //console.log("form > ", form);
        //console.log("myPageDetail > ", this.myPageDetail);
        //console.log('===================================');

        this.userService.putMyPage(form.value).subscribe(
            (res) => {
                if (res.success) {
                    this.myPageDetail.company_cd = form.value.company_cd;
                    this.myPageDetail.company_nm = form.value.company_nm;
                    this.myPageDetail.sabun = form.value.sabun;
                    this.myPageDetail.password = form.value.password;
                    this.myPageDetail.employee_nm = form.value.employee_nm;
                    this.myPageDetail.dept_nm = form.value.dept_nm;
                    this.myPageDetail.position_nm = form.value.position_nm;
                    this.myPageDetail.jikchk_nm = form.value.jikchk_nm;
                    this.myPageDetail.hp_telno = form.value.hp_telno;
                    this.myPageDetail.office_tel_no = form.value.office_tel_no;
                    this.myPageDetail.group_flag = form.value.group_flag;
                    this.myPageDetail.user_flag = form.value.user_flag;
                    this.myPageDetail.email_send_yn = form.value.email_send_yn;
                    this.myPageDetail.access_yn = form.value.access_yn;
                    this.myPageDetail.using_yn = form.value.using_yn;

                    this.toast.open('수정되었습니다.', 'success');
                    this.openerReload.emit();

                    this.goList();
                }
            },
            (error: HttpErrorResponse) => {
                this.toast.open('오류입니다. ' + error.message, 'danger');
            }
        );
    }

    goList() {
        this.router.navigate(['/svcd/4400']);
    }

}
