import { Component, OnInit } from '@angular/core';
import { Input } from "@angular/core";
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS, MatDatepickerInputEvent } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { NgForm } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { CompanyService } from '../../../services/company.service';

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

    public today = new Date();
    public minDate = new Date(2015, 0, 1);
    public maxDate = new Date(2030, 0, 1);
    public events: string[] = [];

    public groupFlagObj: { name: string; value: string; }[] = [
        { name: '외부고객사', value: 'out' },
        { name: '그룹사', value: 'in' }
    ];


    constructor(private companyService: CompanyService) { }

    ngOnInit() {
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
        console.log("this.date_from : ");
        console.log("this.date_to : ");

        console.log("================================");

        //this.onSubmit();

    }

    /**
     * 모달 닫기
    */
    closeModal($event) {
        this.cValues('Close click');
    }

}
