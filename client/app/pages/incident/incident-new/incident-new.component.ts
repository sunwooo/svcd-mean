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
import { ClickOutsideDirective } from 'angular2-multiselect-dropdown';


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
    //2022-06-03 PSW 추가
    public docTitle:  string ="";
    public docUrl: string = "";
    //추가끝
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
        
        //2022-06-03 psw 문서연결 제목, 링크 처리 + 초기화를 위한 처리 
        if($('input[name=doc_info]').val()){
            form.value.incident.doc_info = this.docTitle;
            form.value.incident.doc_link = this.docUrl;
        }else{
            form.value.incident.doc_info = "";
            form.value.incident.doc_link = "";
        }
        //처리끝

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
        console.log("this.docTitle : " + this.docTitle);
        console.log("this.formData : " + JSON.stringify(this.formData));
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

    //2022-06-02 PSW : GW문서연결 작업 
    docLink(){
        console.log("docLink() start");
        
        //popup open
        //1.개발
        //window.open('https://gwt.isu.co.kr/workflow/page/documentlink?pop=1&servicedesk=http%3A%2F%2Fsd.isusystem.co.kr', '_blank');
        //2.운영
        window.open('https://gw.isu.co.kr/workflow/page/documentlink?pop=1&servicedesk=http%3A%2F%2Fsd.isusystem.co.kr', '_blank');
        
        //callback - data 체크    
        if(window.addEventListener){
            //window.addEventListener('message',function(e) { debugger;},false);
            window.addEventListener("message", this.handleMessage.bind(this), false);
        }else{
            (<any>window).attachEvent("onmessage", this.handleMessage.bind(this));
        }       
    }

    handleMessage(event: Event){
        const message = event as MessageEvent;
        
        //console.log("message : " + message);
        //console.log("message.data : " + message.data); //object
        //JSON Data
        /*
            [{"apmId":1960766,"connectApmId":null,"applicationId":83,"applicationName":"기안용지","applicationNameEn":"A drafting paper","versionId":83,"subject":"기안자 전결 테스트","reqPersonCode":"ISU_ST12001","reqName":"박선우","reqNameEn":"Park Sun-woo","reqTitleName":"과장","reqTitleNameEn":"Manager","reqDeptName":"전략사업팀","reqDeptNameEn":"Strategy Business Team","apmStatus":"M1","draftDate":"2022-05-30T11:11:29.25","lastApprovedDate":"2022-05-30T11:11:29.25","outDocNumber":null,"docNumber":"ISU_ST_WF_10_1960766","currentPage":1,"totalCount":78,"link":"/cm/workflow/common/api/cryptredirect?type=0&param=lMI3DarRpSEHaUvENqdAJdjFmvYdCOTCKJJh09TcQoGkC5kmLBKxuSO8n%2bq797uylTja6yy3GNRVqrBHs6AAsVu47FF5yU%2fVMlX31BuuJhbKJ56PBG6xUtYw41kI7OtV1ZU9h5jg4DirkElE%2bcCbT%2bsReDXhGpsM%2bUGVlXGu%2beDFmJbZGsdaasril6XOAHXYcDuyY%2fw6KbHHkdYROOtCcm5IfmJGlUH5f61eu5ips3gBt%2fSxlx1Y%2bWPiOv5uszYFYZLlGb2iwMyqE%2fu7K7HY7Nkg3jpAJZRWBpXyyrCj1O2FzQ%2bdDSJffD0RHWljPhSWvZuTTO5g%2bNejL3xHDH8BPX5x4YRgDDJUa5O%2fM5i%2frSMy1a4IGm6pAbnc2FVnYMUl","createdId":"ISU_ST12001","createdDate":"2022-05-30T02:06:19.923","updatedId":"ISU_ST12001","updatedDate":"2022-06-02T04:56:46.7330887Z","isRead":true,"isCreate":false,"isUpdate":false,"isDelete":false,"rowNum":0,"actionType":"Read","selected":false}]
        */

        var docInfo = message.data;

        
        var obj1 = (docInfo).replace("[","");
        obj1 = obj1.slice(0,-1);
        //console.log("obj1  : " + obj1);

        var obj2 = JSON.parse(obj1);
        var docTitle = obj2.subject;
        var docReqName = obj2.reqName;
        //1.개발
        //var docUrl = "https://gwt.isu.co.kr"+obj2.link;
        //2.운영
        var docUrl = "https://gw.isu.co.kr"+obj2.link;
        

        //console.log("obj2  : " + obj2);
        //console.log("obj2.subject  : " + docTitle);
        //console.log("obj2.reqName  : " + docReqName);
        //console.log("obj2.link  : " + docUrl);

        $('input[name=doc_info]').attr('value',docTitle);
        $('a').attr('href',docUrl);

        $('input[name=docCnt]').attr('value',"1건");
        $('input[name=doc_link]').attr('value',docUrl);
        
        this.docTitle = docTitle;
        this.docUrl = docUrl;

    }
    
    //문서연결 삭제 기능
    removeDoc(){
        console.log($('input[name=doc_info]').val());
        if($('input[name=doc_info]').val()){
            $('input[name=doc_info]').attr('value',"");
            $('input[name=docCnt]').attr('value',"");
        }else{
            this.toast.open('연결된 문서가 없습니다. ', 'danger');
        }
    }

    //2022-06-02 PSW 작업 끝
    
    /*selectedCom(company){
        console.log("test");
    }
    */
    /*
    onAreaListControlChanged(list) {
    }

    onNgModelChange(event) {
    }

    ngAfterViewInit(){
    }
    */
}