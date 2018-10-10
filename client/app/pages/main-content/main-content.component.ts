import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StatisticService } from '../../services/statistic.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IncidentService } from '../../services/incident.service';
import { AuthService } from '../../services/auth.service';
import { QnaService } from '../../services/qna.service';
import { CookieService } from 'ngx-cookie-service';
import { PopUpComponent } from '../../shared/pop-up/pop-up.component';


@Component({
    selector: 'app-main-content',
    templateUrl: './main-content.component.html',
    styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit {

    //@ContentChild(PopUpComponent) noticeModal: any;
    @ViewChild('popupModal1') noticeModal1:ElementRef;
    @ViewChild('popupModal2') noticeModal2:ElementRef;
    @ViewChild('popupModal3') noticeModal3:ElementRef;
    @ViewChild('popupModal4') noticeModal4:ElementRef;
    @ViewChild('popupModal5') noticeModal5:ElementRef;
    public noticeList =  [];

    private anyData: any;
    private anyDataForm: any; 

    /** being chart setting */
    public view1: any[] = [350, 200];
    public view2: any[] = [700, 200];
    public view3: any[] = [880, 300];

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
    public selectedItem;                        //차트 선택 시 아이템명
    public incidentDetail: any;                 //선택 인시던트 id
    public empEmail: string = "";               //팝업 조회용 이메일
    public popupNotice: string = "";            //팝업 조회용 QNA공지

    constructor(private auth: AuthService,
        private modalService: NgbModal,
        private statisticService: StatisticService,
        private incidentService: IncidentService,
        private qnaService: QnaService,
        public cookieService: CookieService){
    }

    ngOnInit() {
        
        //상태별 건수
        this.statisticService.getStatusCdCnt().subscribe(
            (res) => {  
                
                var initChart1 = [{"name":"접수대기", "value":0},
                              {"name":"처리중", "value":0},];
                var initChart2 = [{"name":"미평가", "value":0},
                              {"name":"처리완료", "value":0}];

                var statusArray = res;

                statusArray.forEach((val, idx) => {
                    var chartIdx = parseInt(val._id.status_cd)-1;
                    if(chartIdx < 2) {//접수대기, 처리중 차트에 매핑
                        initChart1[chartIdx].value = val.count;
                    } else {          //미평가, 처리완료 차트에 매핑
                        initChart2[chartIdx-2].value = val.count;
                    }
                });
                this.statusChart1 = initChart1;
                this.statusChart2 = initChart2;
            },
            (error: HttpErrorResponse) => {
            }
        );

        //만족도현황
        this.statisticService.valuationCnt().subscribe(
            (res) => {

                var initChart1 = [{"name":"매우만족", "value":0},
                                  {"name":"만족", "value":0},
                                  {"name":"보통", "value":0},
                                  {"name":"불만족", "value":0},
                                  {"name":"매우불만족", "value":0}];

                var valuationArray = res;
                valuationArray.forEach((val, idx) => {
                    var chartIdx = 5-parseInt(val.valuation);
                    initChart1[chartIdx].value = val.value;
                });
                this.valuationChart = initChart1;
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
        condition.user = 'manager';

        condition.status_cd = '*';
        condition.company_cd = '*';
        //condition.register_yyyy = this.register_yyyy;
        condition.higher_cd = '*';
        condition.lower_cd = '*';        


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
                //console.log("res:", res.oftenqna);
                //console.log("this.noticeModal : ", this.noticeModal1);
                var loopCnt =5;
                this.noticeList = res.oftenqna;
                if(this.noticeList.length <5){
                    loopCnt = this.noticeList.length;
                }
                for(var i = 0 ; i < loopCnt ; i++){
                    if(this.noticeList[i]){
                        //console.log('xxxxxxxxxx',this.noticeList[i]._id);
                        //console.log('xxxxxxxxxx',this.cookieService.get(this.noticeList[i]._id));
                        var ck = this.cookieService.get(this.noticeList[i]._id);

                        if(i == 0 && ck != 'N')
                            this.modalService.open(this.noticeModal1,  { windowClass: 'mdModal', centered: true, backdrop: 'static', keyboard: false });
                        if(i == 1 && ck != 'N')
                            this.modalService.open(this.noticeModal2,  { windowClass: 'mdModal', centered: true, backdrop: 'static', keyboard: false  });
                        if(i == 2 && ck != 'N')
                            this.modalService.open(this.noticeModal3,  { windowClass: 'mdModal', centered: true, backdrop: 'static', keyboard: false  });
                        if(i == 3 && ck != 'N')
                            this.modalService.open(this.noticeModal4,  { windowClass: 'mdModal', centered: true, backdrop: 'static', keyboard: false  });
                        if(i == 4 && ck != 'N')
                            this.modalService.open(this.noticeModal5,  { windowClass: 'mdModal', centered: true, backdrop: 'static', keyboard: false  });
                    }
                }
            },
            (error : HttpErrorResponse) => {

            }
        )

    }

    /**
     * 차트 선택 시
     * @param modalId 
     * @param data 
     */
    onSelect(modalId, data) {
        console.log("onSelect : ", modalId, data);
        
        var user_flag = this.cookieService.get("user_flag");
        if(user_flag == '1' || user_flag == '2' || user_flag == '3'){
            this.selectedItem = data.name;
            this.modalService.open(modalId, { windowClass: 'xxlModal', centered: true});
        }
        
    }

    /**
     * 요청사항 선택 시
     * @param modalId 
     * @param incident 
     */
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

    /**
     * 등록자, 담당자 선택 시
     * @param modalId 
     * @param email 
     */
    getEmpInfo(modalId, email){
        this.empEmail = email;
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
