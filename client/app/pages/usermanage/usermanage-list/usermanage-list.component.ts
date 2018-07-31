import { Component, OnInit } from '@angular/core';
import { UsermanageService } from '../../../services/usermanage.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-usermanage-list',
  templateUrl: './usermanage-list.component.html',
  styleUrls: ['./usermanage-list.component.css']
})
export class UsermanageListComponent implements OnInit {

    public isLoading = true;
    public usermanage: any = [];              //조회 usermanage
    public searchText: string = "";           //검색어
    private formData: any = {};               //전송용 formData
  
    
    constructor(private usermanageService: UsermanageService) { }
  
    public maxSize: number = 10;      // 한 화면에 나타낼 페이지 수
    public page: number = 0;          // 현재 페이지
    public totalDataCnt: number = 0;   
    public pageDataSize:number =15;     
  
    ngOnInit() {
  
      this.isLoading = false;
      this.getUsermanage();
      
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
  
      this.formData.searchText = this.searchText;
  
      console.log("========================usermanage searchText start");
      console.log("this.formData   : ", this.formData);
      console.log("this.searchText : ", this.searchText);
      console.log("========================usermanage searchText end");
  
      this.getUsermanage() ;
  }
  
    /**
       * Company 조회
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
              //console.log("res : ", res);
              //console.log("this.usermanage >>>>>>>>>>>>>>>> ", this.usermanage);
  
          },
          (error: HttpErrorResponse) => {
          }
      );
    
    }

    pageChange(selectedPage){
      console.log("================================pageChange!!",selectedPage);
      this.formData.page = selectedPage;
      this.formData.perPage = this.pageDataSize;
      
      this.getUsermanage();
      
    }
  }