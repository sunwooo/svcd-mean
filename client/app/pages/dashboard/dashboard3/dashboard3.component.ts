import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StatisticService } from '../../../services/statistic.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IncidentService } from '../../../services/incident.service';
import { AuthService } from '../../../services/auth.service';
import { QnaService } from '../../../services/qna.service';
import { CookieService } from 'ngx-cookie-service';
import { Dashboard3Service } from '../../../services/dashboard3.service';
import { ajaxPatch, ajaxGetJSON } from 'rxjs/internal-compatibility';

@Component({
    selector: 'app-dashboard3',
    templateUrl: './dashboard3.component.html',
    styleUrls: ['./dashboard3.component.css']
})
export class Dashboard3Component implements OnInit {

    @Input() searchYyyy;
    @Input() searchMm;
    @Input() searhHigherCd;
    @Input() searchCompany;
  
    private formData: any = {};   //전송용 formData
    public higherObj: any = [];  //상위업무 리스트

    public chartData3: any = [];
    public chartData3_1: any = [];
    public chartData3_2: any = [];
    public chartData3_3: any = [];
    public chartData3_4: any = [];
    public chartData3_5: any = [];

    public noticeList = [];

    private anyData: any;
    private anyDataForm: any;

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
        domain: ['#008fd4', '#b4985a', '#99ca3c', '#a7a9ac', '#f04124']
    };

    public colorScheme2_1 = {
        domain: ['#b4985a']
    };

    public colorScheme2_2 = {
        domain: ['#99ca3c']
    };

    public colorScheme2_3 = {
        domain: ['#008fd4']
    };

    public colorScheme2_4 = {
        domain: ['#f04124']
    };

    public colorScheme3 = {
        domain: ['#99ca3c', '#f04124', '#008fd4', '#a7a9ac', '#e5e4e0']
    };


    // line, area
    autoScale = true;
    /** end chart setting */

    public statusChart1 = [{ "name": "접수대기", "value": 0 }, { "name": "처리중", "value": 0 }];
    public statusChart2 = [{ "name": "미평가", "value": 0 }, { "name": "평가완료", "value": 0 }];

    public statusCntData;

    public valuationChart = [];
    public monthlyCntChart = [];
    public higherCntChart = [];
    public incidentList;
    public incidentDetail: any;                 //선택 인시던트 id
    public empEmail: string = "";               //팝업 조회용 이메일
    public popupNotice: string = "";            //팝업 조회용 QNA공지

    public aaa = [
        {
          "name": "홍길동",
          "value": 50
        },
        {
          "name": "이순신",
          "value": 45
        },
        {
          "name": "춘향이",
          "value": 30
        },
        {
          "name": "이도령",
          "value": 29
        },
        {
          "name": "변사또",
          "value": 25
        }
      ];


    constructor(private auth: AuthService,
        private modalService: NgbModal,
        private dashboardService: Dashboard3Service,
        private incidentService: IncidentService,
        private qnaService: QnaService,
        public cookieService: CookieService) {
    }

    ngOnInit() {
        var date = new Date();
        this.searchYyyy = date.getFullYear();
        this.getChart();

    }

    
    /**
     * 차트 데이타 호출
     */
    getChart(){

        this.formData.yyyy = this.searchYyyy;
        this.formData.mm = this.searchMm;
        this.formData.higher_cd = this.searhHigherCd;
        this.formData.company_cd = this.searchCompany;

        this.getChart3();
        this.getChart3_1();
        this.getChart3_2();
        this.getChart3_3();
        this.getChart3_4();
        this.getChart3_5();
    }


    /**
     * 년도별 요청/접수 건수
     */
    getChart3(){
        this.chartData3 = [];
        this.dashboardService.getChart3(this.formData).subscribe(
            (res) => {
                
                //console.log("=======================================");
                //console.log("res : ",res);
                //console.log("=======================================");

                var dataArr = res;
                var tempArr = [];
                if(dataArr){
                    dataArr.forEach((data) => {
                        var obj1: any = {};
                       
                        var series = [];
                        var reqCnt: any = {};
                        var mngCnt: any = {};
                        
                        reqCnt.name = "요청자";
                        reqCnt.value = data.req;
                        series.push(reqCnt);
                        
                        mngCnt.name = "담당자";
                        mngCnt.value = data.mng;
                        series.push(mngCnt);

                        obj1.name = data._id.register_yyyy; //년도
                        obj1.series = series;

                        tempArr.push(obj1);

                    });
                    this.chartData3 = tempArr;
                    
                }
                
            },
            (error: HttpErrorResponse) => {
            }
        );
    }


    /**
     * 년도별 요청자 상위5
     */
    getChart3_1(){
        this.chartData3_1 = [];
        this.dashboardService.getChart3_1(this.formData).subscribe(
            (res) => {
                
                //console.log("=======================================");
                //console.log("getChart3_1() res : ",res);
                //console.log("=======================================");
                
                var dataArr = res;
                var tempArr = [];
                if(dataArr){
                    dataArr.forEach((data) => {
                        var obj1: any = {};
                        obj1.name = data._id.request_nm;
                        obj1.value = data.count;
                        obj1.id = data._id.request_id;
                        tempArr.push(obj1);
                    });
                    this.chartData3_1 = tempArr;
                }
            },
            (error: HttpErrorResponse) => {
            }
        );
    }

    /**
     * 년도별 접수자 상위5
     */
    getChart3_2(){
        this.chartData3_2 = [];
        this.dashboardService.getChart3_2(this.formData).subscribe(
            (res) => {

                //console.log("=======================================");
                //console.log("getChart3_2() res : ",res);
                //console.log("=======================================");
                
                var dataArr = res;
                var tempArr = [];
                if(dataArr){
                    dataArr.forEach((data) => {
                        var obj1: any = {};
                        obj1.name = data._id.manager_nm;
                        obj1.value = data.count;
                        tempArr.push(obj1);
                    });
                    this.chartData3_2 = tempArr;
                }
            },
            (error: HttpErrorResponse) => {
            }
        );
    }

    /**
     * 년도별 만족도 상위5
     */
    getChart3_3(){
        this.chartData3_3 = [];
        this.dashboardService.getChart3_3(this.formData).subscribe(
            (res) => {

                //console.log("=======================================");
                //console.log("getChart3_3() res : ",res);
                //console.log("=======================================");
                
                var dataArr = res;
                var tempArr = [];
                if(dataArr){
                    dataArr.forEach((data) => {
                        var obj1: any = {};
                        obj1.name = data._id.request_nm;
                        obj1.value =  Number((data.avg).toFixed(2));
                        tempArr.push(obj1);
                    });
                    this.chartData3_3 = tempArr;
                }


            },
            (error: HttpErrorResponse) => {
            }
        );
    }

    /**
     * 년도별 요청자 하위5
     */
    getChart3_4(){
        this.chartData3_4 = [];
        this.dashboardService.getChart3_4(this.formData).subscribe(
            (res) => {

                //console.log("=======================================");
                //console.log("getChart3_4() res : ",res);
                //console.log("=======================================");
                
                var dataArr = res;
                var tempArr = [];
                if(dataArr){
                    dataArr.forEach((data) => {
                        var obj1: any = {};
                        obj1.name = data._id.request_nm;
                        obj1.value =  Number((data.avg).toFixed(2));
                        tempArr.push(obj1);
                    });
                    this.chartData3_4 = tempArr;
                }


            },
            (error: HttpErrorResponse) => {
            }
        );
    }


    /**
     * 업무별 요청자/담당자 수
     */
    getChart3_5(){
        this.chartData3_5 = [];
        this.dashboardService.getChart3_5(this.formData).subscribe(
            (res) => {
                
                //console.log("=======================================");
                //console.log("res : ",res);
                //console.log("=======================================");

                var dataArr = res;
                var tempArr = [];
                if(dataArr){
                    dataArr.forEach((data) => {
                        var obj1: any = {};
                       
                        var series = [];
                        var reqCnt: any = {};
                        var mngCnt: any = {};
                        
                        reqCnt.name = "요청자";
                        reqCnt.value = data.req;
                        series.push(reqCnt);
                        
                        mngCnt.name = "담당자";
                        mngCnt.value = data.mng;
                        series.push(mngCnt);

                        obj1.name = data._id.higher_nm; //업무명
                        obj1.series = series;

                        tempArr.push(obj1);

                    });
                    this.chartData3_5 = tempArr;
                    
                }
                
            },
            (error: HttpErrorResponse) => {
            }
        );
    }

    /**
     * 인터페이스용 API(부모에서 호출)
     */
    reload(yyyy, mm, higher_cd, company_cd){

        this.searchYyyy = yyyy;
        this.searchMm = mm;
        this.searhHigherCd = higher_cd;
        this.searchCompany = company_cd;

        this.getChart();
    }


    /**
     * chart 선택 시
     * @param modalId 
     * @param data 
     */
    onSelect3(modalId, data) {
        console.log('Item clicked', data);
        this.modalService.open(modalId, { size: 'lg' });
    }

    /**
     * chart 선택 시
     * @param modalId 
     * @param data 
     */
    onSelect3_1(modalId, data) {
        console.log('Item clicked', data);
        console.log('Item clicked', data);
        this.modalService.open(modalId, { size: 'lg' });
    }

    /**
     * 요청자/담당자 정보
     * @param modalId 
     * @param email 
     */
    getEmpInfo(modalId, email) {
        this.empEmail = email;
        this.modalService.open(modalId, { windowClass: 'mdModal', centered: true });
    }




    onLegendLabelClick(entry) {
        console.log('Legend clicked', entry);
    }

    select(data) {
        console.log('Item clicked', data);
    }
}
