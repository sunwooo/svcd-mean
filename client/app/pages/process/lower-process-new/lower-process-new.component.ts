import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { ToastComponent } from '../../../shared/toast/toast.component';
import { LowerProcessService } from '../../../services/lower-process.service';
import { CommonApiService } from '../../../services/common-api.service';


@Component({
  selector: 'app-lower-process-new',
  templateUrl: './lower-process-new.component.html',
  styleUrls: ['./lower-process-new.component.css']
})
export class LowerProcessNewComponent implements OnInit {
  public isLoading = true;
  private formData: any = {}; //전송용 formData
  
  public higher_nm: string = ""; 
  public lower_cd: string = "";              
  public lower_nm: string = "";  
  public description: string = "";  
  public need_hour: string = "";  
  public use_yn: string = ""; 

  public higherObj: any = [];                  //상위업무리스트
  public higher_cd: string = "*";              //상위업무코드

  public use_ynObj: { name: string; value: string; }[] = [
    { name: '사용', value: '사용' },
    { name: '미사용', value: '미사용' }
  ];

  constructor(private router: Router
            ,private lowerProcessService: LowerProcessService
            ,private toast: ToastComponent
            , private commonApi: CommonApiService) { }

  ngOnInit() {
    this.isLoading = false;
    this.getHigherProcess();
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
  setHigherCd(idx) {
      this.higher_cd = this.higherObj[idx].higher_cd;
      this.higher_nm = this.higherObj[idx].higher_nm;
      console.log("aaa this.higher_nm  : ", this.higher_nm );
  }

  goList(){
      this.router.navigate(['/svcd/4200']);
  }

  /**
   * formData 조합
   * @param form 
   */
  saveLowerProcess(form: NgForm) {
      //console.log("saveHigherProcess() call....!!!");

      //Template form을 전송용 formData에 저장 
      form.value.lowerProcess.higher_cd    = this.higher_cd;
      form.value.lowerProcess.higher_nm    = this.higher_nm;
      form.value.lowerProcess.lower_cd     = this.lower_cd;
      form.value.lowerProcess.lower_nm     = this.lower_nm;
      form.value.lowerProcess.need_hour    = this.need_hour;
      form.value.lowerProcess.description  = this.description;
      form.value.lowerProcess.use_yn       = this.use_yn;

    
      this.formData = form.value;

      console.log("saveLowerProcess  this.formData : ", this.formData);
          
      this.addLowerProcess();
  }

  /**
   * mongodb 저장용 서비스 호출
   */
  addLowerProcess() {
    this.lowerProcessService.addLowerProcess(this.formData).subscribe(
        (res) => {

            if(res.success){
                //리스트와 공유된 oftenqnaDetail 수정
                //this.qnaDetail.title   = this.formData.title;
                //this.qnaDetail.content   = this.formData.content;
                console.log("addLowerProcess() res : ", res);


                this.toast.open('등록되었습니다.', 'success');
                this.router.navigate(['/svcd/4200']);
            }else{
                this.toast.open('오류입니다. 관리자에게 문의하세요', 'fail');
            }
        },
        (error: HttpErrorResponse) => {
            this.toast.open('오류입니다. ' + error.message, 'danger');
        }
    );
  }

}
