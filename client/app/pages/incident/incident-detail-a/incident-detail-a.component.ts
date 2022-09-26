import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { EmpInfoComponent } from '../../../shared/emp-info/emp-info.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IncidentService } from '../../../services/incident.service';
import { HttpErrorResponse } from '@angular/common/http';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-incident-detail-a',
    templateUrl: './incident-detail-a.component.html',
    styleUrls: ['./incident-detail-a.component.scss']
})
export class IncidentDetailAComponent implements OnInit {

    @Input() incidentDetail: any; //조회 incident
    @Input() cValues;  //모달창 닫기용
    @Input() dValues;  //모달창 무시용
    @Output() afterDelete = new EventEmitter<any>(); //삭제 후 다시 조회를 위한 이벤트
    @Output() reload = new EventEmitter<any>(); //재등록 후 조회를 위한 이벤트

    public empEmail: string = "";               //팝업 조회용 이메일
    //2022-06-10 psw 추가
    public doclink: string ="";

    constructor(private auth: AuthService,
        private modalService: NgbModal,
        private incidentService: IncidentService,
        private empInfo: EmpInfoComponent) { }

    ngOnInit() {
        //console.log("incidentDetail",JSON.stringify(this.incidentDetail));
        //console.log("incidentDetail",this.incidentDetail.attach_file.length);
        /*
            220622_김선재 : 문의글 상세내역 조회시 오류
            - this.incidentDetail.doc_info undefined error 처리
            - undefined 일 경우 초기화
        */
        if(typeof this.incidentDetail.doc_info == "undefined") {
            this.incidentDetail.doc_info = {};
        }
    }

    /**
     * 입력 개수 만큼 빈 Array생성( *ngFor문용)
     * @param i 입력 개수
     */
    counter(i: number) {
        return new Array(i);
    }


    /**
     * 만족도 평가창 팝업
     * @param modalId 
     */
    setValuation(modalId) {
        this.modalService.open(modalId, { size: 'lg', backdropClass: 'light-blue-backdrop' , backdrop: 'static', keyboard: false });
    }

    /**
     * 인적 정보 팝업
     * @param modalId 
     * @param email 
     */
    getEmpInfo(modalId, email) {
        this.empEmail = email;
        this.modalService.open(modalId, { windowClass: 'mdModal', centered: true });
    }

    /**
     * 진행상태가 접수전이면 삭제
     * @param incidentId
     */
    deleteIncident(incidentId) {
        this.incidentService.delete(incidentId).subscribe(
            (res) => {
                this.afterDelete.emit();
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
     * 파일 다운로드
     * @param path 
     * @param filename 
     */
    fileDownLoad(path, filename) {
        this.incidentService.fileDownLoad(path).subscribe(
            (res) => {
                saveAs(res, filename);
            },
            (error: HttpErrorResponse) => {
                console.log(error);
            }
        );
    }

    /**
     * 진행상태 수정
     * @param incident 
     */
    setIncident(incident) {
        this.incidentDetail.status_cd = incident.status_cd;
        this.incidentDetail.status_nm = incident.status_nm;
        this.incidentDetail.valuation = incident.valuation;
        this.incidentDetail.valuation_content = incident.valuation_content;
    }

    /**
     * 모달창 호출
     * @param incident 
     */
    openMiddleModal(modalId){
        this.modalService.open(modalId, { windowClass: 'xllModal', centered: true, backdrop: 'static', keyboard: false });
    }
 
    /*
     * 수정 후 호출
     * @param event 
     */
    afterModify(event){
        console.log("================= afterModify");
    }

    /**
     * 재등록 후 호출
     * @param event 
     */
    afterRewrite(){
        this.reload.emit();
        this.cValues('Close click');
    }


    /**
     * 모달 닫기
    */
    closeModal($event) {
        this.cValues('Close click');
    }

    //2022-06-10 psw 추가
    getDoc(){
        this.doclink = this.incidentDetail.doc_link;
        window.open(this.doclink, '_blank');
        
    }

}
