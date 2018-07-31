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
  
  public group_flag;
  public company_cd;
  public company_nm ;
  public type;
  public ceo_nm;
  public tel_no;
  public fax_no;
  public date_from;                       //유지보수 시작일
  public date_to;                         //유지보수 종료일
  public addr;
  public addr2;
  public bigo;
  public id;
  

  public today = new Date();
  public minDate = new Date(2015, 0, 1);
  public maxDate = new Date(2030, 0, 1);
  public events: string[] = [];

  public groupFlagObj: { name: string; value: string; }[] = [
        { name: '외부고객사', value: 'out' },
        { name: '그룹사', value: 'in' }
    ];  
  

  constructor( private companyService: CompanyService) { }

  ngOnInit() {
    this.group_flag = this.companyDetail.group_flag;
    this.company_cd = this.companyDetail.company_cd;
    this.company_nm = this.companyDetail.company_nm;
    this.type       = this.companyDetail.type;
    this.ceo_nm     = this.companyDetail.ceo_nm;
    this.tel_no     = this.companyDetail.tel_no;
    this.fax_no     = this.companyDetail.fax_no;
    this.addr       = this.companyDetail.addr;
    this.addr2      = this.companyDetail.addr2;
    this.bigo       = this.companyDetail.bigo;
    this.id         = this.companyDetail._id;




    
    console.log("companyDetail", this.companyDetail);
    console.log("companyDetail.id", this.companyDetail._id);
  }

  saveCompany(form: NgForm) {

        console.log('=======================================save(form : NgForm)=======================================');
        console.log(form.value);
        console.log('=================================================================================================');
        
        
        this.companyService.putCompany(form).subscribe(
            res => {
                
                //console.log('=============saveUser(form : NgForm) this.companyService.putCompany(form).subscribe( =========');
                //console.log(res);
                //console.log('========================================================================================');

            }
            ,
            (error: HttpErrorResponse) => {

            }
        );
        
        

    }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {

        console.log("================================");
        console.log("this.date_from : ", this.date_from);
        console.log("this.date_to : ", this.date_to);

        console.log("================================");

        //this.onSubmit();

    }

}
