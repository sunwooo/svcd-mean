import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { QnaService } from '../../../services/qna.service';
import { CommonApiService } from '../../../services/common-api.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-qna-list',
  templateUrl: './qna-list.component.html',
  styleUrls: ['./qna-list.component.css']
})

export class QnaListComponent implements OnInit {
  public isLoading = true;
  public qnaDetail: any;                       //선택 qna id

  public oftenqna: any = [];                   //조회 company

  public higherObj: any = [];                  //상위업무리스트
  public higher_cd: string = "*";              //상위업무코드


  public searchType: string = "title,content"; //검색구분
  public searchText: string = "";              //검색어

  private formData: any = {};                  //전송용 formData

  public searchTypeObj: { name: string; value: string; }[] = [
    { name: '제목+내용', value: 'title,content' },
    { name: '제목', value: 'title' },
    { name: '내용', value: 'content' }
  ];

  public company_cd: string = this.cookieService.get("company_cd");

  constructor(private qnaService: QnaService
    , private commonApi: CommonApiService
    , private modalService: NgbModal
    , private router: Router
    , private cookieService: CookieService ) { }

  public maxSize: number = 10;      // 한 화면에 나타낼 페이지 수
  public page: number = 0;          // 현재 페이지
  public totalDataCnt: number = 0;
  public pageDataSize: number = 15;
  public totalPage: number = 0;       // 총 페이지수

  ngOnInit() {
    this.isLoading = false;
    this.getQna();
    this.getHigherProcess();
  }

  onSubmit() {

    this.formData.searchType = this.searchType;
    this.formData.searchText = this.searchText;

    this.getQna();
  }

  /**
  * Qna 조회
  */
  getQna() {

    //this.formData.page = this.page++;
    //this.formData.perPage = this.perPage;
    this.formData.higher_cd = this.higher_cd;
    this.formData.company_cd = this.company_cd;
    console.log("higher_cd :" ,this.higher_cd );
    console.log("getQna() company_cd :", this.company_cd);


    this.qnaService.getUserQnaList(this.formData).subscribe(
      (res) => {

        this.totalDataCnt = res.totalCnt;
        this.totalPage = res.totalPage;
        this.oftenqna = res.oftenqna;

        console.log("this.oftenqna : ", this.oftenqna);
      },
      (error: HttpErrorResponse) => {
      }
    );
  }

  /**
   * 상위업무리스트 조회
   */

  getHigherProcess() {
    this.commonApi.getHigher({ scope: "*" }).subscribe( //
      (res) => {
        console.log("res ====>", res);
        this.higherObj = res;
      },
      (error: HttpErrorResponse) => {
      }
    );
  }

  /**
   * 상위업무 변경 시 
   */

  setHigherCd(higherCd) {
    this.higher_cd = higherCd;
    this.getQna();
  }

  /**
   * 페이지 이동 시
   * @param selectedPage 
   */
  pageChange(selectedPage) {
    console.log("pageChange!!", selectedPage);
    this.formData.page = selectedPage;
    this.formData.perPage = this.pageDataSize;

    this.getQna();

  }

  setDetail(modalId, oftenqna) {
    this.qnaDetail = oftenqna;
    this.modalService.open(modalId, { windowClass: 'xlModal', centered: true });
  }

  /**
   * 수정된 후 처리
   * @param event 
   */
  reload() {
    this.formData.page = this.page;
    this.formData.perPage = this.pageDataSize;

    this.getQna();
  }

}
