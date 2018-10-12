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

@Component({
  selector: 'app-incident-list-injectable',
  templateUrl: './incident-list-injectable.component.html',
  styleUrls: ['./incident-list-injectable.component.css']
})
export class IncidentListInjectableComponent implements OnInit {

    @Input() selectedItem: any; //조회용 아이템
    @Input() searchYyyy;
    @Input() searchMm;
    @Input() searhHigherCd;
    @Input() searchCompany;
    @Input() searchManagerEmail;
    @Input() searchRequestId;

    public incidentDetail: any;                 //선택 인시던트 id
    public selectedIdx: number = -1;            //삭제를 위한 인덱스, 상세보기 시 값변경
    private formData: any = {};                 //전송용 formData
    public incidents: any = [];                 //조회 incident
    public empEmail: string = "";               //팝업 조회용 이메일

    public maxSize: number = 10;      // 한 화면에 나타낼 페이지 수
    public page: number = 1;          // 현재 페이지
    public totalDataCnt: number = 0;  // 총 데이타 수
    public totlaPageCnt: number = 0;  // 총페이지 수 
    public pageDataSize: number = 10;   // 페이지당 출력 개수  


    constructor(private auth: AuthService,
        private toast: ToastComponent,
        private incidentService: IncidentService,
        private empInfo: EmpInfoComponent,
        private modalService: NgbModal,
        private router: Router) { }

    ngOnInit() {
        /*
        console.log("====================================");
        console.log("selectedItem : ",this.selectedItem);
        console.log("searchYyyy : ",this.searchYyyy);
        console.log("searchMm : ",this.searchMm);
        console.log("searhHigherCd : ",this.searhHigherCd);
        console.log("searchCompany : ",this.searchCompany);
        console.log("searchManagerEmail : ",this.searchManagerEmail);
        console.log("searchRequestId : ",this.searchRequestId);
        console.log("====================================");
        */
        this.getIncident();
    }

    /**
     * incident 조회
     */
    getIncident() {

        this.setTransForm();

        this.incidentService.getIncidentDashboard(this.formData).subscribe(
            
            (res) => {

                this.incidents = [];
                var tmp = this.incidents.concat(res.incident);
                this.incidents = tmp;
                this.totalDataCnt = res.totalCnt;
                if (this.totalDataCnt == 0) {
                    this.toast.open('조회데이타가 없습니다..', 'success');
                }

            },
            (error: HttpErrorResponse) => {
            },
            () => {
                this.totlaPageCnt = Math.ceil(this.totalDataCnt / this.pageDataSize);
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

        console.log("========================================= ");
        console.log("setDetail");
        console.log("setDetail incident ", incident, idx);
        console.log("========================================= ");

        this.incidentDetail = incident;
        this.selectedIdx = idx;
        this.modalService.open(modalId, { windowClass: 'xxlModal', centered: true });
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
     * 페이지 선택 변경 시
     * @param selectedPage 
     */
    pageChange(selectedPage){
        this.formData.page = selectedPage;
        this.formData.perPage = this.pageDataSize;

        this.getIncident();
    }

    /**
     * 전송용 폼 세팅
     */
    setTransForm(){
        // 리스트
        this.formData.page = this.page;
        this.formData.perPage = this.pageDataSize;
        
        this.formData.register_yyyy = this.searchYyyy;
        this.formData.register_mm = this.searchMm;
        this.formData.higher_cd = this.searhHigherCd;
        this.formData.request_company_cd = this.searchCompany;

        //console.log("============================================");
        //console.log("this.searchManagerEmail : ",this.searchManagerEmail);
        //console.log("this.searchRequestId : ",this.searchRequestId);
        //console.log("============================================");

        if(this.searchManagerEmail){
            this.formData.manager_email = this.searchManagerEmail;
        }
        if(this.searchRequestId){
            this.formData.request_id = this.searchRequestId;
        }

        //console.log("============================================");
        //console.log("this.formData : ",this.formData);
        //console.log("============================================");

        //조건추가
        this.setItem();
    }

    /**
     * 조회 조건 추가
     */
    setItem(){
        if(this.selectedItem == '접수대기'){
            this.formData.status_cd = '1';
        }else if(this.selectedItem == '처리중'){
            this.formData.status_cd = '2';
        }else if(this.selectedItem == '미평가'){
            this.formData.status_cd = '3';
        }else if(this.selectedItem == '처리완료'){
            this.formData.status_cd = '4';
        }
        
        if(this.selectedItem == '매우만족'){
            this.formData.valuation = '5';
        }else if(this.selectedItem == '만족'){
            this.formData.valuation = '4';
        }else if(this.selectedItem == '보통'){
            this.formData.valuation = '3';
        }else if(this.selectedItem == '불만족'){
            this.formData.valuation = '2';
        }else if(this.selectedItem == '매우불만족'){
            this.formData.valuation = '1';
        }else if(this.selectedItem == '기타'){
            this.formData.valuation = null;
        }
    }

    /**
     * 입력 개수 만큼 빈 Array생성( *ngFor문용)
     * @param i 입력 개수
     */
    counter(i: number) {
        return new Array(i);
    }

}
