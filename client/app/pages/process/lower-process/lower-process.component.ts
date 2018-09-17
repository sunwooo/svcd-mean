import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from "@angular/common/http";
import { LowerProcessService } from '../../../services/lower-process.service';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";

@Component({
  selector: 'app-lower-process',
  templateUrl: './lower-process.component.html',
  styleUrls: ['./lower-process.component.css']
})
export class LowerProcessComponent implements OnInit {
  public isLoading = true;
  public lowerProcessDetail: any;                 //선택 상위업무 id

  public lowerProcess: any = [];                     //조회 higherProcess
   
  public searchType: string = "lower_nm";            //검색구분
  public searchText: string = "";                    //검색어

  private formData: any = {};                        //전송용 formData

  public searchTypeObj: { name: string; value: string; }[] = [
        { name: '하위업무명', value: 'lower_nm' }
  ];  

  constructor(private lowerProcessService: LowerProcessService
             ,private modalService: NgbModal
             ,private router: Router) { }
  
  public maxSize: number = 10;      // 한 화면에 나타낼 페이지 수
  public page: number = 0;          // 현재 페이지
  public totalDataCnt: number = 0;   
  public pageDataSize:number =15;     
  public totalPage:number =0;

  ngOnInit() {
    this.isLoading = false;
    this.getLowerList();
  }

  onSubmit(){
   
    this.formData.searchType = this.searchType;
    this.formData.searchText = this.searchText;

    this.getLowerList() ;
  }

  /**
  * LowerProcess 조회
  */
  getLowerList() {
    this.lowerProcessService.getLowerProcessList(this.formData).subscribe(
        (res) => {

            this.totalDataCnt = res.totalCnt;
            this.totalPage = res.totalPage;
            
            this.lowerProcess = res.lowerProcess;

        },
        (error: HttpErrorResponse) => {
        }
    );
  }

  pageChange(selectedPage){
    this.formData.page = selectedPage;
    this.formData.perPage = this.pageDataSize;
    
    this.getLowerList();
  }

  setDetail(modalId, lowerProcess){
    this.lowerProcessDetail = lowerProcess;
    this.modalService.open(modalId, { windowClass: 'xlModal', centered: true});
  }
  
  /**
   * 수정된 후 처리
   * @param event 
   */
  reload(){
      this.formData.page = this.page;
      this.formData.perPage = this.pageDataSize;
      
      this.getLowerList();
  }

  /**
   * 하위업무 추가 페이지 이동
   */
  goAddPage() {
    this.router.navigate(["/svcd/4250"]);
  }
}
