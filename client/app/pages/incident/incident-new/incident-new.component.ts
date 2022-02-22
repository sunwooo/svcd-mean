import { Component, OnInit, Renderer, EventEmitter } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS, MatDatepickerInputEvent } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { AuthService } from '../../../services/auth.service';
import { ToastComponent } from '../../../shared/toast/toast.component';
import { IncidentService } from '../../../services/incident.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload'
import { Router } from '@angular/router';

const URL = '/api/upload-file';

// Jquery declaration
declare var $: any;

@Component({
    selector: 'app-incident-new',
    templateUrl: './incident-new.component.html',
    styleUrls: ['./incident-new.component.scss'],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'ko-KR' },
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    ],
})
export class IncidentNewComponent implements OnInit {

    public higher: any = {};    
    public initPrcSpd: string = "N";
    public request_info: string = this.auth.employee_nm;
    public real_contact: string = this.auth.hp_telno;
    public request_company: string = this.auth.company_cd;
    
    private formData: any = {}; //전송용 formData
    private attach_file: any = []; //mongodb 저장용 첨부파일 배열
    private dateChange = false; //완료요청일이 변경되었는지 여부

    //2022-02-22 psw 추가
    //public new_content: string = "아래의 형식에 맞추어 작성해주시기 바랍니다.";
    public new_content: string = "<table style='border: 1px rgb(0, 0, 0); border-image: none; width: 813px; height: 428.1px; border-collapse: collapse; -ms-word-break: break-all;' border='1' cellspacing='0' cellpadding='0'><tbody><tr><td style='border-width: 0px 0px 1px; border-style: solid; border-color: rgb(0, 0, 0); border-image: none; width: 811px; height: 30px; background-repeat: no-repeat; background-color: rgb(255, 255, 255);' colspan='2'><p><span style='font-size: 13pt;'><strong>&nbsp;<span style='color: rgb(255, 0, 0);'><u>※ 아래의 형식에 맞추어 작성해 주시기 바랍니다. </u></strong></span></p></td></tr><tr><td style='border: 1px solid rgb(0, 0, 0); border-image: none; width: 163px; height: 79.55px; background-color: rgb(255, 245, 153);'><p style='text-align: center;'><strong style='font-size: 12pt;'>화면 경로<br></strong></p></td><td style='border: 1px solid rgb(0, 0, 0); border-image: none; width: 648px; height: 79.55px;'><p><span style='font-size: 12pt;'>&nbsp;관련 화면 경로 작성 </span></p><p><span style='font-size: 12pt;'>&nbsp;(예시) 회계&gt;전표통제&gt;귀속부서관리&gt;사용자 추가</span></p><p><span style='font-size: 12pt;'>​</span><br></p></td></tr><tr><td style='border: 1px solid rgb(0, 0, 0); border-image: none; width: 163px; height: 75px; background-color: rgb(255, 245, 153);'><p style='text-align: center;'><strong style='font-size: 12pt;'>요청&nbsp;사항</strong></p></td><td style='border: 1px solid rgb(0, 0, 0); border-image: none; width: 648px; height: 75px;'><p><span style='font-size: 12pt;'>&nbsp;요청사항을 상세히 작성 요망<br></span></p></td></tr><tr><td style='border: 1px solid rgb(0, 0, 0); border-image: none; width: 163px; height: 93px; background-color: rgb(255, 245, 153);'><p style='text-align: center;'><strong style='font-size: 12pt;'>문제점<br></strong></p></td><td style='border: 1px solid rgb(0, 0, 0); border-image: none; width: 648px; height: 93px;'><p><span style='font-size: 12pt;'>&nbsp;현재 발생하고 있는 문제의 상황을 상세히&nbsp;작성 요망</span><br></p></td></tr><tr><td style='border: 1px solid rgb(0, 0, 0); border-image: none; width: 163px; height: 76px; background-color: rgb(255, 245, 153);'><p style='text-align: center;'><strong style='font-size: 12pt;'>예상 결과<br></strong></p></td><td style='border: 1px solid rgb(0, 0, 0); border-image: none; width: 648px; height: 76px;'><p><span style='font-size: 12pt;'>&nbsp;예상하는 결과 작성 <br></span></p></td></tr><tr><td style='border: 1px solid rgb(0, 0, 0); border-image: none; width: 163px; height: 25px; background-color: rgb(255, 245, 153);'><p style='text-align: center;'><strong style='font-size: 12pt;'>기타 사항<br></strong></p></td><td style='border: 1px solid rgb(0, 0, 0); border-image: none; width: 648px; height: 25px;'><p><span style='font-size: 12pt;'><br></span><br></p></td></tr><tr><td style='border: 1px solid rgb(0, 0, 0); border-image: none; width: 163px; height: 51px; background-color: rgb(255, 245, 153);'><p style='text-align: center;'><strong style='font-size: 12pt;'>요청자&nbsp;정보<br></strong></p></td><td style='border: 1px solid rgb(0, 0, 0); border-image: none; width: 648px; height: 51px;'><p><span style='font-size: 12pt;'>&nbsp;(예시) 휴대폰 : 010-123-4567 / 이메일 : <a style='color: rgb(0, 0, 0);' href='mailto:test@isu.co.kr'>test@isu.co.kr</a> &nbsp;<br></span></p></td></tr></tbody></table><p><span style='font-size: 9pt;'>​</span></p>";
    //추가 끝
    public uploader: FileUploader = new FileUploader({ url: URL }); //file upload용 객체
    public processSpeed: { name: string; value: string; }[] = [
        { name: '보통', value: 'N' },
        { name: '긴급', value: 'Y' }
    ];  
    public today = new Date();
    public minDate = new Date(2015, 0, 1);
    public maxDate = new Date(2030, 0, 1);
    public events: string[] = [];
    public request_complete_date;
    //public serializedDate = new FormControl((new Date()).toISOString());

    constructor(private auth: AuthService,
        public toast: ToastComponent,
        private incidentService: IncidentService,
        private router: Router) {
    }

    ngOnInit() {

        this.today.setDate(this.today.getDate() + 3);
        this.request_complete_date = new FormControl(this.today);
      
        //$('#summernote').summernote();
        $('#summernote').summernote({
            height: 350,     // set editor height;
            minHeight: null, // set minimum height of editor
            maxHeight: null, // set maximum height of editor
            focus: false,    // set focus to editable area after initializing summernote
            lang : 'ko-KR'   //default: 'en-US'
            /*
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
*/
            /*
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

        if(!this.higher.higher_cd){
            this.toast.open('요청업무를 선택하세요. ', 'danger');
            return;
        }

        //summernote 내용처리
        //var text = $('#summernote').summernote('code');
        //form.value.incident.content = text;
        
        //summernote 내용처리
        var text = $('#summernote').summernote('code');
        var ctext = text.replace(/<img src=/gi,'<img class="summernote-img" src=');
        form.value.incident.content = ctext;

        form.value.incident.higher_cd = this.higher.higher_cd;
        form.value.incident.higher_nm = this.higher.higher_nm;

        //Template form을 전송용 formData에 저장 
        this.formData = form.value;

        if(this.dateChange){
            var tmpDate = new Date(this.formData.incident.request_complete_date);
            tmpDate.setDate(tmpDate.getDate() + 1);
            this.formData.incident.request_complete_date = tmpDate;
        }

        //form.onReset();

        //console.log('============= saveIncident ===============');
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
                this.router.navigate(['/svcd/1200']);
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
     * 업무요청 선택 시
     * @param higher 
     */
    onSelected(higher) {
        //console.log('higherCd : ', higher);
        //this.higherCd = higherCd;

        //////////////////////////////////
        this.higher = higher;
        //////////////////////////////////  

        //2022-02-22 psw 추가
        //상위업무 건설ERP 항목일 경우 
        //this.toast.open('상위업무 : '+ JSON.stringify(higher.higher_cd), 'success');
        //x.match(y) === null
        if(JSON.stringify(higher.higher_cd).match("H006")===null){
            //this.toast.open('상위업무 : '+ JSON.stringify(higher.higher_cd), 'success');
            $('#summernote').summernote('code', "");
        }else{
            $('#summernote').summernote('code', this.new_content); 
        }
        //추가 끝
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
    
    /*
    onAreaListControlChanged(list) {
    }

    onNgModelChange(event) {
    }

    ngAfterViewInit(){
    }
    */
}