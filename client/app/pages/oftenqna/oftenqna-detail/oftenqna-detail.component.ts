import { Component, OnInit, Renderer, EventEmitter, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS, MatDatepickerInputEvent } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { AuthService } from '../../../services/auth.service';
import { ToastComponent } from '../../../shared/toast/toast.component';
import { OftenqnaService } from '../../../services/oftenqna.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload'
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../../../services/user.service';
import { catchError, map, tap,startWith, switchMap, debounceTime, distinctUntilChanged, takeWhile, first } from 'rxjs/operators';
import { HigherCdComponent } from '../../../shared/higher-cd/higher-cd.component';
import { Input, Output } from "@angular/core";
const URL = '/api/upload-file';

// Jquery declaration
declare var $: any;


@Component({
  selector: 'app-oftenqna-detail',
  templateUrl: './oftenqna-detail.component.html',
  styleUrls: ['./oftenqna-detail.component.css']
})
export class OftenqnaDetailComponent implements OnInit {
    @Input() oftenqnaDetail: any;  //조회 oftenqna
    @Input() cValues;              //모달창 닫기용
    @Input() dValues;              //모달창 무시용
    @Output() openerReload = new EventEmitter<any>(); //삭제 후 다시 조회를 위한 이벤트

    private formData: any = {};    //전송용 formData
    private attach_file: any = []; //mongodb 저장용 첨부파일 배열

    public uploader: FileUploader = new FileUploader({ url: URL }); //file upload용 객체
  

  constructor(private auth: AuthService,
        public toast: ToastComponent,
        private oftenqnaService: OftenqnaService,
        private cookieService: CookieService,
        private userService: UserService,
        private renderer: Renderer,
        private router: Router) { }

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
            , popover: {
                image: [],
                link: [],
                air: []
            }
        });

        /**
         * 개별 파일업로드 완료 시 db저장용 objectt배열에 저장
         */
        this.uploader.onCompleteItem = (item: any, res: any, status: any, headers: any) => {
            this.attach_file.push(JSON.parse(res));
        }

        /**
         * 첨부파일 전체 업로드 완료 시 db저장용 object배열을 fromData에 저장
         */
        this.uploader.onCompleteAll = () => {
            this.formData.oftenqna.attach_file = this.attach_file;
            this.saveOftenqna(this.formData);
        }
  }

  /**
     * mongodb 저장용 서비스 호출
     */
    saveOftenqna(form: NgForm) {
        form.value.oftenqna.id = this.oftenqnaDetail._id;

        console.log('=======================================saveOftenqna(form : NgForm)===============================');
        console.log("form.value",form.value);
        console.log("form",form);
        console.log('=================================================================================================');
        
        this.oftenqnaService.putOftenqna(form).subscribe(
            (res) => {

                console.log('============= oftenqnaService.putOftenqna(this.formData).subscribe ===============');
                console.log(res);
                console.log('===================================================================================');

                //this.toast.open('저장되었습니다.', 'success');
                //this.router.navigate(['/svcd/4800']);
                //this.cValues('Close click');


                if(res.success){
                    //리스트와 공유된 oftenqnaDetail 수정
                    this.oftenqnaDetail.title   = form.value.title;
                    this.oftenqnaDetail.content   = form.value.content;
                    //this.higherProcessDetail.description = form.value.description;
                    //this.higherProcessDetail.use_yn      = form.value.use_yn;

                     this.openerReload.emit();

                    //모달창 닫기
                    this.cValues('Close click');
                }


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
     * formData 조합
     * @param form 
     */
    updateOftenqna(form: NgForm) {

        //summernote 내용처리
        var text = $('#summernote').summernote('code');
        form.value.oftenqna.content = text;

        

        //Template form을 전송용 formData에 저장 
        this.formData = form.value;
        //form.onReset();

        console.log('============= updateOftenqna ===============');
        console.log("this.uploader : ", this.uploader);
        console.log("this.formData : ", this.formData);
        console.log('============================================');

        if (this.uploader.queue.length > 0) {
            this.uploader.uploadAll(); //uploader 완료(this.uploader.onCompleteAll) 후 oftenqna저장
        } else {
            this.saveOftenqna(this.formData);
        }

    }

}
