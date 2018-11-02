import { Component, OnInit, Input } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS, MatDatepickerInputEvent } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { AuthService } from '../../services/auth.service';
import { ToastComponent } from '../../shared/toast/toast.component';
import { IncidentService } from '../../services/incident.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { EmpInfoComponent } from '../../shared/emp-info/emp-info.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { Dashboard0Service } from '../../services/dashboard0.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-main-user-content',
  templateUrl: './main-user-content.component.html',
  styleUrls: ['./main-user-content.component.css']
})
export class MainUserContentComponent implements OnInit {

    public isLoading = true;
    public title = "";
    public subTitle1 = "";
    public subTitle2 = "";
    public searchManagerEmail = "*";            //접수자 이메일
    
    public email = "";                          //이메일
    public company_cd = "";                     //회사코드
    public searchYyyy = "";        //조회연도
    public searchMm = "*";          //조회월
    public searhHigherCd = "*";     //조회업무
    public searhHigherNm = "*";     //조회업무명
    public today = new Date();

    public incidentDetail: any;                 //선택 인시던트 id
    public selectedIdx: number = -1;            //삭제를 위한 인덱스, 상세보기 시 값변경
    private formData: any = {};                 //전송용 formData
    public incidents: any = [];                 //조회 incident
    public user_flag: string = "user";           //사용자 구분
    public empEmail: string = "";               //팝업 조회용 이메일
    public userInfo = null;
    public maxSize: number = 10;      // 한 화면에 나타낼 페이지 수
    public page: number = 1;          // 현재 페이지
    public totalDataCnt: number = 0;  // 총 데이타 수
    public totlaPageCnt: number = 0;  // 총페이지 수 
    public pageDataSize: number = 10;   // 페이지당 출력 개수  

    public higherCntChart = [];   //(요청/접수)업무 건수
    public valuationChart = [];   //만족도 건수
    public avg = 0;                   //만족도 평균

    public colorScheme3 = {
        domain: ['#008fd4', '#b4985a', '#99ca3c', '#a7a9ac', '#f04124']
    };

    constructor(private auth: AuthService,
        private toast: ToastComponent,
        private incidentService: IncidentService,
        private empInfo: EmpInfoComponent,
        private modalService: NgbModal,
        private userService: UserService,
        private dashboard0Service: Dashboard0Service,
        private cookieService: CookieService,
        private router: Router) { }

    ngOnInit() {

        this.searchYyyy = this.today.getFullYear().toString();

        this.title = this.searchYyyy + "년 ";
        if(this.searchMm != '*') this.title = this.title + this.searchMm+"월 ";
        if(this.searhHigherCd != '*') this.title = this.title + this.searhHigherNm + " ";

        this.title = this.title + "요청자"; 
        this.subTitle1 = "요청건수";
        this.subTitle2 = "만족도 평가";
        this.email = this.cookieService.get('email');
        this.company_cd = this.cookieService.get('company_cd');
       
        //console.log("=======================================");
        //console.log("searchYyyy : ", this.searchYyyy);
        //console.log("searchMm : ", this.searchMm);
        //console.log("searhHigherCd : ", this.searhHigherCd);
        //console.log("searhHigherNm : ", this.searhHigherNm);
        //console.log("email : ", this.email);
        //console.log("company_cd : ", this.company_cd);
        //console.log("=======================================");

        this.getSvcEmpInfo(this.email);
        this.getChart();
    }

    /**
     * 차트 데이타 호출
     */
    getChart(){

        this.formData.yyyy = this.searchYyyy;
        this.formData.mm = this.searchMm;
        this.formData.higher_cd = this.searhHigherCd;
        this.formData.company_cd = this.company_cd;

        this.formData.request_id = this.email;

        this.higherCnt();
        this.valuationCnt();
        this.valuationAvg();

    }

    /**
     * 요청자 신청건수/담당자 접수 건수
     */
    higherCnt(){

        this.dashboard0Service.getIncidentCntChart(this.formData).subscribe(
            (res) => {
                this.higherCntChart = res;
            },
            (error : HttpErrorResponse) => {

            }
        );
    }

    /**
     * 요청자 평가 점수 건수/담당자 평가 결과 건수
     */
    valuationCnt(){
        this.dashboard0Service.getValuationChart(this.formData).subscribe(
            (res) => {

                //console.log("=======================================");
                //console.log("================valuationCnt res : ",res);
                //console.log("=======================================");

                this.valuationChart = res;
            },
            (error : HttpErrorResponse) => {

            }
        );
    }    


    /**
     * 요청자/담당자 만족도 평균
     */
    valuationAvg(){
        this.dashboard0Service.getAvgChart(this.formData).subscribe(
            (res) => {

                //console.log("=======================================");
                //console.log("================valuationAvg res : ",res);
                //console.log("=======================================");
                if(res.length > 0)  this.avg = Number((res[0].avg).toFixed(2));
                //this.valuationChart = res;
            },
            (error : HttpErrorResponse) => {

            }
        );
    }

    /**
     * 상세보기창 호출
     * @param modalId 모달창 id
     * @param incident 조회할 incident 객체
     * @param idx  삭제를 위한 인덱스
     */
    setDetail(modalId, incident, idx) {
        if(idx){
            this.incidentDetail = incident;
            this.selectedIdx = idx;
            this.modalService.open(modalId, { windowClass: 'xxlModal', centered: true });
        }
    }


    /**
     * 직원 정보 모달창 호출
     * @param modalId 모달창 id
     * @param email 
     */
    getEmpInfo(modalId, email) {
        this.empEmail = email;
        this.modalService.open(modalId, { windowClass: 'mdModal', centered: true });
    }    


    /**
     * 그룹웨어 email 정보 조회
     * @param email 
     */
    getGroupEmpInfo(email: string) {
        this.userService.getGroupEmpInfo(email).subscribe(
            (res) => {
                if(res.exist){
                    this.userInfo = res;
                }
            },
            (error: HttpErrorResponse) => {
                console.log('error : ', error);
            },
            ()=>{
                this.isLoading = false;
            }
        );
    }


    /**
     * 서비스데스크 email 정보 조회
     * @param email 
     */
    getSvcEmpInfo(email: string) {
        this.userService.getEmpInfo(email).subscribe(
            (res) => {
                if(res.length > 0){
                    this.userInfo = res[0];
                    this.isLoading = false;
                }
            },
            (error: HttpErrorResponse) => {
            },
            () => { //complete 시 처리
                if (this.userInfo == null || this.userInfo.group_flag == "in") { //그룹웨서 사용자로 미존재 시 서비스데스크 사용자 조회
                    this.getGroupEmpInfo(email);
                }
            }
        );
    }


    /**
     * 차트 선택 시
     * @param data 
     */
    onSelect(data) {
        console.log("onSelect : ", data);
    }

}
