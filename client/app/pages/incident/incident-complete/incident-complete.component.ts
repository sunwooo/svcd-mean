import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { IncidentService } from '../../../services/incident.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LowerCdComponent } from '../../../shared/lower-cd/lower-cd.component';
import { ToastComponent } from '../../../shared/toast/toast.component';
import { MatDatepickerInputEvent } from '@angular/material';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload'
import { CommonApiService } from '../../../services/common-api.service';

const URL = '/api/upload-file';

@Component({
  selector: 'app-incident-complete',
  templateUrl: './incident-complete.component.html',
  styleUrls: ['./incident-complete.component.css']
})
export class IncidentCompleteComponent implements OnInit {

    @Input() incidentDetail: any;
    @Input() cValues;  //모달창 닫기용
    @Input() dValues;  //모달창 무시용
    @Output() output = new EventEmitter<boolean>(); //부모에게 이벤트 전달용

    public uploader: FileUploader = new FileUploader({ url: URL }); //file upload용 객체
    private complete_attach_file: any = []; //mongodb 저장용 첨부파일 배열

    private status_cd: string = "3"; //진행상태 미평가
    private status_nm: string = "미평가"; //진행상태명 미평가
    private formData: any = {}; //전송용 formData


    public complete_content: string = "처리되었습니다.";
    public processGubunObj: any = []; //처리구분
    public checked = true;  //체크박스 체크여부
 
    constructor(private incidentService: IncidentService,
        private commonApiService: CommonApiService,
        public toast: ToastComponent,
    ) { }

    ngOnInit() {
        this.getProcessGubun();

        /**
         * 개별 파일업로드 완료 시 db저장용 objectt배열에 저장
         */ 
        this.uploader.onCompleteItem = (item: any, res: any, status: any, headers: any) => {

            //console.log('=======================================uploader.onCompleteItem=======================================');
            //console.log("res ", res);
            //console.log('=================================================================================================');

            this.complete_attach_file.push(JSON.parse(res)); 
        }

        /**
         * 첨부파일 전체 업로드 완료 시 db저장용 object배열을 fromData에 저장
         */
        this.uploader.onCompleteAll = () => {

            //console.log('=======================================uploader.onCompleteAll=======================================');
            //console.log("this.formData ", this.formData);
            //console.log('=================================================================================================');

            this.formData.incident.complete_attach_file = this.complete_attach_file;
            this.setComplete();

        }        

    }

    /**
     * 미평가
     */
    setComplete() {

        console.log("this.formData : ", this.formData);

        this.incidentService.setComplete(this.formData).subscribe(
            (res) => {
                //업데이트가 성공하면 진행 상태값 변경
                if (res.success) {
                    //this.incidentDetail.status_cd = this.status_cd;
                    //this.incidentDetail.status_nm = this.status_nm;
                    this.output.emit(true);
                }
            },
            (error: HttpErrorResponse) => {
                console.log('error : ');
            },
            () => {
                this.cValues('Close click');
            }
        );

    }

    /**
     * formData 조합
     * @param form 
     */
    complete(form: NgForm) {

        form.value.incident.id = this.incidentDetail._id;

        //Template form을 전송용 formData에 저장 
        this.formData = form.value;

        if (this.uploader.queue.length > 0) {
            this.uploader.uploadAll(); //uploader 완료(this.uploader.onCompleteAll) 후 incident저장
        } else {
            this.setComplete();
        }

    }


    /**
     * 처리구분 조회
     */
    getProcessGubun() {
        this.formData.higher_cd = this.incidentDetail.higher_cd;
        this.commonApiService.getProcessGubun(this.formData).subscribe(
            (res) => {
                this.processGubunObj = res;
            },
            (error: HttpErrorResponse) => {
                console.log('error : ');
            }
        );
    }

    /**
     * 모달 닫기
    */
    closeModal($event) {
        this.cValues('Close click');
    }
    
}
