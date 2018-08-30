import { Component, OnInit } from '@angular/core';
import { Input, Output } from "@angular/core";
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS, MatDatepickerInputEvent } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { NgForm } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { HigherProcessService } from '../../../services/higherProcess.service';
import { EventEmitter } from "@angular/core";

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

  public today = new Date();
  public minDate = new Date(2015, 0, 1);
  public maxDate = new Date(2030, 0, 1);
  public events: string[] = [];
  
  public use_ynObj: { name: string; value: string; }[] = [
    { name: '사용', value: '사용' },
    { name: '미사용', value: '미사용' }
  ];
  

  constructor(private higherProcessService: HigherProcessService) { }

  ngOnInit() {
  }

    
    /**
     * 상위업무 수정
     * @param form 
    */
    
    updateHigherProcess(form: NgForm) {
        console.log("this.higherProcessDetail" ,this.higherProcessDetail);
        
        form.value.higherProcess.id = this.higherProcessDetail._id;

        console.log('=======================================save(form : NgForm)=======================================');
        console.log("form.value",form.value);
        console.log("form",form);
        console.log('=================================================================================================');

   

        this.higherProcessService.putHigherProcess(form).subscribe(
            res => {

                //업데이트가 성공하면 진행 상태값 변경
                console.log("res>>>",res);
                if(res.success){
                    //리스트와 공유된 higherProcessDetail 수정
                    this.higherProcessDetail.higher_nm   = form.value.higher_nm;
                    this.higherProcessDetail.higher_cd   = form.value.higher_cd;
                    this.higherProcessDetail.description = form.value.description;
                    this.higherProcessDetail.use_yn      = form.value.use_yn;

                     this.openerReload.emit();

                    //모달창 닫기
                    this.cValues('Close click');
                }
            }
            ,
            (error: HttpErrorResponse) => {

            }
        );
    }

    /**
     * 상위업무 삭제
     * @param higherProcessId
     */
    deleteHigherProcess(higherProcessId) {
        this.higherProcessService.delete(higherProcessId).subscribe(
            (res) => {
                this.afterDelete.emit();
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
