import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { EmpInfoComponent } from '../../../shared/emp-info/emp-info.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IncidentService } from '../../../services/incident.service';
import { HttpErrorResponse } from '@angular/common/http';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-incident-detail-m',
  templateUrl: './incident-detail-m.component.html',
  styleUrls: ['./incident-detail-m.component.css']
})
export class IncidentDetailMComponent implements OnInit {

    @Input() incidentDetail: any; //조회 incident
    @Input() cValues;  //모달창 닫기용
    @Input() dValues;  //모달창 무시용
    @Input() buttonHidden; //접수,업무변경,완료,평가 버튼 숨김
    @Output() openerReload = new EventEmitter<any>(); //삭제 후 다시 조회를 위한 이벤트

    public empEmail: string = "";               //팝업 조회용 이메일
    public btnDisplay = true;
    public group_flag = 'out';
    public user_flag = '9';

    constructor(private auth: AuthService,
        private modalService: NgbModal,
        private incidentService: IncidentService,
        private empInfo: EmpInfoComponent) { }

    ngOnInit() {
        //console.log("incidentDetail",JSON.stringify(this.incidentDetail));
        //console.log("incidentDetail",this.incidentDetail.attach_file.length);

        //console.log("=========================================");
        //console.log("buttonHidden : ", this.buttonHidden);
        //console.log("=========================================");

        this.user_flag = this.auth.user_flag;
        this.group_flag = this.auth.group_flag;

        if(this.buttonHidden){
            this.btnDisplay = !this.buttonHidden;
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
    setValuation(modalId){
        this.modalService.open(modalId, { size: 'lg', backdropClass: 'light-blue-backdrop' , backdrop: 'static', keyboard: false });
    }

    /**
     * 인적 정보 팝업
     * @param modalId 
     * @param email 
     */
    getEmpInfo(modalId, email){
        this.empEmail = email;
        this.modalService.open(modalId, { windowClass: 'mdModal', centered: true});
    }

    /**
     * 진행상태가 접수전이면 삭제
     * @param incidentId
     */
    deleteIncident(incidentId){
        this.incidentService.delete(incidentId).subscribe(
            (res) => {
                this.openerReload.emit();
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
    fileDownLoad(path, filename){
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
     * @param status_cd 
     */
    setStatusCd(status_cd: string){
        this.incidentDetail.status_cd = status_cd;
    }



    /**
     * 리스트 reload
     * @param reload
     */
    listReload(reload){
        this.openerReload.emit();
        this.cValues('Close click');
    }

    /**
     * 접수 처리
     * @param reload
     */
    setReceipt(status_cd: string){
        this.incidentDetail.status_cd = status_cd;
        this.cValues('Close click');
    }    

    /**
     * 모달창 띄우기
     * @param modalId
     */
    openModal(modalId){
        this.modalService.open(modalId, { windowClass: 'mdModal', centered: true , backdrop: 'static', keyboard: false });
    }

    /**
     * 모달창 띄우기
     * @param modalId
     */
    openModalLg(modalId){
        this.modalService.open(modalId, { size: 'lg', centered: true , backdrop: 'static', keyboard: false });
    }


    /**
     * 모달 닫기
    */
    closeModal($event){
        this.cValues('Close click');
    }

    getDocInfo(){
        window.open(this.incidentDetail.doc_link, '_blank');
        
    }

}