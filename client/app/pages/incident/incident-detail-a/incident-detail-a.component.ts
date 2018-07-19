import { Component, OnInit, Input } from '@angular/core';
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

    public empEmail: string = "";               //팝업 조회용 이메일

    constructor(private auth: AuthService,
        private modalService: NgbModal,
        private incidentService: IncidentService,
        private empInfo: EmpInfoComponent) { }

    ngOnInit() {
        //console.log("incidentDetail",JSON.stringify(this.incidentDetail));
        //console.log("incidentDetail",this.incidentDetail.attach_file.length);
    }

    /**
     * 입력 개수 만큼 빈 Array생성( *ngFor문용)
     * @param i 입력 개수
     */
    counter(i: number) {
        return new Array(i);
    }

    setValuation(modalId){
        this.modalService.open(modalId, { size: 'lg', backdropClass: 'light-blue-backdrop' });
    }

    getEmpInfo(modalId, email){
        this.empEmail = email;
        this.modalService.open(modalId, { windowClass: 'mdModal', centered: true});
    }

    deleteIncident(incidentId){
        this.incidentService.delete(incidentId).subscribe(
            (res) => {
                console.log("",res);
            },
            (error: HttpErrorResponse) => {
                console.log(error);
            }
        );
    }

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

    setStatusCd(status_cd: string){
        this.incidentDetail.status_cd = status_cd;
    }

}
