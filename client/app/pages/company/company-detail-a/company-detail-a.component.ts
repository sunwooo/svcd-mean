import { Component, OnInit } from '@angular/core';
import { Input, Output } from "@angular/core";
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS, MatDatepickerInputEvent } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { NgForm } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { CompanyService } from '../../../services/company.service';
import { EventEmitter } from "@angular/core";
import { ToastComponent } from '../../../shared/toast/toast.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-company-detail-a',
    templateUrl: './company-detail-a.component.html',
    styleUrls: ['./company-detail-a.component.css'],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'ko-KR' },
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    ],
})
export class CompanyDetailAComponent implements OnInit {

    @Input() companyDetail: any; //조회 company
    @Input() cValues;  //모달창 닫기용
    @Input() dValues;  //모달창 무시용
    @Output() openerReload = new EventEmitter<any>(); //삭제 후 다시 조회를 위한 이벤트

    public today = new Date();
    public minDate = new Date(2015, 0, 1);
    public maxDate = new Date(2030, 0, 1);
    public events: string[] = [];
    public show_addr: string;
    public zip_cd: string;
    public addr: string;


    public groupFlagObj: { name: string; value: string; }[] = [
        { name: '외부고객사', value: 'out' },
        { name: '그룹사', value: 'in' }
    ];

    public contractGubunObj: { name: string; value: string; }[] = [
        { name: '하자보수', value: '하자보수' },
        { name: '패키지유지보수', value: '패키지유지보수' },
        { name: '운영유지보수', value: '운영유지보수' },
        { name: '연말정산', value: '연말정산' }
    ];

    public daumAddressOptions =  {
        class: ['btn', 'btn-success btn-sm']
    };

    constructor(private companyService: CompanyService
                ,public toast: ToastComponent
                ,private router: Router) { }

    ngOnInit() {
        this.zip_cd = this.companyDetail.zip_cd;
        this.addr = this.companyDetail.addr;
        this.show_addr = this.companyDetail.zip_cd + '    ' + this.companyDetail.addr;
    }

    /**
     * 화사정보 수정
     * @param form 
     */
    updateCompany(form: NgForm) {

        form.value.company.id = this.companyDetail._id;
        console.log('=======================================save(form : NgForm)=======================================');
        console.log("form.value",form.value);
        console.log("form",form);
        console.log('=================================================================================================');

   

        this.companyService.putCompany(form).subscribe(
            res => {
                //업데이트가 성공하면 진행 상태값 변경
                if(res.success){
                    //리스트와 공유된 companyDetail 수정
                    this.companyDetail.company_nm   = form.value.company_nm;
                    this.companyDetail.company_cd   = form.value.company_cd;
                    this.companyDetail.addr         = form.value.addr;
                    this.companyDetail.addr2        = form.value.addr2;
                    this.companyDetail.ceo_nm       = form.value.ceo_nm;
                    this.companyDetail.date_from    = form.value.date_from;
                    this.companyDetail.date_to      = form.value.date_to;
                    this.companyDetail.fax_no       = form.value.fax_no;
                    this.companyDetail.tel_no       = form.value.tel_no;
                    this.companyDetail.type         = form.value.type;
                    this.companyDetail.zip_cd       = form.value.zip_cd;
                    this.companyDetail.use_yn       = form.value.use_yn;
                    this.companyDetail.date_from    = form.value.date_from;
                    this.companyDetail.date_to      = form.value.date_to;

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
     * 달력 이벤트 처리
     * @param type
     * @param event 
     */
    addEvent(type: string, event: MatDatepickerInputEvent<Date>) {

        console.log("================================");
        console.log("type: ", type);
        console.log("event: ", event);

        console.log("================================");

        //this.onSubmit();

    }

    /**
     * 우편번호 주소 세팅
     * @param data 
     */
    setDaumAddressApi(data){
        // 여기로 주소값이 반환
        console.log("daum addr : ", data);
        this.zip_cd = data.zip;
        this.addr = data.addr;
        this.show_addr = this.zip_cd + '    ' + this.addr;
        console.log("================>this.show_addr : ", this.show_addr);
    }

    /**
     * 모달 닫기
    */
    closeModal($event) {
        this.cValues('Close click');
    }

    /**
     * 회사정보 삭제
     * @param companyId
     */
    deleteCompany(companyId) {
        //console.log("deleteQna qnaId :", qnaId);

        this.companyService.delete(companyId).subscribe(
            (res) => {
                if (res.success) {
                    this.toast.open('삭제되었습니다.', 'success');
                    this.router.navigate(['/svcd/4300']);
                    this.openerReload.emit();
                }

            },
            (error: HttpErrorResponse) => {
                console.log(error);
            },
            () => {
                this.cValues('Close click');
            }
        );
    }
}
