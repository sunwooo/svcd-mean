import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProcessGubunCodeService } from '../../../services/process-gubun-code.service';
import { ToastComponent } from '../../../shared/toast/toast.component';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonApiService } from '../../../services/common-api.service';

@Component({
    selector: 'app-process-gubun-code-detail',
    templateUrl: './process-gubun-code-detail.component.html',
    styleUrls: ['./process-gubun-code-detail.component.css']
})
export class ProcessGubunCodeDetailComponent implements OnInit {

    @Input() processGubunCodeDetail: any; //조회 company
    @Input() cValues;  //모달창 닫기용
    @Input() dValues;  //모달창 무시용
    @Output() openerReload = new EventEmitter<any>(); //삭제 후 다시 조회를 위한 이벤트

    public isLoading = true;
    public higherObj: any = [];                     //상위업무리스트
    public higher_cd: string = "*";                 //상위업무코드
    public higher_nm: string = "";
    public selectedIdx = 0;                      //Object 내 index

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

    constructor(private processGubunCodeService: ProcessGubunCodeService
        , public toast: ToastComponent
        , private commonApi: CommonApiService) { }

    ngOnInit() {
        this.isLoading = false;
        this.getHigherProcess();
    }

    /**
   * 상위업무 변경 시 
   */
    setHigherCd(idx) {
        this.processGubunCodeDetail.higher_cd = this.higherObj[idx].higher_cd;
        this.processGubunCodeDetail.higher_nm = this.higherObj[idx].higher_nm;
    }

    /**
   * 상위업무리스트 조회
   */

    getHigherProcess() {
        this.commonApi.getHigher({ scope: "*" }).subscribe(
            (res) => {
                this.higherObj = res;

                //idx를 찾아서 조회시 초기값 세팅
                var tmpIdx = 0;
                this.higherObj.forEach(element => {
                    if (element.higher_cd == this.processGubunCodeDetail.higher_cd) {
                        this.selectedIdx = tmpIdx;
                    }
                    tmpIdx++;
                });
            },
            (error: HttpErrorResponse) => {
            }
        );
    }

    /**
       * 하위업무 수정
       * @param form 
      */

    updateProcessGubunCode(form: NgForm) {
        
        form.value.processGubunCodeDetail.id = this.processGubunCodeDetail._id;

        this.processGubunCodeService.putProcessGubunCode(form.value).subscribe(
            (res) => {
                console.log("res : ", res);

                if (res.success) {
                    this.toast.open('수정되었습니다.', 'success');
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
     * 상위업무 삭제
     * @param processGubunCodeId
     */
    deleteProcessGubunCode(processGubunCodeId) {
        //console.log("deleteProcessGubunCode processGubunCodeId :", processGubunCodeId);

        if (confirm("처리구분코드를 삭제 하시겠습니까?")) {
            this.processGubunCodeService.delete(processGubunCodeId).subscribe(
                (res) => {
                    if (res.success) {
                        this.toast.open('삭제되었습니다.', 'success');
                        this.openerReload.emit();

                        //모달창 닫기
                        this.cValues('Close click');
                    }
                },
                (error: HttpErrorResponse) => {
                    this.toast.open('오류입니다. ' + error.message, 'danger');
                },
            );
        }
    }

    /**
     * 모달 닫기
    */
    closeModal($event) {
        this.cValues('Close click');
    }

}
