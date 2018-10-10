import { Component, OnInit, Input } from '@angular/core';
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
import { UserService } from '../../../services/user.service';
import { StatisticService } from '../../../services/statistic.service';

@Component({
    selector: 'app-incident-people-modal',
    templateUrl: './incident-people-modal.component.html',
    styleUrls: ['./incident-people-modal.component.css']
})
export class IncidentPeopleModalComponent implements OnInit {

    @Input() cValues;           //모달창 닫기용
    @Input() dValues;           //모달창 무시용
    @Input() searchYyyy;        //조회연도
    @Input() searchMm;          //조회월
    @Input() searhHigherCd;     //조회업무
    @Input() searchCompany;     //조회회사
    @Input() email;             //이메일
    @Input() gubun;             //차트선택 구분

    public isLoading = true;
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

    public higherCntChart = [
        {
          "name": "Germany",
          "value": 40632
        },
        {
          "name": "United States",
          "value": 49737
        },
        {
          "name": "France",
          "value": 36745
        },
        {
          "name": "United Kingdom",
          "value": 36240
        },
        {
          "name": "Spain",
          "value": 33000
        },
        {
          "name": "Italy",
          "value": 35800
        }
      ];

      public valuationChart = [
        {
          "name": "Germany",
          "value": 40632
        },
        {
          "name": "United States",
          "value": 49737
        },
        {
          "name": "France",
          "value": 36745
        },
        {
          "name": "United Kingdom",
          "value": 36240
        },
        {
          "name": "Spain",
          "value": 33000
        },
        {
          "name": "Italy",
          "value": 35800
        }
      ];

    public colorScheme3 = {
        domain: ['#008fd4', '#b4985a', '#99ca3c', '#a7a9ac', '#f04124']
    };

    constructor(private auth: AuthService,
        private toast: ToastComponent,
        private incidentService: IncidentService,
        private empInfo: EmpInfoComponent,
        private modalService: NgbModal,
        private userService: UserService,
        private statisticService: StatisticService,
        private router: Router) { }

    ngOnInit() {

        console.log("=======================================");
        console.log("searchYyyy : ", this.searchYyyy);
        console.log("searchMm : ", this.searchMm);
        console.log("searhHigherCd : ", this.searhHigherCd);
        console.log("searchCompany : ", this.searchCompany);
        console.log("email : ", this.email);
        console.log("gubun : ", this.gubun);
        console.log("=======================================");

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
        this.formData.company_cd = this.searchCompany;

        if(this.gubun == "접수"){ //접수
            this.formData.manager_email = this.email;
        }else{  //요청, 만족, 불만
            this.formData.request_id = this.email;
        }

        this.higherCnt();
        this.valuationCnt();

    }

    /**
     * 요청자 신청건수/담당자 접수 건수
     */
    higherCnt(){

        this.statisticService.higherCnt(this.formData).subscribe(
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
        this.statisticService.valuationCnt(this.formData).subscribe(
            (res) => {
                this.valuationChart = res;
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


    /**
     * 모달 닫기
    */
    closeModal($event) {
        this.cValues('Close click');
    }

}
