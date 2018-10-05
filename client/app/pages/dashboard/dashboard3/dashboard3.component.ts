import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StatisticService } from '../../../services/statistic.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IncidentService } from '../../../services/incident.service';
import { AuthService } from '../../../services/auth.service';
import { QnaService } from '../../../services/qna.service';
import { CookieService } from 'ngx-cookie-service';
import { Dashboard3Service } from '../../../services/dashboard3.service';

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

    public chartData1: any = [];
    public chartData2: any = [];
    public chartData3: any = [];

    public noticeList = [];

    private anyData: any;
    private anyDataForm: any;

    /** being chart setting */
    public view1: any[] = [770, 227];
    public view2: any[] = [700, 225];
    public view3: any[] = [1700, 350];

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
        domain: ['#99ca3c', '#f04124', '#008fd4', '#a7a9ac', '#e5e4e0']
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

    constructor(private auth: AuthService,
        private modalService: NgbModal,
        private dashboardService: Dashboard3Service,
        private incidentService: IncidentService,
        private qnaService: QnaService,
        public cookieService: CookieService) {
    }

    ngOnInit() {


  this.chartData3 = [
    {
      name: "OPTI-HR",
      series: [
        {
          name: "요청자",
          value: 70
        },
        {
          name: "담당자",
          value: 30
        },
        {
            name: "외부담당자",
            value: 30
          }
      ]
    },
    {
      "name": "그룹웨어",
      "series": [
        {
            "name": "요청자",
            "value": 80
          },
          {
            "name": "담당자",
            "value": 32
          },
          {
              "name": "외부담당자",
              "value": 30
            }
      ]
    },
    {
      "name": "SAP ERP",
      "series": [
        {
            "name": "요청자",
            "value": 100
          },
          {
            "name": "담당자",
            "value": 33
          },
          {
              "name": "외부담당자",
              "value": 30
            }
      ]
    },
    {
      "name": "PC 유지보수",
      "series": [
        {
            "name": "요청자",
            "value": 150
          },
          {
            "name": "담당자",
            "value": 35
          },
          {
              "name": "외부담당자",
              "value": 30
            }
      ]
    },
    {
        "name": "OPTI-HR1",
        "series": [
          {
            "name": "요청자",
            "value": 70
          },
          {
            "name": "담당자",
            "value": 30
          },
          {
              "name": "외부담당자",
              "value": 30
            }
        ]
      },
      {
        "name": "그룹웨어2",
        "series": [
          {
              "name": "요청자",
              "value": 80
            },
            {
              "name": "담당자",
              "value": 32
            },
            {
                "name": "외부담당자",
                "value": 30
              }
        ]
      },
      {
        "name": "SAP ERP3",
        "series": [
          {
              "name": "요청자",
              "value": 100
            },
            {
              "name": "담당자",
              "value": 33
            },
            {
                "name": "외부담당자",
                "value": 30
              }
        ]
      },
      {
        "name": "PC 유지보수4",
        "series": [
          {
              "name": "요청자",
              "value": 150
            },
            {
              "name": "담당자",
              "value": 35
            },
            {
                "name": "외부담당자",
                "value": 30
              }
        ]
      }
  ];


    this.getChart();

    }

    /**
     * 년도별 요청/접수 건수
     */
    getChart1(){
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
                    this.chartData1 = tempArr;
                    
                }
                
            },
            (error: HttpErrorResponse) => {
            }
        );
    }


    /**
     * 
     */
    getChart2(){
        this.dashboardService.getChart3_1(this.formData).subscribe(
            (res) => {
            },
            (error: HttpErrorResponse) => {
            }
        );
    }


    /**
     * 업무별 요청자/담당자 수
     */
    getChart3(){
        this.dashboardService.getChart3_2(this.formData).subscribe(
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
                    this.chartData3 = tempArr;
                    
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

        this.formData.yyyy = this.searchYyyy = yyyy;
        this.formData.mm = this.searchMm = mm;
        this.formData.higher_cd = this.searhHigherCd = higher_cd;
        this.formData.company_cd = this.searchCompany = company_cd;

        this.getChart();
    }

    /**
     * 차트 데이타 호출
     */
    getChart(){
        //년도별 요청자/담당자 조회
        this.getChart1();
        //
        this.getChart2();
        //업무별 요청자/담당자 조회
        this.getChart3();
    }

    /**
     * chart 선택 시
     * @param modalId 
     * @param data 
     */
    onSelect(modalId, data) {
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
