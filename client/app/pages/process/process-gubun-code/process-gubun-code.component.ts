import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ProcessGubunCodeService } from '../../../services/process-gubun-code.service';

@Component({
    selector: 'app-process-gubun-code',
    templateUrl: './process-gubun-code.component.html',
    styleUrls: ['./process-gubun-code.component.css']
})
export class ProcessGubunCodeComponent implements OnInit {

    public isLoading = true;
    public processGubunCodeDetail: any;                 //선택 id
    public processGubunCode: any = [];                  //조회 processGubunCode
    public searchType: string = "process_nm";           //검색구분
    public searchText: string = "";                     //검색어
    public selectedIdx: number = -1;            //삭제를 위한 인덱스, 상세보기 시 값변경
    private formData: any = {};                         //전송용 formData

    public searchTypeObj: { name: string; value: string; }[] = [
        { name: '처리구분명', value: 'process_nm' }
    ];

    constructor(private processGubunCodeService: ProcessGubunCodeService
        , private modalService: NgbModal
        , private router: Router) { }

    public maxSize: number = 10;      // 한 화면에 나타낼 페이지 수
    public page: number = 0;          // 현재 페이지
    public totalDataCnt: number = 0;
    public pageDataSize: number = 15;
    public totalPage: number = 0;

    ngOnInit() {
        this.isLoading = false;
        this.getProcessGubunCodeList();
    }

    onSubmit() {

        this.formData.searchType = this.searchType;
        this.formData.searchText = this.searchText;

        this.getProcessGubunCodeList();
    }

    /**
    * 처리구분코드 조회
    */
    getProcessGubunCodeList() {
        this.processGubunCodeService.getProcessGubunCodeList(this.formData).subscribe(
            (res) => {

                console.log("getProcessGubunCodeList res >>> ", res);
                this.totalDataCnt = res.totalCnt;
                this.totalPage = res.totalPage;

                this.processGubunCode = res.processGubun;

            },
            (error: HttpErrorResponse) => {
            }
        );
    }

    pageChange(selectedPage) {
        this.formData.page = selectedPage;
        this.formData.perPage = this.pageDataSize;

        this.getProcessGubunCodeList();
    }

    /**
     * 상세보기창 호출
     * @param modalId 모달창 id
     * @param processGubunCode 조회할 user 객체
     * @param idx  삭제를 위한 인덱스
     */
    setDetail(modalId, processGubunCode, idx) {
        this.processGubunCodeDetail = processGubunCode;
        this.selectedIdx = idx;
        this.modalService.open(modalId, { windowClass: 'xlModal', centered: true });
    }

    /**
     * 수정된 후 처리
     * @param event 
     */
    reload() {
        this.formData.page = this.page;
        this.formData.perPage = this.pageDataSize;

        this.getProcessGubunCodeList();
    }

    /**
     * 처리구분코드 추가 페이지 이동
     */
    goAddPage() {
        this.router.navigate(["/svcd/4700"]);
    }
}
