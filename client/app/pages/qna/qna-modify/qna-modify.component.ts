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
const URL = '/api/upload-file';

// Jquery declaration
declare var $: any;

@Component({
  selector: 'app-qna-modify',
  templateUrl: './qna-modify.component.html',
  styleUrls: ['./qna-modify.component.css']
})
export class QnaModifyComponent implements OnInit {

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

    public user_flag = "9";
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

        if(this.cookieService.get("user_flag"))
            this.user_flag = this.cookieService.get("user_flag");

        this.getCompany();

        //pop_yn에 따른 체크박스 체크
        if (this.qnaDetail.pop_yn == "Y") {
            this.isChecked = true;
        } else {
            this.isChecked = false;
        }

        this.dropdownList = [
            /*
                { id: "1", itemName: "India" },
                { id: "2", itemName: "Singapore" },
                { id: "3", itemName: "Australia" },
                { id: "4", itemName: "Canada" },
                { id: "5", itemName: "South Korea" },
                { id: "6", itemName: "Brazil" }
            */
        ];


        this.selectedItems = this.qnaDetail.company_cd;
        //console.log("this.selectedItems : ", this.selectedItems);
        /*
                [
                    { "id": 1, "itemName": "India" },
                    { "id": 2, "itemName": "Singapore" },
                    { "id": 3, "itemName": "Australia" },
                    { "id": 4, "itemName": "Canada" }
                ];
          */
        this.dropdownSettings = {
            singleSelection: false,
            text: "Select on Companies",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableSearchFilter: true,
            classes: "myclass custom-class"
        };


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

        $('#summernote').summernote('code', this.qnaDetail.content);

        /**
         * 개별 파일업로드 완료 시 db저장용 object배열에 저장
         */
        this.uploader.onCompleteItem = (item: any, res: any, status: any, headers: any) => {
            //console.log('=======================================uploader.onCompleteItem=======================================');
            //console.log("uploader.onCompleteItem res ", res);
            //console.log('=================================================================================================');

            this.attach_file.push(JSON.parse(res));
        }

        /**
         * 첨부파일 전체 업로드 완료 시 db저장용 object배열을 fromData에 저장
         */
        this.uploader.onCompleteAll = () => {

            this.attach_file.forEach(af => {
                this.qnaDetail.attach_file.push(af);
            });

            this.formData = {
                'qna': {
                    '_id': this.qnaDetail._id,
                    'attach_file': this.qnaDetail.attach_file
                }
            };

            //console.log('=======================================uploader.onCompleteAll=======================================');
            //console.log("this.formData ", this.formData);
            //console.log('=================================================================================================');

            //Template form을 전송용 formData에 저장 
            this.qnaService.fileUpdate(this.formData).subscribe(
                (res) => {
                    this.uploader.clearQueue();
                    this.toast.open('파일이 업로드되었습니다.', 'success');
                },
                (error: HttpErrorResponse) => {
                    console.log(error);
                });
        }
    }


    /**
     * formData 조합
     * @param form 
     */
    updateQna(form: NgForm) {

        //Template form을 전송용 formData에 저장 
        this.formData = form.value;
        this.formData.qna._id = this.qnaDetail._id;

        //summernote 내용처리
        var text = $('#summernote').summernote('code');
        var ctext = text.replace(/<img src=/gi,'<img class="summernote-img" src=');
        this.formData.qna.content = ctext;

        this.formData.qna.user_nm = this.employee_nm;
        if (this.isChecked) {
            this.formData.qna.pop_yn = "Y";
        } else {
            this.formData.qna.pop_yn = "N";
        }

        this.formData.qna.company_cd = this.selectedItems;

        this.qnaService.putQna(this.formData).subscribe(
            (res) => {
                if (res.success) {
                    //리스트와 공유된 oftenqnaDetail 수정
                    this.qnaDetail.title = this.formData.qna.title;
                    this.qnaDetail.content = this.formData.qna.content;
                    this.qnaDetail.pop_yn = this.formData.qna.pop_yn;
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
     * 자주묻는질문과답 삭제
     * @param higherProcessId
     */
    deleteQna(qnaId) {
        //console.log("deleteQna qnaId :", qnaId);

        this.qnaService.delete(qnaId).subscribe(
            (res) => {
                if (res.success) {
                    this.toast.open('삭제되었습니다.', 'success');
                    this.router.navigate(['/svcd/4800']);
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
     * 모달 닫기
    */
    closeModal($event) {
        this.cValues('Close click');
    }


    onItemSelect(item: any) {
        //console.log("onItemSelect selectedItems : ", this.selectedItems);
        //console.log("onItemSelect item : ", item);

        //this.selectedItems.push(item);
        console.log("1 this.selectedItems: ", this.selectedItems);
    }
    OnItemDeSelect(item: any) {
        //this.selectedItems.pop();
        //console.log("2 this.selectedItems: ", this.selectedItems);

    }
    onSelectAll(items: any) {
        //this.selectedItems.splice(0);
        //this.selectedItems.push(items); //[{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
        //this.selectedItems = this.selectedItems[0];
        //console.log("3 this.selectedItems: ", this.selectedItems);
    }
    onDeSelectAll(items: any) {
        //this.selectedItems.splice(0);
        //console.log("4 this.selectedItems: ", this.selectedItems);
    }

    /**
   * 회사리스트 조회
   */

    getCompany() {
        this.commonApi.getCompany({ scope: "*" }).subscribe(
            (res) => {
                //console.log("getCompany res ====>" , JSON.stringify(res));
                //console.log("getCompany res ====>" , JSON.stringify(res));
                this.companyObj = res;
                for (var i = 0; i < this.companyObj.length; i++) {

                    var text = { id: "" + this.companyObj[i].company_cd + "", itemName: "" + this.companyObj[i].company_nm + "" };
                    //console.log("text :" + text);
                    // {id:"7",itemName:"France"},

                    this.dropdownList.push(text);
                }
            },
            (error: HttpErrorResponse) => {
            }
        );
    }


    /**
     * 파일 다운로드
     * @param path 
     * @param filename 
     */
    deleteFile(deletefile, index) {

        //삭제할 파일을 attach_file 배열에서 제거 (DB저장용)
        this.qnaDetail.attach_file.splice(index, 1);

        this.formData = {
            'qna': {
                '_id': this.qnaDetail._id,
                'attach_file': this.qnaDetail.attach_file
            },
            'deletefile': deletefile
        };

        //Template form을 전송용 formData에 저장 
        this.qnaService.fileUpdate(this.formData).subscribe(
            (res) => {
                console.log("res ", res);
                this.toast.open('파일이 삭제되었습니다.', 'success');
            },
            (error: HttpErrorResponse) => {
                console.log(error);
            }
        );
    }

    /**
     * 첨부파일 추가
     */
    addAttachFile() {
        if (this.uploader.queue.length > 0) {
            this.uploader.uploadAll(); //uploader 완료(this.uploader.onCompleteAll)
        } else {
            this.toast.open('올릴 파일을 선택하세요.', 'danger');
        }
    }

}

