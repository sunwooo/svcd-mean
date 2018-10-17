import { Component, OnInit, Renderer, EventEmitter, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS, MatDatepickerInputEvent } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { AuthService } from '../../../services/auth.service';
import { ToastComponent } from '../../../shared/toast/toast.component';
import { QnaService } from '../../../services/qna.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload'
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../../../services/user.service';
import { CommonApiService } from '../../../services/common-api.service';
import { catchError, map, tap, startWith, switchMap, debounceTime, distinctUntilChanged, takeWhile, first } from 'rxjs/operators';
import { HigherCdComponent } from '../../../shared/higher-cd/higher-cd.component';
import { Input, Output } from "@angular/core";
import { saveAs } from 'file-saver';
const URL = '/api/upload-file';

// Jquery declaration
declare var $: any;


@Component({
    selector: 'app-qna-detail',
    templateUrl: './qna-detail.component.html',
    styleUrls: ['./qna-detail.component.css']
})
export class QnaDetailComponent implements OnInit {

    @Input() qnaDetail: any;  //조회 oftenqna
    @Input() cValues;              //모달창 닫기용
    @Input() dValues;              //모달창 무시용
    @Output() openerReload = new EventEmitter<any>(); //삭제 후 다시 조회를 위한 이벤트

    public isChecked;

    private formData: any = {};    //전송용 formData
    private attach_file: any = []; //mongodb 저장용 첨부파일 배열

    public uploader: FileUploader = new FileUploader({ url: URL }); //file upload용 객체

    public dropdownList = [];
    public selectedItems = [];
    public dropdownSettings = {};

    public companyObj: any = [];                 //회사리스트

    public user_flag: string = this.cookieService.get("user_flag");
    public employee_nm: string = this.cookieService.get("employee_nm");

    constructor(private auth: AuthService,
        public toast: ToastComponent,
        private qnaService: QnaService,
        private cookieService: CookieService,
        private userService: UserService,
        private renderer: Renderer,
        private router: Router,
        private commonApi: CommonApiService) { }



    ngOnInit() {
    }


    /**
     * 모달 닫기
    */
    closeModal($event) {
        this.cValues('Close click');
    }


    /**
     * 파일 다운로드
     * @param path 
     * @param filename 
     */
    fileDownLoad(path, filename){
        this.qnaService.fileDownLoad(path).subscribe(
            (res) => {
                saveAs(res, filename);
            },
            (error: HttpErrorResponse) => {
                console.log(error);
            }
        );
    }


}
