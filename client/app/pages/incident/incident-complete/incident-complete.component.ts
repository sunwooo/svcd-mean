import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { IncidentService } from '../../../services/incident.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LowerCdComponent } from '../../../shared/lower-cd/lower-cd.component';
import { ToastComponent } from '../../../shared/toast/toast.component';
import { MatDatepickerInputEvent } from '@angular/material';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload'
import { CommonApiService } from '../../../services/common-api.service';
import { AuthService } from '../../../services/auth.service';

const URL = '/api/upload-file';

// Jquery declaration
declare var $: any;

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
    public init_work_time: number = 1; //처리시간
    public process_cd = "";
    public process_nm = "";
    public checked = true;  //체크박스 체크여부
    /* 200710_김선재 : 상위업무 HR(H008)인 경우 기본 공개여부 비공개 */
    public publicized = true; //공개여부
 
    constructor(private auth: AuthService,
        private incidentService: IncidentService,
        private commonApiService: CommonApiService,
        public toast: ToastComponent,
    ) { }

    ngOnInit() {
        this.getProcessGubun();

        /* 200710_김선재 : 상위업무 HR(H008)인 경우 기본 공개여부 비공개 */
        if(this.incidentDetail.higher_cd == 'H008'){
            this.publicized = false;
        }

        /**
         * 개별 파일업로드 완료 시 db저장용 object배열에 저장
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
        
        $('#summernote').summernote({
            height: 150,     // set editor height;
            minHeight: null, // set minimum height of editor
            maxHeight: null, // set maximum height of editor
            focus: true,    // set focus to editable area after initializing summernote
            lang : 'ko-KR'   //default: 'en-US'
           /*
            , toolbar: [
                ['edit', ['undo', 'redo']],
                ['headline', ['style']],
                ['style', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'strikethrough', 'clear']],
                ['fontface', ['fontname']],
                ['textsize', ['fontsize']],
               // ['fontclr', ['color']],
                ['alignment', ['ul', 'ol', 'paragraph', 'lineheight']],
                ['height', ['height']],
                ['table', ['table']],
                ['view', ['fullscreen', 'codeview']]
            ]
            */
            /*
            --한글...
            , toolbar: [
                ['edit', ['실행 취소', '다시 실행']],
                ['headline', ['스타일']],
                ['style', ['굵게', '기울임꼴', '밑줄', '위 첨자', '아래 첨자', '취소선', '글자 효과 없애기']],
                ['fontface', ['맑은고딕']],
                ['textsize', ['글자 크기']],
                ['fontclr', ['색상']],
                ['alignment', ['글머리 기호', '번호 매기기', '문단 정렬', '줄간격']],
                ['height', ['줄간격']],
                ['table', ['테이블']],
                ['view', ['전체 화면', '코드 보기']]
            ]
           */
            ,popover: {
                image: [],
                link: [],
                air: []
                }
        });
        $('#summernote').summernote('code', this.complete_content);
    
    }

    /**
     * 미평가
     */
    setComplete() {

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

        if(!this.process_cd){
            this.toast.open('처리구분을 선택하세요. ', 'danger');
            return;
        }

        form.value.incident.id = this.incidentDetail._id;
        form.value.incident.process_cd = this.process_cd;
        form.value.incident.process_nm = this.process_nm;

        var text = $('#summernote').summernote('code');

        //var ctext = text.replace(/<img src=/gi,'<img class="summernote-img" src=');
        form.value.incident.complete_content = text;

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
                console.log('error : ',error);
            }
        );
    }

    /**
     * 처리구분 선택
     */
    onSelect(idx){   
        this.process_cd = this.processGubunObj[idx].process_cd;
        this.process_nm = this.processGubunObj[idx].process_nm;
    }

    /**
     * 모달 닫기
    */
    closeModal($event) {
        this.cValues('Close click');
    }
    
}
