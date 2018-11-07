import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProcessGubunCodeService } from '../../../services/process-gubun-code.service';
import { ToastComponent } from '../../../shared/toast/toast.component';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonApiService } from '../../../services/common-api.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-process-gubun-code-new',
    templateUrl: './process-gubun-code-new.component.html',
    styleUrls: ['./process-gubun-code-new.component.css']
})
export class ProcessGubunCodeNewComponent implements OnInit {

    @Input() cValues;  //모달창 닫기용
    @Input() dValues;  //모달창 무시용
    @Output() openerReload = new EventEmitter<any>(); //삭제 후 다시 조회를 위한 이벤트

    public isLoading = true;
    public higherObj: any = [];             //상위업무리스트
    public higher_cd: string = "";          //상위업무코드
    public higher_nm: string = "";

    public question_type: string = "";
    public process_cd: string = "";
    public process_nm: string = "";
    public description: string = "";
    public use_yn: string = "";

    public user_nm: string = this.auth.employee_nm;
    public user_id: string = this.auth.email;

    public question_typeObj: { name: string; value: string; }[] = [
        { name: '장애', value: '장애' },
        { name: '오류', value: '오류' },
        { name: '운영', value: '운영' },
        { name: '추가개발', value: '추가개발' },
        { name: '신규개발', value: '신규개발' },
        { name: '기타', value: '기타' }
    ];

    public use_ynObj: { name: string; value: string; }[] = [
        { name: '사용', value: '사용' },
        { name: '미사용', value: '미사용' }
    ];

    constructor(private auth: AuthService
        ,private processGubunCodeService: ProcessGubunCodeService
        , public toast: ToastComponent
        , private commonApi: CommonApiService
        , private router: Router) { }

    ngOnInit() {
        this.isLoading = false;
        this.getHigherProcess();
    }

    /**
    * 상위업무 변경 시 
    */
    setHigherCd(idx) {
        this.higher_cd = this.higherObj[idx].higher_cd;
        this.higher_nm = this.higherObj[idx].higher_nm;
    }

    /**
    * 조회
    */
    getHigherProcess() {
        this.commonApi.getHigher({ scope: "*" }).subscribe(
            (res) => {
                this.higherObj = res;
            },
            (error: HttpErrorResponse) => {
            }
        );
    }

    /**
     * 추가
     * @param form 
     */
    addProcessGubunCode(form: NgForm) {
        //console.log('★ uaddProcessGubunCode start =======');
        //console.log('form : ', form.value);

        this.processGubunCodeService.addProcessGubunCode(form.value).subscribe(
            (res) => {
                if (res.success) {

                    this.toast.open('추가되었습니다.', 'success');

                    //조회화면으로 이동
                    this.goList();
                } else {
                    this.toast.open('중복된 코드가 존재합니다.', 'danger');
                }
            },
            (error: HttpErrorResponse) => {
                this.toast.open('오류입니다. ' + error.message, 'danger');
            }
        );
    }

    goList() {
        this.router.navigate(['/svcd/4700']);
    }
}
