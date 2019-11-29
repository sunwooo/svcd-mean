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
import { Dashboard1Component } from '../dashboard1/dashboard1.component';
import { Dashboard2Component } from '../dashboard2/dashboard2.component';
import { Dashboard3Component } from '../dashboard3/dashboard3.component';

//************************ select search ************************ */
import {MatSelect} from '@angular/material';
import { ReplaySubject } from 'rxjs';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';
//************************ select search ************************ */

@Component({
    selector: 'app-dashboard-main',
    templateUrl: './dashboard-main.component.html',
    styleUrls: ['./dashboard-main.component.css']
})
export class DashboardMainComponent implements OnInit {


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

    @ViewChild(Dashboard1Component) dashboard1: Dashboard1Component;
    @ViewChild(Dashboard2Component) dashboard2: Dashboard2Component;
    @ViewChild(Dashboard3Component) dashboard3: Dashboard3Component;

    private formData: any = {};                 //전송용 formData

    public isLoading = true;
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
    public companyInit = "-1";
    public company_nm = "전체";
    public group_flag = "in";

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

        this.group_flag = this.auth.group_flag;
        if(this.group_flag == 'out'){
            this.company_cd = this.auth.company_cd;
            this.company_nm = this.auth.company_nm;
        }

        this.isLoading = false;
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
        this.dashboard1.reload(this.yyyy, this.mm, this.higher_cd, this.company_cd );
        this.dashboard2.reload(this.yyyy, this.mm, this.higher_cd, this.company_cd );
        this.dashboard3.reload(this.yyyy, this.mm, this.higher_cd, this.company_cd );
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

    tabChanged(event){
        console.log("============================");
        console.log(event);
        console.log("============================");
    }
    
    /**
     * 회사 선택 시
     * @param company
     */
    selectedCom(company){
        this.company_cd = company.value.id;
        this.getData();
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
