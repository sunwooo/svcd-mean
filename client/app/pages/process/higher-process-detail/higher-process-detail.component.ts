import { Component, OnInit } from '@angular/core';
import { Input, Output } from "@angular/core";
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS, MatDatepickerInputEvent } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { NgForm } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { HigherProcessService } from '../../../services/higher-process.service';
import { EventEmitter } from "@angular/core";
import { ToastComponent } from '../../../shared/toast/toast.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-higher-process-detail',
  templateUrl: './higher-process-detail.component.html',
  styleUrls: ['./higher-process-detail.component.css'],
  providers: [
      { provide: MAT_DATE_LOCALE, useValue: 'ko-KR' },
      { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
      { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})

export class HigherProcessDetailComponent implements OnInit {
  @Input() higherProcessDetail: any; //조회 company

  @Input() cValues;  //모달창 닫기용
  @Input() dValues;  //모달창 무시용
  @Output() openerReload = new EventEmitter<any>(); //삭제 후 다시 조회를 위한 이벤트
  @Output() afterDelete = new EventEmitter<any>(); //삭제 후 다시 조회를 위한 이벤트
  
  private formData: any = {};    //전송용 formData

  public today = new Date();
  public minDate = new Date(2015, 0, 1);
  public maxDate = new Date(2030, 0, 1);
  public events: string[] = [];
  
  public use_ynObj: { name: string; value: string; }[] = [
    { name: '사용', value: '사용' },
    { name: '미사용', value: '미사용' }
  ];
  

  constructor(private higherProcessService: HigherProcessService
                 ,public toast: ToastComponent
                ,private router: Router) { }

  ngOnInit() {
  }

    
    /**
     * 상위업무 수정
     * @param form 
    */
    
    updateHigherProcess(form: NgForm) {

        //Template form을 전송용 formData에 저장 
        this.formData = form.value;
        this.formData.higherProcess._id = this.higherProcessDetail._id;

       
        console.log('=======================================save(form : NgForm)=======================================');
        console.log("form.value",form.value);
        console.log("form",form);
        console.log('=================================================================================================');

        this.higherProcessService.putHigherProcess(this.formData).subscribe(
            
            (res) => {
                console.log("res>>>", res);
                
                if (res.success) {
                    //리스트와 공유된 oftenqnaDetail 수정
                    this.higherProcessDetail.higher_nm   = this.formData.higherProcess.higher_nm;
                    this.higherProcessDetail.higher_cd   = this.formData.higherProcess.higher_cd;
                    this.higherProcessDetail.description = this.formData.higherProcess.description;
                    this.higherProcessDetail.use_yn      = this.formData.higherProcess.use_yn;
                    //모달창 닫기
                    this.cValues('Close click');
                }
            },
            (error: HttpErrorResponse) => {
                this.toast.open('오류입니다. ' + error.message, 'danger');
            }
        );
    }

    /**
     * 상위업무 삭제
     * @param higherProcessId
     */
    deleteHigherProcess(higherProcessId) {
        console.log("deleteHigherProcess higherProcessId :", higherProcessId);

        this.higherProcessService.delete(higherProcessId).subscribe(
            
            (res) => {
                if (res.success) {
                    this.toast.open('삭제되었습니다.', 'success');
                    this.router.navigate(['/svcd/4100']);
                    this.openerReload.emit();
                }

            },
            (error: HttpErrorResponse) => {
                console.log(error);
            },
            () => {
                this.cValues('Close click');
            }
        );
    }


    /**
     * 달력 이벤트 처리
     * @param type
     * @param event 
     */
    addEvent(type: string, event: MatDatepickerInputEvent<Date>) {

        console.log("================================");
        console.log("type: ", type);
        console.log("event: ", event);

        console.log("================================");

        //this.onSubmit();

    }

    /**
     * 모달 닫기
    */
    closeModal($event) {
        this.cValues('Close click');
    }

}
