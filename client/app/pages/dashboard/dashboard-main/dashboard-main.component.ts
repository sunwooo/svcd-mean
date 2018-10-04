import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS, MatDatepickerInputEvent } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { AuthService } from '../../../services/auth.service';
import { ToastComponent } from '../../../shared/toast/toast.component';
import { IncidentService } from '../../../services/incident.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { EmpInfoComponent } from '../../../shared/emp-info/emp-info.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonApiService } from '../../../services/common-api.service';
import { LowerCdComponent } from '../../../shared/lower-cd/lower-cd.component';
import { ExcelService } from '../../../services/excel.service';
//import { Dashboard1Component } from '../dashboard1/dashboard1.component';
import { Dashboard2Component } from '../dashboard2/dashboard2.component';
//import { Dashboard3Component } from '../dashboard3/dashboard3.component';

@Component({
    selector: 'app-dashboard-main',
    templateUrl: './dashboard-main.component.html',
    styleUrls: ['./dashboard-main.component.css']
})
export class DashboardMainComponent implements OnInit {

    //@ViewChild(Dashboard1Component) dashboard1: Dashboard1Component;
    @ViewChild(Dashboard2Component) dashboard2: Dashboard2Component;
    //@ViewChild(Dashboard3Component) dashboard3: Dashboard3Component;

    private formData: any = {};                 //전송용 formData
    public today = new Date();
    public yyyy: string ="";           //검색년도
    public mm: string = "*";            //검색월
    public higher_cd: string = "*";     //상위코드
    public company_cd: string = "*";    //회사코드
    public yyyyObj: any = [];           //문의년도 리스트
    public mmObj: { name: string; value: string; }[] = [ //문의월 리스트
        { name: '전체', value: '*' },
        { name: '1', value: '01' },{ name: '2', value: '02' },{ name: '3', value: '03' },{ name: '4', value: '04' },
        { name: '5', value: '05' },{ name: '6', value: '06' },{ name: '7', value: '07' },{ name: '8', value: '08' },
        { name: '9', value: '09' },{ name: '10', value: '10' },{ name: '11', value: '11' },{ name: '12', value: '12' }
    ];
    public companyObj: any = [];                //회사리스트

    public mmInit = 0;
    public mmDesc = "전체";
    public higher_nm = "전체";
    public company_nm = "전체";

    //public user_flag: string = "user";           //사용자 구분(상위업무 항목용)
    public user_flag: string = "*";           //사용자 구분(상위업무 항목용)

    constructor(private auth: AuthService,
        private toast: ToastComponent,
        private incidentService: IncidentService,
        private commonApi: CommonApiService,
        private empInfo: EmpInfoComponent,
        private modalService: NgbModal,
        private excelService:ExcelService,
        private router: Router) { }

    ngOnInit() {
        this.yyyy = this.today.getFullYear().toString();
        this.getRegisterYyyy();
        this.getCompanyList();
    }

    /**
     * 등록요청 년도 조회
     */
    getRegisterYyyy() {
        this.commonApi.getRegisterYyyy().subscribe(
            (res) => {
                this.yyyyObj = res;
            },
            (error: HttpErrorResponse) => {
            }
        );
    }

    /**
     * 데이타 조회
     */
    getData(){
        //this.dashboard1.reload(this.yyyy, this.mm, this.higher_cd, this.company_cd );
        this.dashboard2.reload(this.yyyy, this.mm, this.higher_cd, this.company_cd );
        //this.dashboard3.reload(this.yyyy, this.mm, this.higher_cd, this.company_cd );
    }

 

    /**
     * 회사리스트 조회
     */
    getCompanyList() {
        this.commonApi.getCompany(this.formData).subscribe(
            (res) => {
                this.companyObj = res;
            },
            (error: HttpErrorResponse) => {
            }
        );
    }

    /**
     * 년도 선택 시 처리
     */
    setYyyy(yyyy){
        this.yyyy = yyyy;
        this.getData();
    }

    /**
     * 월 선택 시 처리
     */
    setMm(index){
        this.mm = this.mmObj[index].value;
        this.mmDesc = this.mmObj[index].name;
        this.getData();
    }

    /**
     * 상위업무 선택 시 처리 
     */
    setHigher(higher) {
        this.higher_cd = higher.higher_cd;
        this.higher_nm = higher.higher_nm;
        this.getData();
    }

    /**
     * 회사 선택 시 처리
     */
    setCompany(index){
        if(index == 0){
            this.company_cd = '*';
            this.company_nm = '전체';
        }else{
            this.company_cd = this.companyObj[index].company_cd;
            this.company_nm = this.companyObj[index].company_nm;
        }
        this.getData();
    }

}
