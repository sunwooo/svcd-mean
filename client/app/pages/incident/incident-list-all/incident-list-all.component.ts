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

// Jquery declaration
declare var $: any;

@Component({
    selector: 'app-incident-list-all',
    templateUrl: './incident-list-all.component.html',
    styleUrls: ['./incident-list-all.component.scss'],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'ko-KR' },
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    ],
})
export class IncidentListAllComponent implements OnInit {

    @ViewChild(LowerCdComponent) child: LowerCdComponent;    

    public isLoading = true;

    public incidentDetail: any;                 //선택 인시던트 id
    public selectedIdx: number = -1;            //삭제를 위한 인덱스, 상세보기 시 값변경
    private formData: any = {};                 //전송용 formData
    public incidents: any = [];                 //조회 incident

    public status_cd: string = "*";             //진행상태 
    public company_cd: string = "*";             //회사코드
    public higher_cd: string = "*";              //상위코드
    public lower_cd: string = "*";              //하위코드
    public register_yyyy: string = "";          //검색년도
    public reg_date_from;                       //검색시작일
    public reg_date_to;                         //검색종료일
    public searchType: string = "title,content";//검색구분
    public searchText: string = "";              //검색어
    public user_flag: string = "user";           //사용자 구분
    public empEmail: string = "";               //팝업 조회용 이메일

    public companyObj: any = [];                //회사리스트
    public registerYyyyObj: any = [];           //문의년도 리스트
    public lowerObj: any = [];                //하위업무리스트
    public searchTypeObj: { name: string; value: string; }[] = [
        { name: '제목+내용', value: 'title,content' },
        { name: '제목', value: 'title' },
        { name: '내용', value: 'content' },
        { name: '요청자', value: 'request_nm' },
        { name: '담당자', value: 'manager_nm' }
    ];

    public today = new Date();
    public minDate = new Date(2015, 0, 1);
    public maxDate = new Date(2030, 0, 1);
    public events: string[] = [];

    public maxSize: number = 10;      // 한 화면에 나타낼 페이지 수
    public page: number = 0;          // 현재 페이지
    public totalDataCnt: number = 0;  // 총 데이타 수
    public totlaPageCnt: number = 0;  // 총페이지 수 
    public pageDataSize: number = 15;   // 페이지당 출력 개수  

    constructor(private auth: AuthService,
        private toast: ToastComponent,
        private incidentService: IncidentService,
        private commonApi: CommonApiService,
        private empInfo: EmpInfoComponent,
        private modalService: NgbModal,
        private excelService:ExcelService,
        private router: Router) {
    }

    ngOnInit() {
        this.isLoading = false;

        if(this.auth.user_flag == "1"){ //SD 전체관리자
            this.user_flag = "managerall";
        }else if(this.auth.user_flag == "2" || this.auth.user_flag == "3" || this.auth.user_flag == "4"){ //
            this.user_flag = "manager";
        }else if(this.auth.user_flag == "5"){//고객사 담당자
            this.user_flag = "company";
        }
        
        var today = new Date();
        this.register_yyyy = today.getFullYear().toString();

        //this.reg_date_to = new FormControl(new Date()).value;
        this.getRegisterYyyy();
        this.getCompanyList();
        this.getIncident();
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
     * 등록요청 년도 조회
     */
    getRegisterYyyy() {
        this.commonApi.getRegisterYyyy().subscribe(
            (res) => {
                this.registerYyyyObj = res;
            },
            (error: HttpErrorResponse) => {
            }
        );
    }

    /**
     * incident 조회
     */
    getIncident() {

        this.setTransForm();

        this.formData.page = this.page;
        this.formData.perPage = this.pageDataSize;

        this.incidentService.getIncident(this.formData).subscribe(
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
     * 달력 이벤트 처리
     * @param type
     * @param event 
     */
    addEvent(type: string, event: MatDatepickerInputEvent<Date>) {

        console.log("================================");
        console.log("this.reg_date_to : ", this.reg_date_to);
        console.log("this.reg_date_from : ", this.reg_date_from);
        console.log("================================");

        this.getIncident();

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
    setDetail(modalId, incident, idx) {

        this.incidentDetail = incident;
        //console.log("setDetail this.incidentDetail : "+ JSON.stringify(this.incidentDetail.higher_cd));
        //console.log("setDetail this.incidentDetail : "+ JSON.stringify(this.incidentDetail.complete_open_flag));
        //console.log("setDetail this.incidentDetail : "+ JSON.stringify(this.user_flag));
        //console.log("setDetail this.incidentDetail : "+ this.user_flag);
        
        this.selectedIdx = idx;
        //this.toast.open(this.user_flag, 'danger'); 
        //this.auth.user_flag == "5"
        //if(this.incidentDetail.higher_cd =="H008" && this.incidentDetail.complete_open_flag == "N" && this.user_flag == "company"){
        if(this.incidentDetail.complete_open_flag == "N" && this.user_flag == "company"){    
            //console.log("1 : ");
            this.toast.open('조회 권한이 없습니다. 관리자에게 문의하시기 바랍니다.', 'danger'); 
        }else{
            this.modalService.open(modalId, { windowClass: 'xxlModal', centered: true });
        }
        //this.toast.open('조회데이타가 없습니다..', 'success');
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
        this.getIncident();
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
     * 삭제된 후 처리
     * @param event 
     */
    reload() {
        this.getIncident();
    }

    /**
     * 페이징 처리
     * @param selectedPage
     */
    pageChange(selectedPage) {
        this.page = selectedPage;
        this.getIncident();
    }

    /**
     * 상위업무 선택 시 처리 
     */
    setHigher(higher) {
        this.higher_cd = higher.higher_cd;
        this.lower_cd = "*";
        this.child.getLowerCd(this.higher_cd);
        this.getIncident();
    }

    /**
     * 하위업무 선택 시 처리
     */
    setLower(lower) {
        this.lower_cd = lower.lower_cd;
        this.getIncident();
    }

    /**
     * 현재 페이지 excelDownload
     */
    excelDownloadAll(){

        var maxCnt = 3000;
        var i = 0;

        if(this.totalDataCnt <= maxCnt){

            this.setTransForm();

            //1페이지로 초기화
            this.formData.page = 1;
            this.formData.perPage = maxCnt;
          
            this.incidentService.getExcelData(this.formData).subscribe(
                (res) => {


                    console.log("===================================================");
                    console.log("res: ",res);
                    console.log("===================================================");

                    if(res.incident){
                                       
                        for(i=0; i<res.incident.length; i++){

                            res.incident[i].고객요청내용 = res.incident[i].고객요청내용.replace(/<br>/ig, "\n");
                            res.incident[i].고객요청내용 = res.incident[i].고객요청내용.replace(/&nbsp;/ig, " ");
                            res.incident[i].고객요청내용 = res.incident[i].고객요청내용.replace(/<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig, "");
                         
                        }
                        
                        
                        this.excelService.exportAsExcelFile(res.incident, '문의내용');
                    }else{
                        this.toast.open(JSON.stringify(res.message), 'danger');
                    }

                },
                (error: HttpErrorResponse) => {
                }
            );
        }else{
            this.toast.open(maxCnt+'건 이하로 다운로드하세요.', 'primary');
        }  
        
    }

    /**
     * 전송용 폼 세팅
     */
    setTransForm(){
        this.formData.page = 1;
        this.formData.perPage = 10000;
        this.formData.user = this.user_flag;
        this.formData.status_cd = this.status_cd;
        this.formData.company_cd = this.company_cd;
        this.formData.register_yyyy = this.register_yyyy;
        this.formData.higher_cd = this.higher_cd;
        this.formData.lower_cd = this.lower_cd;
        if (this.reg_date_from != null)
            this.formData.reg_date_from = this.reg_date_from.format('YYYY-MM-DD');
        if (this.reg_date_to != null)
            this.formData.reg_date_to = this.reg_date_to.format('YYYY-MM-DD');
        this.formData.searchType = this.searchType;
        this.formData.searchText = this.searchText;
        
    }

}
