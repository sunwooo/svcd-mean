import { Component, OnInit } from '@angular/core';
import { StatisticService } from '../../../services/statistic.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDatepickerInputEvent, MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';

import { AuthService } from '../../../services/auth.service';
import { ToastComponent } from '../../../shared/toast/toast.component';
import { CommonApiService } from '../../../services/common-api.service';

@Component({
  selector: 'app-higher-lower',
  templateUrl: './higher-lower.component.html',
  styleUrls: ['./higher-lower.component.css']
})
export class HigherLowerComponent implements OnInit {

    public isLoading = true;
    public sData = null;

    public today = new Date();
    private formData: any = {};                 //전송용 formData
    public user_flag: string = "user";           //사용자 구분
    public company_cd: string = "*";             //회사코드
    public yyyy: string ="";           //검색년도
    public mm: string = "*";            //검색월


    public companyObj: any = [];                //회사리스트
    public yyyyObj: any = [];           //문의년도 리스트
    public mmObj: { name: string; value: string; }[] = [ //문의월 리스트
        { name: '전체', value: '*' },
        { name: '1', value: '01' },{ name: '2', value: '02' },{ name: '3', value: '03' },{ name: '4', value: '04' },
        { name: '5', value: '05' },{ name: '6', value: '06' },{ name: '7', value: '07' },{ name: '8', value: '08' },
        { name: '9', value: '09' },{ name: '10', value: '10' },{ name: '11', value: '11' },{ name: '12', value: '12' }
    ];

    public mmInit = 0;
    public mmDesc = "전체";

    constructor(private auth: AuthService,
        private toast: ToastComponent,
        private statisticService: StatisticService,
        private commonApi: CommonApiService,
    ) { }

    ngOnInit() {
        this.isLoading = false;
        this.yyyy = this.today.getFullYear().toString();

        if(this.auth.user_flag == "1"){ //SD 전체관리자
            this.user_flag = "*";
        }else if(this.auth.user_flag == "5"){//고객사 담당자
            this.user_flag = "company";
        }

        this.getRegisterYyyy();
        this.getCompanyList();
        this.getData();
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
     * 회사별 상위업무 집계 조회
     */
    getData() {

        this.setTransForm();

        this.statisticService.getHigherLower(this.formData).subscribe(
            (res) => {
                this.sData = res;
                
                console.log("====================================================");
                console.log("sData : ", this.sData);
                console.log("sData.length : ", this.sData.length);
                console.log("====================================================");
                
            },
            (error: HttpErrorResponse) => {
            }
        );
    }


    /**
     * 전송용 폼 세팅
     */
    setTransForm(){
        this.formData.company_cd = this.company_cd;
        this.formData.yyyy = this.yyyy;
        this.formData.mm = this.mm;
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

}
