import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { StatisticService } from '../../../services/statistic.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDatepickerInputEvent, MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';

import { AuthService } from '../../../services/auth.service';
import { ToastComponent } from '../../../shared/toast/toast.component';
import { CommonApiService } from '../../../services/common-api.service';

//************************ select search ************************ */
import {MatSelect} from '@angular/material';
import { ReplaySubject } from 'rxjs';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';
//************************ select search ************************ */

@Component({
    selector: 'app-com-higher',
    templateUrl: './com-higher.component.html',
    styleUrls: ['./com-higher.component.scss']
})
export class ComHigherComponent implements OnInit {


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
    public sData = null;

    public today = new Date();
    private formData: any = {};                 //전송용 formData
    public user_flag: string = "managerall";           //사용자 구분
    public company_cd: string = "*";             //회사코드
    public higher_cd: string = "*";              //상위코드
    public higher_nm = "전체";
    public yyyy: string ="";           //검색년도
    public mm: string = "*";            //검색월


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

        //if(this.auth.user_flag == "1"){ //SD 전체관리자
        //    this.user_flag = "managerall";
        //}else if(this.auth.user_flag == "5"){//고객사 담당자
        //    this.user_flag = "company";
        //}

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
     * 회사별 상위업무 집계 조회
     */
    getData() {

        this.setTransForm();

        this.statisticService.getComHigher(this.formData).subscribe(
            (res) => {
                this.sData = res;
                
                //console.log("====================================================");
                //console.log("sData : ", this.sData);
                //console.log("sData.length : ", this.sData.length);
                //console.log("====================================================");
                
            },
            (error: HttpErrorResponse) => {
            }
        );
    }

    /**
     * 상위업무 선택 시 처리 
     */
    setHigher(higher) {
        this.higher_cd = higher.higher_cd;
        //this.lower_cd = "*";
        //this.child.getLowerCd(this.higher_cd);
        this.getData();
    }


    /**
     * 전송용 폼 세팅
     */
    setTransForm(){
        this.formData.company_cd = this.company_cd;
        this.formData.higher_cd = this.higher_cd;
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
