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
import { catchError, map, tap,startWith, switchMap, debounceTime, distinctUntilChanged, takeWhile, first } from 'rxjs/operators';
import { HigherCdComponent } from '../../../shared/higher-cd/higher-cd.component';
import { Input, Output } from "@angular/core";
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
      this.formData = this.qnaDetail;
      this.getCompany();
     // alert(JSON.stringify(this.formData.company_cd));
       
     
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

        
        this.selectedItems = this.formData.company_cd;
        console.log("this.selectedItems : ", this.selectedItems);
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
                            text:"Select on Companies",
                            selectAllText:'Select All',
                            unSelectAllText:'UnSelect All',
                            enableSearchFilter: true,
                            classes:"myclass custom-class"
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

        $('#summernote').summernote('code', this.formData.content);

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
            this.saveQna();
        }
  }

 

  /**
     * mongodb 저장용 서비스 호출
     */
    saveQna() {
        console.log('=======================================saveOftenqna(form : NgForm)===============================');
        console.log("form",this.formData);
        console.log('=================================================================================================');
        
        this.formData.company_cd = this.selectedItems;
        console.log("this.selectedItems : ", this.selectedItems);


        this.qnaService.putQna(this.formData).subscribe(
            (res) => {

                console.log('============= oftenqnaService.putOftenqna(this.formData).subscribe ===============');
                console.log(res);
                console.log('===================================================================================');

                //this.toast.open('저장되었습니다.', 'success');
                //this.router.navigate(['/svcd/4800']);
                //this.cValues('Close click');


                if(res.success){
                    //리스트와 공유된 oftenqnaDetail 수정
                    this.qnaDetail.title   = this.formData.title;
                    this.qnaDetail.content   = this.formData.content;
                    

                    this.openerReload.emit();

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
     * formData 조합
     * @param form 
     */
    updateQna(form: NgForm) {

        //Template form을 전송용 formData에 저장 
        //summernote 내용처리
        var text = $('#summernote').summernote('code');
        this.formData.content = text;
  
        this.formData.title = form.value.oftenqna.title;
        this.formData.user_nm = this.employee_nm;

        console.log('============= updateQna ===============');
        console.log('this.formData.title :' , this.formData.title);
        console.log('this.formData.content :' , this.formData.content);
        console.log("this.uploader : ", this.uploader);
        console.log("this.formData : ", this.formData);
        console.log('============================================');

        if (this.uploader.queue.length > 0) {
            this.uploader.uploadAll(); //uploader 완료(this.uploader.onCompleteAll) 후 oftenqna저장
        } else {
            this.saveQna();
        }

    }


    /**
     * 자주묻는질문과답 삭제
     * @param higherProcessId
     */
    deleteQna(qnaId) {
        console.log("deleteQna qnaId :" , qnaId);

        this.qnaService.delete(qnaId).subscribe(
            (res) => {
                
                if(res.success){

                    console.log("successAAAAAAA");
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


    onItemSelect(item:any){
        console.log("onItemSelect selectedItems : ", this.selectedItems);
        console.log("onItemSelect item : ", item);
        
        //this.selectedItems.push(item);
        console.log("1 this.selectedItems: ", this.selectedItems);
    }
    OnItemDeSelect(item:any){
        //this.selectedItems.pop();
        console.log("2 this.selectedItems: ", this.selectedItems);

    }
    onSelectAll(items: any){
        //this.selectedItems.splice(0);
        //this.selectedItems.push(items); //[{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
        //this.selectedItems = this.selectedItems[0];
        console.log("3 this.selectedItems: ", this.selectedItems);
    }
    onDeSelectAll(items: any){
        //this.selectedItems.splice(0);
        console.log("4 this.selectedItems: ", this.selectedItems);
    }

    /**
   * 회사리스트 조회
   */
  
  getCompany() {
    this.commonApi.getCompany({scope:"*"}).subscribe( 
        (res) => {
            //console.log("getCompany res ====>" , JSON.stringify(res));
            //console.log("getCompany res ====>" , JSON.stringify(res));
            this.companyObj = res;
            for(var i=0; i<this.companyObj.length;i++){

                var text = {id:""+ this.companyObj[i].company_cd+"",itemName:""+ this.companyObj[i].company_nm+""} ;
                console.log("text :" + text);
                // {id:"7",itemName:"France"},

                this.dropdownList.push(text);
            }
        },
        (error: HttpErrorResponse) => {
        }
    );
  }

}
