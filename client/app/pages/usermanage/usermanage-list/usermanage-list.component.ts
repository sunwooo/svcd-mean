import { Component, OnInit } from '@angular/core';
import { UsermanageService } from '../../../services/usermanage.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonApiService } from '../../../services/common-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-usermanage-list',
    templateUrl: './usermanage-list.component.html',
    styleUrls: ['./usermanage-list.component.css']
})
export class UsermanageListComponent implements OnInit {

    public companyCd: string;
    public isLoading = true;
    public usermanage: any = [];                //조회 usermanage
    public usermanageDetail: any;               //선택 인시던트 id

    public searchType: string = "";             //검색구분
    public searchText: string = "";             //검색어
    public company_cd: string = "*";            //회사코드
    public using_yn: string = "*";              //사용여부(Y/N)

    public companyObj: any = [];                //회사리스트
    private formData: any = {};                 //전송용 formData

    public searchTypeObj: { name: string; value: string; }[] = [
        { name: '사원명', value: 'employee_nm' },
        { name: '회사명', value: 'company_nm' }
    ];

    public using_ynObj: { name: string; value: string; }[] = [
        { name: '사용', value: 'Y' },
        { name: '미사용', value: 'N' }
    ];

    constructor(private usermanageService: UsermanageService,
        private commonApi: CommonApiService,
        private modalService: NgbModal) { }

    public maxSize: number = 10;      // 한 화면에 나타낼 페이지 수
    public page: number = 0;          // 현재 페이지
    public totalDataCnt: number = 0;
    public pageDataSize: number = 15;

    ngOnInit() {

        this.isLoading = false;
        this.getCompanyList();
        this.getUsermanage();
    }

    onSubmit() {

        //1페이지로 초기화
        //this.page = 1;
        //this.incidents = [];

        //this.formData.status_cd = this.status_cd;
        //if(this.reg_date_from != null)
        //    this.formData.reg_date_from = this.reg_date_from.format('YYYY-MM-DD');
        //if(this.reg_date_to != null)
        //    this.formData.reg_date_to = this.reg_date_to.format('YYYY-MM-DD');
        //this.formData.searchType = this.searchType;

        this.formData.searchType = this.searchType;
        this.formData.searchText = this.searchText;
        this.formData.company_cd = this.company_cd;
        this.formData.using_yn = this.using_yn;

        //console.log("========================usermanage searchText start");
        //console.log("this.formData   : ", this.formData);
        //console.log("this.searchType : ", this.searchType);
        //console.log("this.searchText : ", this.searchText);
        //console.log("this.company_cd : ", this.company_cd);
        //console.log("this.using_yn : ", this.using_yn);
        //console.log("========================usermanage searchText end");

        this.getUsermanage();
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
    * Usermanage 조회
    */
    getUsermanage() {

        //this.formData.page = this.page++;
        //this.formData.perPage = this.perPage;

        this.usermanageService.getUsermanageList(this.formData).subscribe(
            (res) => {

                //var tmp = this.incidents.concat(res.incident);
                //this.incidents = tmp;
                this.totalDataCnt = res.totalCnt;

                //if(res.incident.length == 0){
                //    this.toast.open('더 이상 조회데이타가 없습니다..', 'success');
                //}
                //console.log("this.formData : ", this.formData);
                this.usermanage = res.usermanage;
                //console.log("res.usermanage : ", res.usermanage);

            },
            (error: HttpErrorResponse) => {
            }
        );

    }

    pageChange(selectedPage) {
        console.log("================================pageChange!!", selectedPage);
        this.formData.page = selectedPage;
        this.formData.perPage = this.pageDataSize;

        this.getUsermanage();
    }

    setDetail(modalId, usermanage) {
        this.usermanageDetail = usermanage;
        this.modalService.open(modalId, { windowClass: 'xlModal', centered: true });
    }

    /**
   * 수정된 후 처리
   * @param event 
   */
    reload() {
        this.formData.page = this.page;
        this.formData.perPage = this.pageDataSize;

        this.getUsermanage();
    }
}