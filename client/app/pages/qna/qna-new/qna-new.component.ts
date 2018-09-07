import { Component, OnInit } from '@angular/core';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload'
import { HttpErrorResponse } from "@angular/common/http";
import { CommonApiService } from '../../../services/common-api.service';
import { CookieService } from 'ngx-cookie-service';
import { NgForm } from "@angular/forms";
import { QnaService } from '../../../services/qna.service';
import { ToastComponent } from '../../../shared/toast/toast.component';
import { Router } from '@angular/router';
import { EventEmitter } from "@angular/core";
import { Output } from "@angular/core";
import { Input } from "@angular/core";


const URL = '/api/upload-file';

// Jquery declaration
declare var $: any;

@Component({
  selector: 'app-qna-new',
  templateUrl: './qna-new.component.html',
  styleUrls: ['./qna-new.component.css']
})
export class QnaNewComponent implements OnInit {
  item: any;
  aJsonArray: any;

  public isLoading = true;
  private formData: any = {}; //전송용 formData
  private attach_file: any = []; //mongodb 저장용 첨부파일 배열

  public uploader: FileUploader = new FileUploader({ url: URL }); //file upload용 객체

  public today = new Date();
  public minDate = new Date(2015, 0, 1);
  public maxDate = new Date(2030, 0, 1);


  public higherObj: any = [];                  //상위업무리스트
  public higher_cd: string = "*";              //상위업무코드 
  public higher_nm: string = "";               //상위업무명 

  public companyObj: any = [];                 //회사리스트




  public dropdownList = [];
  public selectedItems = [];
  public dropdownSettings = {};
  //companyList = [];

  public employee_nm: string = this.cookieService.get("employee_nm");
  public email: string = this.cookieService.get("email");

  innerValue: string;

  @Input() value: any;
  @Input() placeholder: string;
  @Input() disabled: boolean;
  @Input() trueValue: any = "true";
  @Input() falseValue: any = "false";
  @Output() onChange = new EventEmitter();
  @Output() valueChange = new EventEmitter();


  constructor(private qnaService: QnaService
              ,private toast: ToastComponent
              ,private router: Router
              ,private commonApi: CommonApiService
              ,private cookieService: CookieService) { }

  ngOnInit() {
    console.log("employee_nm :" , this.employee_nm);
    this.isLoading = false;
    this.getHigherProcess();    
    this.getCompany();

    this.dropdownList = [
                            /*
                            {id:"1",itemName:"India"},
                            {id:"2",itemName:"Singapore"},
                            {id:"3",itemName:"Australia"},
                            {id:"4",itemName:"Canada"},
                            {id:"5",itemName:"South Korea"},
                            {id:"6",itemName:"Germany"},
                            {id:"7",itemName:"France"},
                            {id:"8",itemName:"Russia"},
                            {id:"9",itemName:"Italy"},
                            {id:"10",itemName:"Sweden"}
                            */
                            /*
                            { id: "1", itemName: "India" },
                            { id: "2", itemName: "Singapore" },
                            { id: "3", itemName: "Australia" },
                            { id: "4", itemName: "Canada" },
                            { id: "5", itemName: "South Korea" },
                            { id: "6", itemName: "Brazil" }
                            */
    ];
    this.selectedItems = [
                            //{"id":2,"itemName":"Singapore"},
                            //{"id":3,"itemName":"Australia"},
                            //{"id":4,"itemName":"Canada"},
                            //{"id":5,"itemName":"South Korea"}
    ];
    this.dropdownSettings = { 
                                singleSelection: false, 
                                text:"Select on Companies",
                                selectAllText:'Select All',
                                unSelectAllText:'UnSelect All',
                                enableSearchFilter: true,
                                classes:"myclass custom-class"
    };        
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

        /**
         * 개별 파일업로드 완료 시 db저장용 objectt배열에 저장
         */ 
        this.uploader.onCompleteItem = (item: any, res: any, status: any, headers: any) => {

            console.log('=======================================uploader.onCompleteItem=======================================');
            console.log("res ", res);
            console.log('=================================================================================================');

            this.attach_file.push(JSON.parse(res)); 
        }

        /**
         * 첨부파일 전체 업로드 완료 시 db저장용 object배열을 fromData에 저장
         */
        this.uploader.onCompleteAll = () => {

            console.log('=======================================uploader.onCompleteAll=======================================');
            console.log("this.formData ", this.formData);
            console.log('=================================================================================================');

            this.formData.qna.attach_file = this.attach_file;
            this.addQna();

        }
  }

  /**
   * formData 조합
   * @param form 
   */
  saveQna(form: NgForm) {
      console.log("saveQna function call....!!!");

      //summernote 내용처리
      var text = $('#summernote').summernote('code');
      console.log("saveQna() text : ", text);

      form.value.qna.content = text;
      //form.value.qna.higher_cd = this.higher.higher_cd;
      //form.value.qna.higher_nm = this.higher.higher_nm;
      //Template form을 전송용 formData에 저장 
      form.value.qna.higher_cd     = this.higher_cd;
      form.value.qna.higher_nm     = this.higher_nm;
      form.value.qna.user_nm       = this.employee_nm;
      form.value.qna.user_id       = this.email;
      form.value.qna.company_cd    = this.selectedItems;
      form.value.qna.pop_yn        = this.innerValue;
      

    
      this.formData = form.value;
      //console.log("this.selectedItems : " , this.selectedItems);
      console.log("saveQna()AAA  this.formData : ", this.formData);

      //form.onReset();

      //console.log('============= saveIncident ===============');
      //console.log("this.uploader : ", this.uploader);
      //console.log('==========================================');

      if (this.uploader.queue.length > 0) {
          this.uploader.uploadAll(); //uploader 완료(this.uploader.onCompleteAll) 후 incident저장
      } else {
          this.addQna();
      }

  }

  /**
   * mongodb 저장용 서비스 호출
   */
  addQna() {
    //console.log("addQna function call....!!!");
    this.qnaService.addQna(this.formData).subscribe(
        (res) => {

            //console.log('============= qnaService.addQna(this.formData).subscribe ===============');
            //console.log(res);
            //console.log("this.formData :", this.formData);
            //console.log('========================================================================');

            if(res.success){
                //리스트와 공유된 oftenqnaDetail 수정
                //this.qnaDetail.title   = this.formData.title;
                //this.qnaDetail.content   = this.formData.content;
                //console.log("success..");
                this.toast.open('등록되었습니다.', 'success');
                this.router.navigate(['/svcd/4800']);
            }
        },
        (error: HttpErrorResponse) => {
            this.toast.open('오류입니다. ' + error.message, 'danger');
        }
    );
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
  /**
   * 상위업무리스트 조회
   */
  
  getHigherProcess() {
    this.commonApi.getHigher({scope:"*"}).subscribe( 
        (res) => {
            console.log("res ====>" , res);
            this.higherObj = res;
        },
        (error: HttpErrorResponse) => {
        }
    );
  }

  /**
   * 상위업무 변경 시 
   */
  
  setHigherCd(idx){
  //console.log("xxxxxxxxx", idx);
  this.higher_cd = this.higherObj[idx].higher_cd;
  this.higher_nm = this.higherObj[idx].higher_nm;

  //console.log("this.higher_nm", this.higher_nm);
  //console.log("this.higher_cd", this.higher_cd);
  //this.getQna();
  }

  goList(){
      this.router.navigate(['/svcd/4800']);
  }
  /**
   * 업무요청 선택 시
   * @param higher 
   */
  /*
  onSelected(higher) {
      //alert("onSelected higher : "+ higher);
      console.log('higher : ', higher);
      //this.higherCd = higherCd;

      //////////////////////////////////
      this.higher = higher;
      //////////////////////////////////  

  }
*/

  onItemSelect(item:any){
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



  modelChange($event) {
        console.log("modelChange $event : ", $event);

        if ($event) {
            this.innerValue = "Y";
            this.valueChange.emit(this.trueValue);
        } else {
            this.innerValue = "N";
            this.valueChange.emit(this.falseValue);
        }
  }
}
