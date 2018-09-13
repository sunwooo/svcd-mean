import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonApiService } from '../../../services/common-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ToastComponent } from '../../../shared/toast/toast.component';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

    public companyCd: string;
    public isLoading = true;
    public userObj: any = [];                   //조회 user
    public userDetail: any;                     //선택 인시던트 id
    public userDetailNew: any;                  //선택 인시던트 id
    public selectedIdx: number = -1;            //삭제를 위한 인덱스, 상세보기 시 값변경

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

    constructor(private userService: UserService,
        private commonApi: CommonApiService,
        private modalService: NgbModal,
        private router: Router,
        private toast: ToastComponent) { }

    public maxSize: number = 10;      // 한 화면에 나타낼 페이지 수
    public page: number = 0;          // 현재 페이지
    public totalDataCnt: number = 0;  // 총 데이타 수
    public totlaPageCnt: number = 0;  // 총 페이지 수
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

        //console.log("========================user searchText start");
        //console.log("this.formData   : ", this.formData);
        //console.log("this.searchType : ", this.searchType);
        //console.log("this.searchText : ", this.searchText);
        //console.log("this.company_cd : ", this.company_cd);
        //console.log("this.using_yn : ", this.using_yn);
        //console.log("========================user searchText end");

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

        this.formData.page = this.page;
        this.formData.perPage = this.pageDataSize;

        this.userService.getUserList(this.formData).subscribe(
            (res) => {

                this.userObj = [];
                var tmp = this.userObj.concat(res.user);
                this.userObj = tmp;
                this.totalDataCnt = res.totalCnt;

                if (this.userObj.length == 0) {
                    this.toast.open('조회데이타가 없습니다..', 'success');
                }

                //this.userObj = res.user;
            },
            (error: HttpErrorResponse) => {
            },
            () => {
                this.totlaPageCnt = Math.ceil(this.totalDataCnt / this.pageDataSize);
            }
        );

    }

    pageChange(selectedPage) {
        console.log("================================pageChange!!", selectedPage);
        this.formData.page = selectedPage;
        this.formData.perPage = this.pageDataSize;

        this.getUsermanage();
    }

    /**
     * 상세보기창 호출
     * @param modalId 모달창 id
     * @param user 조회할 user 객체
     * @param idx  삭제를 위한 인덱스
     */
    setDetail(modalId, user, idx) {
        this.userDetail = user;
        this.selectedIdx = idx;
        this.modalService.open(modalId, { windowClass: 'xlModal', centered: true });
    }

    addUserPage() {
        this.router.navigate(["/svcd/4450"]);
    }

    /*
   * 수정된 후 처리
   * @param event 
   */
    reload() {
        this.formData.page = this.page;
        this.formData.perPage = this.pageDataSize;

        this.getUsermanage();
    }
}