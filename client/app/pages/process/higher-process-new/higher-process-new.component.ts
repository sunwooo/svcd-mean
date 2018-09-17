import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { ToastComponent } from '../../../shared/toast/toast.component';
import { HigherProcessService } from '../../../services/higher-process.service';

@Component({
  selector: 'app-higher-process-new',
  templateUrl: './higher-process-new.component.html',
  styleUrls: ['./higher-process-new.component.css']
})
export class HigherProcessNewComponent implements OnInit {
  public isLoading = true;
  private formData: any = {}; //전송용 formData
  
  public higher_cd: string = "";              
  public higher_nm: string = "";  
  public description: string = "";  
  public use_yn: string = ""; 


  public use_ynObj: { name: string; value: string; }[] = [
    { name: '사용', value: '사용' },
    { name: '미사용', value: '미사용' }
  ];

  constructor(private router: Router
            ,private higherProcessService: HigherProcessService
            ,private toast: ToastComponent) { }

  ngOnInit() {
  }


  goList(){
      this.router.navigate(['/svcd/4100']);
  }

  /**
   * formData 조합
   * @param form 
   */
  saveHigherProcess(form: NgForm) {
      //console.log("saveHigherProcess() call....!!!");

      //Template form을 전송용 formData에 저장 
      form.value.higherProcess.higher_cd    = this.higher_cd;
      form.value.higherProcess.higher_nm    = this.higher_nm;
      form.value.higherProcess.description  = this.description;
      form.value.higherProcess.use_yn       = this.use_yn;

    
      this.formData = form.value;

      console.log("saveHigherProcess  this.formData : ", this.formData);
          
      this.addHigherProcess();
  }

  /**
   * mongodb 저장용 서비스 호출
   */
  addHigherProcess() {
    this.higherProcessService.addHigherProcess(this.formData).subscribe(
        (res) => {

            if(res.success){
                //리스트와 공유된 oftenqnaDetail 수정
                //this.qnaDetail.title   = this.formData.title;
                //this.qnaDetail.content   = this.formData.content;
                console.log("addHigherProcess() res : ", res);


                this.toast.open('등록되었습니다.', 'success');
                this.router.navigate(['/svcd/4100']);
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
