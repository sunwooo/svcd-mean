import { Component, OnInit, EventEmitter } from '@angular/core';
import { Input, Output } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';
import { UsermanageService } from '../../../services/usermanage.service';
import { NgForm } from '@angular/forms';
import { CommonApiService } from '../../../services/common-api.service';

@Component({
    selector: 'app-usermanage-detail-a',
    templateUrl: './usermanage-detail-a.component.html',
    styleUrls: ['./usermanage-detail-a.component.css']
})
export class UsermanageDetailAComponent implements OnInit {
    @Input() usermanageDetail: any; //조회 usermanage
    @Input() cValues;  //모달창 닫기용
    @Input() dValues;  //모달창 무시용
    @Output() openerReload = new EventEmitter<any>(); //삭제 후 다시 조회를 위한 이벤트

    public show_addr: string;
    public zip_cd: string;
    public addr: string;
    public companyObj: any = [];                //회사리스트
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

    constructor(private usermanageService: UsermanageService,
        private commonApi: CommonApiService) { }

    ngOnInit() {
        this.zip_cd = this.usermanageDetail.zip_cd;
        this.addr = this.usermanageDetail.addr;
        this.show_addr = this.usermanageDetail.zip_cd + '    ' + this.usermanageDetail.addr;

        this.getCompanyList();
    }

    /**
     * 회사리스트 조회
     */
    getCompanyList() {
        this.commonApi.getCompany(this.usermanageDetail).subscribe(
            (res) => {
                //console.log("res", res);
                this.companyObj = res;
            },
            (error: HttpErrorResponse) => {
            }
        );
    }

    /**
     * 회사리스트 선택후 company_cd, compant_nm 세팅
     */
    setCompany() {
        console.log('companyObj.company_cd > ', this.usermanageDetail.company_select);
        this.usermanageDetail.company_cd = this.companyObj.company_cd;
        this.usermanageDetail.compant_nm = this.companyObj.compant_nm;
    }

    /**
     * 사원정보 수정
     * @param form 
     */
    updateUsermanage(form: NgForm) {

        form.value.usermanage.id = this.usermanageDetail._id;
        console.log('=======================================save(form : NgForm)=======================================');
        console.log("form.value", form.value);
        console.log("form", form);
        console.log('=================================================================================================');



        this.usermanageService.putUsermanage(form).subscribe(
            res => {
                //업데이트가 성공하면 진행 상태값 변경
                if (res.success) {
                    //리스트와 공유된 usermanageDetail 수정
                    this.usermanageDetail.company_cd = form.value.company_cd;
                    this.usermanageDetail.company_nm = form.value.company_nm;
                    this.usermanageDetail.sabun = form.value.sabun;
                    this.usermanageDetail.password = form.value.password;
                    this.usermanageDetail.employee_nm = form.value.employee_nm;
                    this.usermanageDetail.dept_nm = form.value.dept_nm;
                    this.usermanageDetail.position_nm = form.value.position_nm;
                    this.usermanageDetail.jikchk_nm = form.value.jikchk_nm;
                    this.usermanageDetail.hp_telno = form.value.hp_telno;
                    this.usermanageDetail.office_tel_no = form.value.office_tel_no;
                    this.usermanageDetail.group_flag = form.value.group_flag;
                    this.usermanageDetail.user_flag = form.value.user_flag;
                    this.usermanageDetail.email_send_yn = form.value.email_send_yn;
                    this.usermanageDetail.access_yn = form.value.access_yn;
                    this.usermanageDetail.using_yn = form.value.using_yn;

                    this.openerReload.emit();

                    //모달창 닫기
                    this.cValues('Close click');
                }
            }
            ,
            (error: HttpErrorResponse) => {

            }
        );

    }

    /**
     * 모달 닫기
    */
    closeModal($event) {
        this.cValues('Close click');
    }

}
