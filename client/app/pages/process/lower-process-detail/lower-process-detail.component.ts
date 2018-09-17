import { Component, OnInit } from '@angular/core';
import { Input, Output } from "@angular/core";
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS, MatDatepickerInputEvent } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { NgForm } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { LowerProcessService } from '../../../services/lower-process.service';
import { EventEmitter } from "@angular/core";
import { ToastComponent } from '../../../shared/toast/toast.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lower-process-detail',
  templateUrl: './lower-process-detail.component.html',
  styleUrls: ['./lower-process-detail.component.css']
})
export class LowerProcessDetailComponent implements OnInit {
  @Input() lowerProcessDetail: any; //조회 company

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
  constructor(private lowerProcessService: LowerProcessService
                 ,public toast: ToastComponent
                ,private router: Router) { }

  ngOnInit() {
  }

  /**
     * 하위업무 수정
     * @param form 
    */
    
    updateLowerProcess(form: NgForm) {

        //Template form을 전송용 formData에 저장 
        this.formData = form.value;
        this.formData.lowerProcess._id = this.lowerProcessDetail._id;

       
        console.log('=======================================save(form : NgForm)=======================================');
        console.log("form.value",form.value);
        console.log("form",form);
        console.log('=================================================================================================');

        this.lowerProcessService.putLowerProcess(this.formData).subscribe(
            
            (res) => {
                console.log("res>>>", res);
                
                if (res.success) {
                    //리스트와 공유된 lowerProcessDetail 수정
                    //this.lowerProcessDetail.higher_cd   = this.formData.lowerProcess.higher_cd;
                    this.lowerProcessDetail.higher_nm   = this.formData.lowerProcess.higher_nm;
                    this.lowerProcessDetail.lower_cd   = this.formData.lowerProcess.lower_cd;
                    this.lowerProcessDetail.lower_nm   = this.formData.lowerProcess.lower_nm;
                    this.lowerProcessDetail.description = this.formData.lowerProcess.description;
                    this.lowerProcessDetail.use_yn      = this.formData.lowerProcess.use_yn;
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
     * @param lowerProcessId
     */
    deleteLowerProcess(lowerProcessId) {
        console.log("deleteLowerProcess lowerProcessId :", lowerProcessId);

        this.lowerProcessService.delete(lowerProcessId).subscribe(
            
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
