import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../../services/company.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css']
})
export class CompanyListComponent implements OnInit {

  public isLoading = true;

  public companyDetail: any;                   //선택 인시던트 id

  public company: any = [];                   //조회 company

  public searchType: string = "company_nm";  //검색구분
  public searchText: string = "";              //검색어

  private formData: any = {};               //전송용 formData

  public searchTypeObj: { name: string; value: string; }[] = [
        { name: '회사명', value: 'company_nm' }
  ];  

  constructor(private companyService: CompanyService
              ,private modalService: NgbModal) { }

  public maxSize: number = 10;      // 한 화면에 나타낼 페이지 수
  public page: number = 0;          // 현재 페이지
  public totalDataCnt: number = 0;   
  public pageDataSize:number =15;     

  ngOnInit() {

    this.isLoading = false;
    this.getCompany();
    
  }

  onSubmit(){
        
    //1페이지로 초기화
    //this.page = 1;
    //this.incidents = [];

    //this.formData.status_cd = this.status_cd;
    //if(this.reg_date_from != null)
    //    this.formData.reg_date_from = this.reg_date_from.format('YYYY-MM-DD');
    //if(this.reg_date_to != null)
    //    this.formData.reg_date_to = this.reg_date_to.format('YYYY-MM-DD');
    //this.formData.searchType = this.searchType;

    //this.formData.searchText = this.searchText;
    this.formData.searchType = this.searchType;
    this.formData.searchText = this.searchText;

    console.log("================================");
    console.log(this.searchType);
    console.log(this.searchText);
    console.log("================================");

    this.getCompany() ;
}

  /**
     * Company 조회
  */
  getCompany() {
      
    //this.formData.page = this.page++;
    //this.formData.perPage = this.perPage;

    this.companyService.getCompanyList(this.formData).subscribe(
        (res) => {

            //var tmp = this.incidents.concat(res.incident);
            //this.incidents = tmp;
            this.totalDataCnt = res.totalCnt;

            //if(res.incident.length == 0){
            //    this.toast.open('더 이상 조회데이타가 없습니다..', 'success');
            //}
            console.log("this.formData : ", this.formData);
            this.company = res.company;
            console.log("res : ", res);

        },
        (error: HttpErrorResponse) => {
        }
    );
  
  }

  pageChange(selectedPage){
    console.log("pageChange!!",selectedPage);
    this.formData.page = selectedPage;
    this.formData.perPage = this.pageDataSize;
    
    this.getCompany();
    
  }

  setDetail(modalId, company){
    this.companyDetail = company;
    this.modalService.open(modalId, { windowClass: 'xlModal', centered: true});
  }
  
  /**
   * 수정된 후 처리
   * @param event 
   */
  reload(){
      this.formData.page = this.page;
      this.formData.perPage = this.pageDataSize;
      
      this.getCompany();
  }


}
