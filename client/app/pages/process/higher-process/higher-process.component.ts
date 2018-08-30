import { Component, OnInit } from '@angular/core';
import { HigherProcessService } from '../../../services/higherProcess.service';
import { HttpErrorResponse } from "@angular/common/http";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-higher-process',
  templateUrl: './higher-process.component.html',
  styleUrls: ['./higher-process.component.css']
})
export class HigherProcessComponent implements OnInit {

  public isLoading = true;
  public higherProcessDetail: any;                  //선택 상위업무 id

  public higherProcess: any = [];                   //조회 higherProcess
   
  public searchType: string = "higher_nm";          //검색구분
  public searchText: string = "";                   //검색어

  private formData: any = {};                       //전송용 formData

  public searchTypeObj: { name: string; value: string; }[] = [
        { name: '상위업무명', value: 'higher_nm' }
  ];  

  constructor(private higherProcessService: HigherProcessService
  ,private modalService: NgbModal) 
  { }

  public maxSize: number = 10;      // 한 화면에 나타낼 페이지 수
  public page: number = 0;          // 현재 페이지
  public totalDataCnt: number = 0;   
  public pageDataSize:number =15;     
  public totalPage:number =0;

  ngOnInit() {
    this.isLoading = false;
    this.getHigherList();
  }

  onSubmit(){
   
    this.formData.searchType = this.searchType;
    this.formData.searchText = this.searchText;

    //console.log("================================");
    //console.log(this.searchType);
    //console.log(this.searchText);
    //console.log("================================");

    this.getHigherList() ;
}
  
  /**
  * HigherProcess 조회
  */
  getHigherList() {
    this.higherProcessService.getHigherProcessList(this.formData).subscribe(
        (res) => {

            this.totalDataCnt = res.totalCnt;
            this.totalPage = res.totalPage;
            
            this.higherProcess = res.higherProcess;

        },
        (error: HttpErrorResponse) => {
        }
    );
  }

  pageChange(selectedPage){
    this.formData.page = selectedPage;
    this.formData.perPage = this.pageDataSize;
    
    this.getHigherList();
  }

  setDetail(modalId, higherProcess){
    this.higherProcessDetail = higherProcess;
    this.modalService.open(modalId, { windowClass: 'xlModal', centered: true});
  }
  
  /**
   * 수정된 후 처리
   * @param event 
   */
  reload(){
      this.formData.page = this.page;
      this.formData.perPage = this.pageDataSize;
      
      this.getHigherList();
  }
}
