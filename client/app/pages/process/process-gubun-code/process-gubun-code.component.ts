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
    public processGubunCodeDetail: any;                 //선택 상위업무 id
  
    public processGubunCode: any = [];                     //조회 processGubunCode
     
    public searchType: string = "process_nm";            //검색구분
    public searchText: string = "";                    //검색어
  
    private formData: any = {};                        //전송용 formData
  
    public searchTypeObj: { name: string; value: string; }[] = [
          { name: '처리구분코드명', value: 'process_nm' }
    ];  
  
    constructor(private processGubunCodeService: ProcessGubunCodeService
               ,private modalService: NgbModal
               ,private router: Router) { }
    
    public maxSize: number = 10;      // 한 화면에 나타낼 페이지 수
    public page: number = 0;          // 현재 페이지
    public totalDataCnt: number = 0;   
    public pageDataSize:number =15;     
    public totalPage:number =0;
  
    ngOnInit() {
      this.isLoading = false;
      this.getProcessGubunCodeList();
    }
  
    onSubmit(){
     
      this.formData.searchType = this.searchType;
      this.formData.searchText = this.searchText;
  
      this.getProcessGubunCodeList() ;
    }
  
    /**
    * 처리구분코드 조회
    */
    getProcessGubunCodeList() {
      this.processGubunCodeService.getProcessGubunCodeList(this.formData).subscribe(
          (res) => {
  
              this.totalDataCnt = res.totalCnt;
              this.totalPage = res.totalPage;
              
              this.processGubunCode = res.processGubunCode;
  
          },
          (error: HttpErrorResponse) => {
          }
      );
    }
  
    pageChange(selectedPage){
      this.formData.page = selectedPage;
      this.formData.perPage = this.pageDataSize;
      
      this.getProcessGubunCodeList();
    }
  
    setDetail(modalId, processGubunCode){
      this.processGubunCodeDetail = processGubunCode;
      this.modalService.open(modalId, { windowClass: 'xlModal', centered: true});
    }
    
    /**
     * 수정된 후 처리
     * @param event 
     */
    reload(){
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
  