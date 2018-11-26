import { Component, OnInit } from '@angular/core';
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

// Jquery declaration
declare var $: any;

@Component({
  selector: 'app-incident-list',
  templateUrl: './incident-list.component.html',
  styleUrls: ['./incident-list.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'ko-KR' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
],
})
export class IncidentListComponent implements OnInit {

    public isLoading = true;

    public incidentDetail: any;                 //선택 인시던트 id
    public selectedIdx: number = -1;            //삭제를 위한 인덱스, 상세보기 시 값변경
    private page: number = 1;                   //출력 시작 인덱스
    private perPage: number = 3;                //한번에 화면에 조회되는 리스트 수
    private formData: any = {};                 //전송용 formData

    public incidents: any = [];                 //조회 incident
    public totalCnt: number = 0;                //전체건수

    public status_cd: string = "*";             //진행상태 
    public reg_date_from;                       //검색시작일
    public reg_date_to;                         //검색종료일
    public searchType: string = "title,content";//검색구분
    public searchText: string ="";              //검색어

    public empEmail: string = "";               //팝업 조회용 이메일

    public searchTypeObj: { name: string; value: string; }[] = [
        { name: '제목+내용', value: 'title,content' },
        { name: '제목', value: 'title' },
        { name: '내용', value: 'content' }
    ];  
    public today = new Date();
    public minDate = new Date(2015, 0, 1);
    public maxDate = new Date(2030, 0, 1);
    public events: string[] = [];

    constructor(private auth: AuthService,
        private toast: ToastComponent,
        private incidentService: IncidentService,
        private empInfo: EmpInfoComponent,
        private modalService: NgbModal,
        private router: Router) {
    }

    ngOnInit() {
        this.isLoading = false;
        
        //this.reg_date_to = new FormControl(new Date()).value;
        this.getIncident();
    }

    /**
     * 조회클릭 시
     */
    onSubmit(){
        
        //1페이지로 초기화
        this.page = 1;
        this.incidents = [];

        this.formData.status_cd = this.status_cd;
        if(this.reg_date_from != null)
            this.formData.reg_date_from = this.reg_date_from.format('YYYY-MM-DD');
        if(this.reg_date_to != null)
            this.formData.reg_date_to = this.reg_date_to.format('YYYY-MM-DD');
        this.formData.searchType = this.searchType;
        this.formData.searchText = this.searchText;

        //console.log("================================");
        //console.log(this.formData);
        //console.log("================================");

        this.getIncident();
    }

    /**
     * incident 조회
     */
    getIncident() {
        
        this.formData.page = this.page++;
        this.formData.perPage = this.perPage;
        this.formData.user = "general";

        this.incidentService.getIncident(this.formData).subscribe(
            (res) => {
                var tmp = this.incidents.concat(res.incident);
                this.incidents = tmp;
                this.totalCnt = res.totalCnt;

                if(res.incident.length == 0){
                    this.toast.open('더 이상 조회데이타가 없습니다..', 'success');
                }

            },
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
        console.log("this.reg_date_to : ", this.reg_date_to);
        console.log("this.reg_date_from : ", this.reg_date_from);
        console.log("================================");

        this.onSubmit();

        //this.events.push(`${type}: ${event.value}`);
        //console.log("========== addEvent ============");
        //console.log("type : ", type, "event : ", event.value);
        //console.log("================================");
    }

    /**
     * 상세보기창 호출
     * @param modalId 모달창 id
     * @param incident 조회할 incident 객체
     * @param idx  삭제를 위한 인덱스
     */
    setDetail(modalId, incident, idx){
        this.incidentDetail = incident;
        this.selectedIdx = idx;
        this.modalService.open(modalId, { windowClass: 'xxlModal', centered: true});
    }

    /**
     * 입력 개수 만큼 빈 Array생성( *ngFor문용)
     * @param i 입력 개수
     */
    counter(i: number) {
        return new Array(i);
    }

    /**
     * 진행구분 선택 시
     */
    onSelected(processStatus: string) {
        this.status_cd = processStatus;
        this.onSubmit();
    }

    /**
     * 직원 정보 모달창 호출
     * @param modalId 모달창 id
     * @param email 
     */
    getEmpInfo(modalId, email){
        this.empEmail = email;
        this.modalService.open(modalId, { windowClass: 'mdModal', centered: true });
    }

    /**
     * 삭제된 후 처리
     * @param event 
     */
    afterDelete(){
        //상세에서 삭제된 데이타를 배열에서도 삭제
        //this.incidents.splice(this.selectedIdx,1);
        //this.getIncident();
        this.onSubmit();
    }
    

    /**
     * 재등록 후 재조회 
     */
    reload(){
        this.getIncident();
    }
}
