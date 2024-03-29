import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
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

// Jquery declaration
declare var $: any;

//************************ select search ************************ */
import {MatSelect} from '@angular/material';
import { ReplaySubject } from 'rxjs';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';
//************************ select search ************************ */


@Component({
    selector: 'app-incident-list-mng',
    templateUrl: './incident-list-mng.component.html',
    styleUrls: ['./incident-list-mng.component.scss'],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'ko-KR' },
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    ],
})

export class IncidentListMngComponent implements OnInit, AfterViewInit, OnDestroy {


    //************************ select search ************************ */
    /** control for the selected company */
    public companyCtrl: FormControl = new FormControl();
    
    /** control for the MatSelect filter keyword */
    public companyFilterCtrl: FormControl = new FormControl();

    /** control for the selected company for multi-selection */
    //public companyMultiCtrl: FormControl = new FormControl();

    /** control for the MatSelect filter keyword multi-selection */
    public companyMultiFilterCtrl: FormControl = new FormControl();

    /** list of company */
    public company = []; //회사리스트

    /** list of company filtered by search keyword */
    public filteredCompany: ReplaySubject<any> = new ReplaySubject<any>(1);

    /** list of company filtered by search keyword for multi-selection */
    public filteredCompanyMulti: ReplaySubject<any> = new ReplaySubject<any>(1);

    @ViewChild('singleSelect') singleSelect: MatSelect;

    /** Subject that emits when the component has been destroyed. */
    private _onDestroy = new Subject<void>();
    //************************ select search ************************ */


    public isLoading = true;

    public incidentDetail: any;                 //선택 인시던트 id
    public selectedIdx: number = -1;            //삭제를 위한 인덱스, 상세보기 시 값변경
    private formData: any = {};                 //전송용 formData

    public incidents: any = [];                 //조회 incident

    public status_cd = ['1','2'];               //진행상태 
    public company_cd: string = "*";            //회사코드
    public lower_cd: string = "*";              //하위코드
    public reg_date_from;                       //검색시작일
    public reg_date_to;                         //검색종료일
    public searchText: string = "";              //검색어

    public empEmail: string = "";               //팝업 조회용 이메일
             
    public lowerObj: any = [];                //하위업무리스트

    //public searchType = ['title','content'];//검색구분
    public searchType = 'title,content';//검색구분

    /*
        220728_김선재 : "긴급" 조회조건 추가
    */
    public urgent: boolean = false;

    public searchTypeObj = [
        { name: '제목', id: 'title' },
        { name: '내용', id: 'content' },
        { name: '요청자명', id: 'request_nm' },
        { name: '담당자명', id: 'manager_nm' }
    ];
/*    
    public searchTypeObj: { name: string; value: string; }[] = [
        { name: '제목+내용', value: 'title,content' },
        { name: '제목', value: 'title' },
        { name: '내용', value: 'content' }
    ];
*/
    public searchTypeCtrl: FormControl = new FormControl();

    public today = new Date();
    public minDate = new Date(2015, 0, 1);
    public maxDate = new Date(2030, 0, 1);
    public events: string[] = [];

    public maxSize: number = 10;      // 한 화면에 나타낼 페이지 수
    public page: number = 0;          // 현재 페이지
    public totalDataCnt: number = 0;  // 총 데이타 수
    public totlaPageCnt: number = 0;  // 총페이지 수 
    public pageDataSize: number = 15;   // 페이지당 출력 개수  

    public processStatus = [];
    public statusCdCtrl: FormControl = new FormControl();

    constructor(private auth: AuthService,
        private toast: ToastComponent,
        private incidentService: IncidentService,
        private commonApi: CommonApiService,
        private empInfo: EmpInfoComponent,
        private modalService: NgbModal,
        private router: Router) {
    }

    ngOnInit() {
        //this.reg_date_to = new FormControl(new Date()).value;
        this.searchTypeCtrl.setValue([{ name: '제목', id: 'title' }, { name: '내용', id: 'content' }]);

        this.getIncident();
        this.initProcessStatus();
        this.getCompanyList();
        this.getMyProcess();

    }

    compareWithFunc(a, b) {
        return a.name === b.name;
      }

    /**
     * 회사리스트 조회
     */
    getCompanyList() {
        this.commonApi.getCompany(this.formData).subscribe(
            (res) => {
                
                var initCom: any = {};
                initCom.name = '전체';
                initCom.id = '*';
                this.company.push(initCom);

                res.forEach(company => {
                    var tmpCom: any = {};
                    tmpCom.name = company.company_nm;
                    tmpCom.id = company.company_cd;
                    this.company.push(tmpCom);
                });

                //************************ select search ************************ */
                // set initial selection
                this.companyCtrl.setValue(this.company[0]);
                //this.companyMultiCtrl.setValue([this.company[10], this.company[11], this.company[12]]);

                // load the initial company list
                this.filteredCompany.next(this.company.slice());
                //this.filteredCompanyMulti.next(this.company.slice());

                // listen for search field value changes
                this.companyFilterCtrl.valueChanges
                .pipe(takeUntil(this._onDestroy))
                .subscribe(() => {
                    this.filterCompany();
                });
                this.companyMultiFilterCtrl.valueChanges
                .pipe(takeUntil(this._onDestroy))
                .subscribe(() => {
                    this.filterCompanyMulti();
                });
                //************************ select search ************************ */

            },
            (error: HttpErrorResponse) => {
            }
        );
    }

    /**
     * 나의업무리스트 조회
     */
    getMyProcess() {
        this.commonApi.getMyProcess().subscribe(
            (res) => {
                this.lowerObj = res;
            },
            (error: HttpErrorResponse) => {
            }
        );
    }

    /* 
        220728_김선재 : "긴급" 조회조건 추가 
        - 체크박스 체크시 목록 조회
    */
    onUrgentChecked() {
        this.getIncident();
    }

    /**
     * incident 조회
     */
    getIncident() {

        //1페이지로 초기화
        //this.page = 1;
        //this.incidents = [];

        this.formData.page = this.page;
        this.formData.perPage = this.pageDataSize;
        this.formData.user = "manager";
        this.formData.status_cd = this.status_cd;
        this.formData.company_cd = this.company_cd;
        this.formData.lower_cd = this.lower_cd;
        if (this.reg_date_from != null)
            this.formData.reg_date_from = this.reg_date_from.format('YYYY-MM-DD');
        if (this.reg_date_to != null)
            this.formData.reg_date_to = this.reg_date_to.format('YYYY-MM-DD');
        this.formData.searchType = this.searchType;
        this.formData.searchText = this.searchText;
        /* 220728_김선재 : "긴급" 조회조건 추가 */
        this.formData.urgent = this.urgent;

        this.isLoading = true;
        this.incidentService.getIncident(this.formData).subscribe(
            (res) => {

                this.incidents = [];
                var tmp = this.incidents.concat(res.incident);
                this.incidents = tmp;
                this.totalDataCnt = res.totalCnt;
                
                if (this.incidents.length == 0) {
                    this.toast.open('조회데이타가 없습니다..', 'success');
                }
                this.isLoading = false;
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

        //console.log("================================");
        //console.log("this.reg_date_to : ", this.reg_date_to);
        //console.log("this.reg_date_from : ", this.reg_date_from);
        //console.log("================================");

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
        this.selectedIdx = idx;
        this.modalService.open(modalId, { windowClass: 'xxlModal', centered: true });
    }

    /**
     * 입력 개수 만큼 빈 Array생성( *ngFor문용)
     * @param i 입력 개수
     */
    counter(i: number) {
        return new Array(i);
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
     * 진행구분 선택 시
     */
    selectedStatusCd(processStatus){
        var tmpSt = ['X']; //진행상태가 선택되지 않으면 조회되는 값이 없어야 함
        processStatus.value.forEach(ps => {
            tmpSt.push(ps.id);
        });
        this.status_cd = tmpSt;
        this.getIncident();
    }


    /**
     * 검색구분 선택 시
     */
    selectedSearchType(searchType){
        
        this.searchType = "";
        searchType.value.forEach(st => {
            this.searchType = this.searchType + "," +st.id;
        });

        if(this.searchText != ""){
            this.getIncident();
        }
    }
    
    /**
     * 회사 선택 시
     * @param company
     */
    selectedCom(company){
        this.company_cd = company.value.id;
        this.getIncident();
    }

    /**
     * 진행상태 항목 조회
     */
    initProcessStatus(){
        this.commonApi.getProcessStatus('*').subscribe(
            (res) => {
                
                //console.log('============= processStatus.commonApi.getProcessStatus(this.condition).subscribe ===============');
                //console.log("res : ", res);
                //console.log('================================================================================================');
                
                res.forEach(ps => {
                    var tmpStatus: any = {};
                    tmpStatus.name = ps.status_nm;
                    tmpStatus.id = ps.status_cd;
                    this.processStatus.push(tmpStatus);
                });
                
                //console.log('============= processStatus.commonApi.getProcessStatus(this.condition).subscribe ===============');
                //console.log("this.processStatus : ",this.processStatus);
                //console.log('================================================================================================');
                
                var initStatusCd = [];
                initStatusCd.push(this.processStatus[0]);
                initStatusCd.push(this.processStatus[1]);
                this.statusCdCtrl.setValue(initStatusCd);

            },
            (error: HttpErrorResponse) => {
                console.log('error : ',error);
            }
        );
    }


    //************************ select search ************************ */
    ngAfterViewInit() {
        this.setInitialValue();
    }

    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    /**
     * Sets the initial value after the filteredCompany are loaded initially
     */
    private setInitialValue() {
        this.filteredCompany
            .pipe(take(1), takeUntil(this._onDestroy))
            .subscribe(() => {
            // setting the compareWith property to a comparison function
            // triggers initializing the selection according to the initial value of
            // the form control (i.e. _initializeSelection())
            // this needs to be done after the filteredCompany are loaded initially
            // and after the mat-option elements are available
            this.singleSelect.compareWith = (a: any, b: any) => a && b && a.id === b.id;
            });
    }

    private filterCompany() {
        if (!this.company) {
            return;
        }
        // get the search keyword
        let search = this.companyFilterCtrl.value;
        if (!search) {
            this.filteredCompany.next(this.company.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the company
        this.filteredCompany.next(
            this.company.filter(company => company.name.toLowerCase().indexOf(search) > -1)
        );
    }

    private filterCompanyMulti() {
        if (!this.company) {
            return;
        }
        // get the search keyword
        let search = this.companyMultiFilterCtrl.value;
        if (!search) {
            this.filteredCompanyMulti.next(this.company.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the company
        this.filteredCompanyMulti.next(
            this.company.filter(company => company.name.toLowerCase().indexOf(search) > -1)
        );
    }
    //************************ select search ************************ */



}

