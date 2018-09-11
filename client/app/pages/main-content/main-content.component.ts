import { Component, OnInit, ContentChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StatisticService } from '../../services/statistic.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IncidentService } from '../../services/incident.service';
import { AuthService } from '../../services/auth.service';
import { QnaService } from '../../services/qna.service';
import { PopUpComponent } from '../../shared/pop-up/pop-up.component';


@Component({
    selector: 'app-main-content',
    templateUrl: './main-content.component.html',
    styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit {

    @ContentChild(PopUpComponent) noticeModal: any;

    /** being chart setting */
    public view1: any[] = [350, 200];
    public view2: any[] = [700, 223];
    public view3: any[] = [880, 350];

    // options
    public showXAxis = true;
    public showYAxis = true;
    public gradient = false;
    public showLegend = true;
    public showXAxisLabel = false;
    public xAxisLabel = '월';
    public showYAxisLabel = false;
    public yAxisLabel = '건수';
    public timeline = true;

    public colorScheme1 = {
        domain: ['#f04124', '#99ca3c', '#e5e4e0', '#a7a9ac', '#f04124']
    };

    public colorScheme2 = {
        domain: ['#008fd4', '#b4985a', '#e5e4e0', '#a7a9ac', '#f04124']
    };

    public colorScheme3 = {
        domain: ['#008fd4', '#b4985a', '#99ca3c', '#a7a9ac', '#f04124']
    };

    public colorScheme4 = {
        domain: ['#008fd4', '#b4985a', '#99ca3c', '#a7a9ac', '#f04124']
    };
    // line, area
    autoScale = true;
    /** end chart setting */

    public statusChart1 = [{"name":"접수대기", "value":0},{"name":"처리중", "value":0}];
    public statusChart2 = [{"name":"미평가", "value":0},{"name":"평가완료", "value":0}];

    public statusCntData;

    public valuationChart = [];
    public monthlyCntChart = [];
    public higherCntChart = [];
    public incidentList;
    public incidentDetail: any;                 //선택 인시던트 id
    public empEmail: string = "";               //팝업 조회용 이메일
    public popupNotice: string = "";            //팝업 조회용 QNA공지

    constructor(private auth: AuthService,
        private modalService: NgbModal,
        private statisticService: StatisticService,
        private incidentService: IncidentService,
        private qnaService: QnaService){
    }

    ngOnInit() {

        //상태별 건수
        this.statisticService.getStatusCdCnt().subscribe(
            (res) => {  
                var statusArray = res;
                var chart1 = [];
                var chart2 = [];
                statusArray.forEach((val, idx) => {
                    if(val._id.status_cd == "1"){
                        chart1.push({"name":"접수대기", "value":val.count});
                    }
                    if(val._id.status_cd == "2"){
                        chart1.push({"name":"처리중", "value":val.count});
                    }
                    if(val._id.status_cd == "3"){
                        chart2.push({"name":"미평가", "value":val.count});
                    }
                    if(val._id.status_cd == "4"){
                        chart2.push({"name":"처리완료", "value":val.count});
                    }
                });
                this.statusChart1 = chart1;
                this.statusChart2 = chart2;
            },
            (error: HttpErrorResponse) => {
            }
        );

        //만족도현황
        this.statisticService.valuationCnt().subscribe(
            (res) => {
                this.valuationChart = res;
            },
            (error : HttpErrorResponse) => {

            }
        )
   
        //월별 요청 건수
        this.statisticService.monthlyCnt().subscribe(
            (res) => {
                var yearArray = res;
                var yearTmp = [];
                yearArray.forEach((yyyy, yIdx, result) => {
                    var tmp = new Array(yyyy.series.length);
                    yyyy.series.forEach((mm,mIdx) =>{
                        tmp.splice(Number(mm.name)-1, 1, {name:mm.name, value:mm.value});
                    });
                    yearTmp.push({name: yyyy.name,series:tmp});
                });
                this.monthlyCntChart = yearTmp;
            },
            (error : HttpErrorResponse) => {
                console.log('error :',error);
            }
        )

        //신청건수 상위 업무
        this.statisticService.higherCnt().subscribe(
            (res) => {
                this.higherCntChart = res;
            },
            (error : HttpErrorResponse) => {

            }
        )

        //문의 리스트
        var condition: any = {};
        condition.page = 1;
        condition.perPage = 10;

        this.incidentService.getIncident(condition).subscribe(
            (res) => {
                this.incidentList = res.incident;
            },
            (error : HttpErrorResponse) => {

            }
        )


        
        //팝업공지 기능
        this.qnaService.popupCheck().subscribe(
            (res) => {
                console.log("res:", res.oftenqna);
                //this.popupNotice = popup;
                //this.modalService.open(modalId, { windowClass: 'xlModal', centered: true});
                //this.getPopUp('popupModal', res.oftenqna);
                //this.popupNotice = popup;
                //this.modalService.open('popupModal', { windowClass: 'xlModal', centered: true});

                console.log("this.noticeModal : ", this.noticeModal);
                this.getPopUp(this.noticeModal,res.oftenqna);
            },
            (error : HttpErrorResponse) => {

            }
        )

    }

    onSelect(modalId, data) {
        console.log('Item clicked', data);
        this.modalService.open(modalId, { size: 'lg' });
    }

    setDetail(modalId, incident){
        this.incidentDetail = incident;

        //console.log("user_flag ",this.auth.user_flag);
        //console.log("email ",this.auth.email);
        //console.log("incidentDetail.manager_email ",this.incidentDetail.manager_email);
        //if(this.auth.user_flag == '5' 
        //   && this.auth.email != this.incidentDetail.manager_email
        //   && this.incidentDetail.status_cd != 1
        //   && this.incidentDetail.o){
        //    alert("조회 권한이 없습니다.");
        //}else{
            this.modalService.open(modalId, { windowClass: 'xlModal', centered: true});
        //}
    }

    getEmpInfo(modalId, email){
        this.empEmail = email;
        this.modalService.open(modalId, { windowClass: 'mdModal', centered: true });
    }

    getPopUp(modalId, popup){
        console.log("modalId : ", modalId);
        console.log("popup : ", popup);

        this.popupNotice = popup;
        this.modalService.open(modalId, { windowClass: 'mdModal', centered: true });
    }

    /*
    openBackDropCustomClass(content) {
      this.modalService.open(content, {backdropClass: 'light-blue-backdrop'});
    }
  
    openWindowCustomClass(content) {
  
      this.modalService.open(content, { windowClass: 'dark-modal' });
    }
  
    openSm(content) {
  
      this.modalService.open(content, { size: 'sm' });
    }
  
    openLg(content) {
      this.modalService.open(content, { size: 'lg' });
    }
  
    openVerticallyCentered(content) {
      this.modalService.open(content, { centered: true });
    }
    */

}
