import { Component, OnInit, Renderer, EventEmitter, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS, MatDatepickerInputEvent } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { AuthService } from '../../../services/auth.service';
import { ToastComponent } from '../../../shared/toast/toast.component';
import { IncidentService } from '../../../services/incident.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload'
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../../../services/user.service';
import { catchError, map, tap,startWith, switchMap, debounceTime, distinctUntilChanged, takeWhile, first } from 'rxjs/operators';
import { HigherCdComponent } from '../../../shared/higher-cd/higher-cd.component';
const URL = '/api/upload-file';

// Jquery declaration
declare var $: any;

@Component({
    selector: 'app-incident-new-mng',
    templateUrl: './incident-new-mng.component.html',
    styleUrls: ['./incident-new-mng.component.css'],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'ko-KR' },
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    ],
})
export class IncidentNewMngComponent implements OnInit {

    @ViewChild(HigherCdComponent) child:HigherCdComponent;

    public higher: any = {};
    public initPrcSpd: string = "N";
    public real_contact: string ;

    private formData: any = {}; //전송용 formData
    private attach_file: any = []; //mongodb 저장용 첨부파일 배열
    private request_info: any = {} //요청자 정보
    private dateChange = false; //완료요청일이 변경되었는지 여부
    
    public request_company: string = ""; //요청자의 상위업무를 회사범위 내에서 지정하기 위함

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

    public searchResult = [];
    public userControl = new FormControl();

    constructor(private auth: AuthService,
        public toast: ToastComponent,
        private incidentService: IncidentService,
        private userService: UserService,
        private renderer: Renderer,
        private router: Router) 
    {       
        this.userControl.valueChanges
        .debounceTime(200) 
        .subscribe((searchName) => {
            if(searchName){
                this.userService.findEmp(searchName).subscribe(
                    (res) =>{
                        this.searchResult = res;
                    }
                )
            }
            
        });
    }


    ngOnInit() {

        this.today.setDate(this.today.getDate() + 3);
        this.request_complete_date = new FormControl(this.today);

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
            , popover: {
                image: [],
                link: [],
                air: []
            }
        });

        /**
         * 개별 파일업로드 완료 시 db저장용 object배열에 저장
         */
        this.uploader.onCompleteItem = (item: any, res: any, status: any, headers: any) => {
            this.attach_file.push(JSON.parse(res));
        }

        /**
         * 첨부파일 전체 업로드 완료 시 db저장용 object배열을 fromData에 저장
         */
        this.uploader.onCompleteAll = () => {
            this.formData.incident.attach_file = this.attach_file;
            this.addIncident();
        }

    }

    ngAfterViewInit(){
        //요청자명에 focus
        let onElement = this.renderer.selectRootElement('#request_info');
        onElement.focus();
    }

    /**
     * 신청자 정보 매핑
     * @param user
     */
    setRequestInfo(user) {
        
        this.request_info = user;
        this.request_company = user.company_cd;

        //상위코드 세팅
        this.child.getHigherCd(this.request_company);   

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
        var text = $('#summernote').summernote('code');
        var ctext = text.replace(/<img src=/gi,'<img class="summernote-img" src=');
        form.value.incident.content = ctext;

        form.value.incident.higher_cd = this.higher.higher_cd;
        form.value.incident.higher_nm = this.higher.higher_nm;
        form.value.request_info = this.request_info;

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
                this.router.navigate(['/svcd/2200']);
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
        console.log('higherCd : ', higher);
        //this.higherCd = higherCd;

        //////////////////////////////////
        this.higher = higher;
        //////////////////////////////////  

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