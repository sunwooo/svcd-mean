import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { ToastComponent } from '../../../shared/toast/toast.component';
import { CompanyService } from '../../../services/company.service';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS, MatDatepickerInputEvent } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';

@Component({
  selector: 'app-company-new',
  templateUrl: './company-new.component.html',
  styleUrls: ['./company-new.component.css'],
  providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'ko-KR' },
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    ]
})
export class CompanyNewComponent implements OnInit {
  public isLoading = true;
  private formData: any = {}; //전송용 formData

  public group_flag: string = "";
  public contract_gubun: string = "";              
  public company_cd: string = "";              
  public company_nm: string = "";  
  public type: string = "";  
  public ceo_nm: string = ""; 
  public tel_no: string = ""; 
  public fax_no: string = ""; 
  public addr: string = ""; 
  public addr2: string = ""; 
  public bigo: string = "";
  public date_from: string = "";
  public date_to: string = "";

  public today = new Date();
  public minDate = new Date(2015, 0, 1);
  public maxDate = new Date(2030, 0, 1);


  public groupFlagObj: { name: string; value: string; }[] = [
        { name: '외부고객사', value: 'out' },
        { name: '그룹사', value: 'in' }
    ];
  
  public contractGubunObj: { name: string; value: string; }[] = [
        { name: '하자보수', value: '하자보수' },
        { name: '패키지유지보수', value: '패키지유지보수' },
        { name: '운영유지보수', value: '운영유지보수' },
        { name: '연말정산', value: '연말정산' }
    ];



  constructor(private router: Router
              ,private companyService: CompanyService
              ,private toast: ToastComponent
              ) { }

  ngOnInit() {
  }

  goList(){
      this.router.navigate(['/svcd/4300']);
  }

  /**
   * formData 조합
   * @param form 
   */
  saveCompany(form: NgForm) {
      console.log("saveCompany() call....!!!");

     
      //Template form을 전송용 formData에 저장 
      form.value.company.contract_gubun = this.contract_gubun;
      form.value.company.group_flag    = this.group_flag;
      form.value.company.company_cd    = this.company_cd;
      form.value.company.company_nm    = this.company_nm;
      form.value.company.type          = this.type;
      form.value.company.ceo_nm        = this.ceo_nm;
      form.value.company.tel_no        = this.tel_no;
      form.value.company.fax_no        = this.fax_no;
      form.value.company.addr          = this.addr;
      form.value.company.addr2         = this.addr2;
      form.value.company.bigo          = this.bigo;
      form.value.company.date_from     = this.date_from;
      
      form.value.company.date_to       = this.date_to;
    
    
      this.formData = form.value;
      console.log("this.formData >>>>>>>>>>>>>" , this.formData);

      console.log("saveCompany  this.formData : ", this.formData);
          
      this.addCompany();
  }

  /**
   * mongodb 저장용 서비스 호출
   */
  addCompany() {
    this.companyService.addCompany(this.formData).subscribe(
        (res) => {

            if(res.success){
                //리스트와 공유된 oftenqnaDetail 수정
                //this.qnaDetail.title   = this.formData.title;
                //this.qnaDetail.content   = this.formData.content;
                console.log("addCompany() res : ", res);


                this.toast.open('등록되었습니다.', 'success');
                this.router.navigate(['/svcd/4300']);
            }
        },
        (error: HttpErrorResponse) => {
            this.toast.open('오류입니다. ' + error.message, 'danger');
        }
    );
  }

  /**
     * Datepicker 이벤트 발생 시
     * @param type
     * @param event 
     */
    addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
        //this.events.push(`${type}: ${event.value}`);
        console.log("========== addEvent ============");
        console.log("type : ", type, "event : ", event.value);
        console.log("================================");
    }


}

