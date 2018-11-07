import { Component, OnInit, EventEmitter, Renderer } from '@angular/core';
import { Input, Output } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { NgForm } from '@angular/forms';
import { CommonApiService } from '../../../services/common-api.service';
import { ToastComponent } from '../../../shared/toast/toast.component';
import { Router } from '@angular/router';

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
    public user_flag ="9";                      //사용자 구분
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


    constructor(private auth: AuthService
        , private userService: UserService
        , private commonApi: CommonApiService
        , private toast: ToastComponent
        , private renderer: Renderer
        , private router: Router) { }

    ngOnInit() {
        
        this.user_flag = this.auth.user_flag;
        
        this.getCompanyList();
    }

    /**
     * 회사리스트 조회
     */
    getCompanyList() {

        this.commonApi.getCompany(this.userDetail).subscribe(
            (res) => {
                this.companyObj.push({'company_cd':'','company_nm':'선택하세요'});

                //idx를 찾아서 조회시 초기값 세팅
                var tmpIdx = 1;
                res.forEach(element => {
                    this.companyObj.push({'company_cd':element.company_cd,'company_nm':element.company_nm});

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
     * 비밀번호 초기화
     */
    initPassword(form: NgForm){
        //console.log("================ initPassword() ==============-");
        form.value.user.id = this.userDetail._id;
        this.userService.putInitPassword(form.value).subscribe(
            (res) => {
                if (res.success) {

                    this.toast.open('비밀번호가 초기화 되었습니다.', 'success');
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
     * 계정승인
     */
    accessConfirm(form: NgForm){
        //console.log("================ accessConfirm() ==============-");
        
        if(!this.userDetail.company_cd){
            this.toast.open('매핑할 회사명을 선택하세요. ', 'danger');
            
            //매핑할 회사 포커스
            //let onElement = this.renderer.selectRootElement('#company_select');
            //onElement.focus();
            
            return;
        }

        form.value.user.id = this.userDetail._id;
        //console.log("================ form.value.user ==============", form.value.user);
        this.userService.putAccessConfirm(form.value).subscribe(
            (res) => {
                if (res.success) {

                    this.toast.open('계정이 승인되었습니다.', 'success');
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
     * 사원정보 수정
     * @param form 
     */
    updateUser(form: NgForm) {
        if(this.userDetail.company_cd == 'ISU_ST'){
            if(!form.value.user.sabun){
                this.toast.open('이수시스템 직원은 사원번호을 반드시 입력하세요. ', 'danger');          
                return;
            }
        }

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

        if (confirm("사원 정보를 삭제 하시겠습니까?")) {
            this.userService.delete(userId).subscribe(
                (res) => {
                    if (res.success) {
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

    }

    /**
     * 모달 닫기
    */
    closeModal($event) {
        this.cValues('Close click');
    }

}
