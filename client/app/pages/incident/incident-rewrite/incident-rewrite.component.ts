import { Component, OnInit, Renderer, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS, MatDatepickerInputEvent } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { AuthService } from '../../../services/auth.service';
import { ToastComponent } from '../../../shared/toast/toast.component';
import { IncidentService } from '../../../services/incident.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload'
import { saveAs } from 'file-saver';
import { Router } from '@angular/router';

const URL = '/api/upload-file';

// Jquery declaration
declare var $: any;


@Component({
  selector: 'app-incident-rewrite',
  templateUrl: './incident-rewrite.component.html',
  styleUrls: ['./incident-rewrite.component.css'],
  providers: [
      { provide: MAT_DATE_LOCALE, useValue: 'ko-KR' },
      { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
      { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class IncidentRewriteComponent implements OnInit {

    @Input() incidentDetail: any; //조회 incident
    @Input() cValues;  //모달창 닫기용
    @Input() dValues;  //모달창 무시용
    @Output() outReload = new EventEmitter<any>(); //부모에게 이벤트 전달용
   
    private formData: any = {}; //전송용 formData
    private attach_file: any = []; //mongodb 저장용 첨부파일 배열
    private dateChange = false; //완료요청일이 변경되었는지 여부

    public uploader: FileUploader = new FileUploader({ url: URL }); //file upload용 객체
    public processSpeed: { name: string; value: string; }[] = [
        { name: '보통', value: 'N' },
        { name: '긴급', value: 'Y' }
    ];  
    public today = new Date();
    public minDate = new Date(2015, 0, 1);
    public maxDate = new Date(2030, 0, 1);
    public events: string[] = [];
    //public serializedDate = new FormControl((new Date()).toISOString());

    constructor(private auth: AuthService,
        public toast: ToastComponent,
        private incidentService: IncidentService,
        private router: Router) {
    }

    ngOnInit() {
     
        //$('#summernote').summernote();
        $('#summernote').summernote({
            height: 350, // set editor height;
            minHeight: null, // set minimum height of editor
            maxHeight: null, // set maximum height of editor
            focus: false // set focus to editable area after initializing summernote
            , toolbar: [
                ['edit', ['undo', 'redo']],
                ['headline', ['style']],
                ['style', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'strikethrough', 'clear']],
                ['fontface', ['fontname']],
                ['textsize', ['fontsize']],
                ['fontclr', ['color']],
                ['alignment', ['ul', 'ol', 'paragraph', 'lineheight']],
                ['height', ['height']],
                ['table', ['table']],
                ['view', ['fullscreen', 'codeview']]
            ]
            ,popover: {
                image: [],
                link: [],
                air: []
                }
        });

        this.incidentDetail.title = "[재요청] "+this.incidentDetail.title;

        $('#summernote').summernote('code', this.incidentDetail.content);

        /**
         * 개별 파일업로드 완료 시 db저장용 object배열에 저장
         */ 
        this.uploader.onCompleteItem = (item: any, res: any, status: any, headers: any) => {

            //console.log('=======================================uploader.onCompleteItem=======================================');
            //console.log("res ", res);
            //console.log('=================================================================================================');

            this.attach_file.push(JSON.parse(res)); 
        }

        /**
         * 첨부파일 전체 업로드 완료 시 db저장용 object배열을 fromData에 저장
         */
        this.uploader.onCompleteAll = () => {

            //console.log('=======================================uploader.onCompleteAll=======================================');
            //console.log("this.formData ", this.formData);
            //console.log('=================================================================================================');

            this.formData.incident.attach_file = this.attach_file;
            this.addIncident();

        }
    }

    /**
     * formData 조합
     * @param form 
     */
    saveIncident(form: NgForm) {

        //summernote 내용처리
        var text = $('#summernote').summernote('code');
        var ctext = text.replace(/<img src=/gi,'<img class="summernote-img" src=');
        form.value.incident.content = ctext;

        //Template form을 전송용 formData에 저장 
        this.formData = form.value;
        this.formData.incident.higher_cd = this.incidentDetail.higher_cd;
        this.formData.incident.lower_cd = this.incidentDetail.lower_cd;
        this.formData.incident.lower_nm = this.incidentDetail.lower_nm;
        
        //console.log('============= saveIncident 1 ===============');
        //console.log("this.formData : ", this.formData);
        //console.log('==========================================');

        if(this.dateChange){
            var tmpDate = new Date(this.formData.incident.request_complete_date);
            tmpDate.setDate(tmpDate.getDate() + 1);
            this.formData.incident.request_complete_date = tmpDate;
        }

        //form.onReset();

        //console.log('============= saveIncident 2===============');
        //console.log("this.uploader : ", this.uploader);
        //console.log('==========================================');

        if (this.uploader.queue.length > 0) {
            this.uploader.uploadAll(); //uploader 완료(this.uploader.onCompleteAll) 후 incident저장
        } else {
            this.addIncident();
        }

    }

    /**
     * mongodb 저장용 서비스 호출
     */
    addIncident() {
        this.incidentService.addIncident(this.formData).subscribe(
            (res) => {

                //console.log('============= incidentService.addIncident(this.formData).subscribe ===============');
                //console.log(res);
                //console.log('===================================================================================');

                this.toast.open('등록되었습니다.', 'success');
                this.outReload.emit();
                this.cValues('Close click');

            },
            (error: HttpErrorResponse) => {
                //if (error.status == 400) {
                //    this.toast.open('동일한 Email이 존재합니다.', 'danger');
                //}else if (error.status == 400) {
                //    this.toast.open('승인중인 계정입니다.', 'danger');
                //} else {
                this.toast.open('오류입니다. ' + error.message, 'danger');
                //}
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
        //console.log("========== addEvent ============");
        //console.log("type : ", type, "event : ", event.value);
        //console.log("================================");

        this.dateChange = true;

    }
    
    /**
     * 파일 다운로드
     * @param path 
     * @param filename 
     */
    fileDownLoad(path, filename) {
        this.incidentService.fileDownLoad(path).subscribe(
            (res) => {
                saveAs(res, filename);
            },
            (error: HttpErrorResponse) => {
                console.log(error);
            }
        );
    }

    /**
     * 모달 닫기
    */
    closeModal($event) {
        this.cValues('Close click');
    }

    /*
    onAreaListControlChanged(list) {
    }

    onNgModelChange(event) {
    }

    ngAfterViewInit(){
    }
    */

}