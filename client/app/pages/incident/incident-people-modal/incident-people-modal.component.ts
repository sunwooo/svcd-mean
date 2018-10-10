import { Component, OnInit, Input } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS, MatDatepickerInputEvent } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { AuthService } from '../../../services/auth.service';
import { ToastComponent } from '../../../shared/toast/toast.component';
import { IncidentService } from '../../../services/incident.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { EmpInfoComponent } from '../../../shared/emp-info/emp-info.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-incident-people-modal',
    templateUrl: './incident-people-modal.component.html',
    styleUrls: ['./incident-people-modal.component.css']
})
export class IncidentPeopleModalComponent implements OnInit {

    @Input() higher_nm: any; //조회용 업무
    @Input() cValues;  //모달창 닫기용
    @Input() dValues;  //모달창 무시용

    public incidentDetail: any;                 //선택 인시던트 id
    public selectedIdx: number = -1;            //삭제를 위한 인덱스, 상세보기 시 값변경
    private formData: any = {};                 //전송용 formData
    public incidents: any = [];                 //조회 incident
    public user_flag: string = "user";           //사용자 구분
    public empEmail: string = "";               //팝업 조회용 이메일

    public maxSize: number = 10;      // 한 화면에 나타낼 페이지 수
    public page: number = 1;          // 현재 페이지
    public totalDataCnt: number = 0;  // 총 데이타 수
    public totlaPageCnt: number = 0;  // 총페이지 수 
    public pageDataSize: number = 10;   // 페이지당 출력 개수  

    constructor(private auth: AuthService,
        private toast: ToastComponent,
        private incidentService: IncidentService,
        private empInfo: EmpInfoComponent,
        private modalService: NgbModal,
        private router: Router) { }

    ngOnInit() {
    }


    /**
     * 상세보기창 호출
     * @param modalId 모달창 id
     * @param incident 조회할 incident 객체
     * @param idx  삭제를 위한 인덱스
     */
    setDetail(modalId, incident, idx) {
        if(idx){
            this.incidentDetail = incident;
            this.selectedIdx = idx;
            this.modalService.open(modalId, { windowClass: 'xxlModal', centered: true });
        }
    }

    /**
     * 직원 정보 모달창 호출
     * @param modalId 모달창 id
     * @param email 
     */
    getEmpInfo(modalId, email) {
        this.empEmail = email;
        this.modalService.open(modalId, { windowClass: 'mdModal', centered: true });
    }    


    /**
     * 모달 닫기
    */
    closeModal($event) {
        this.cValues('Close click');
    }

}
