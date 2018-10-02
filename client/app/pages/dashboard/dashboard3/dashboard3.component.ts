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

    public chartData1: any[];
    public chartData2: any[];
    public chartData3: any[];

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


  this.chartData1 = [
    {
      "name": "2015",
      "series": [
        {
          "name": "요청자",
          "value": 70
        },
        {
          "name": "담당자",
          "value": 30
        }
      ]
    },
    {
      "name": "2016",
      "series": [
        {
            "name": "요청자",
            "value": 80
          },
          {
            "name": "담당자",
            "value": 32
          }
      ]
    },
    {
      "name": "2017",
      "series": [
        {
            "name": "요청자",
            "value": 100
          },
          {
            "name": "담당자",
            "value": 33
          }
      ]
    },
    {
      "name": "2018",
      "series": [
        {
            "name": "요청자",
            "value": 150
          },
          {
            "name": "담당자",
            "value": 35
          }
      ]
    }
  ];


  this.chartData3 = [
    {
      "name": "OPTI-HR",
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


    //년도별 요청자/담당자 조회
    this.getChart1();

    }

    /**
     * 년도별 요청/접수 건수
     */
    getChart1(){
        this.dashboardService.getChart3(this.formData).subscribe(
            (res) => {

                /*
                var initChart1 = [{ "name": "접수대기", "value": 0 },
                { "name": "처리중", "value": 0 },];
                var initChart2 = [{ "name": "미평가", "value": 0 },
                { "name": "처리완료", "value": 0 }];

                var statusArray = res;

                statusArray.forEach((val, idx) => {
                    var chartIdx = parseInt(val._id.status_cd) - 1;
                    if (chartIdx < 2) {//접수대기, 처리중 차트에 매핑
                        initChart1[chartIdx].value = val.count;
                    } else {          //미평가, 처리완료 차트에 매핑
                        initChart2[chartIdx - 2].value = val.count;
                    }
                });
                this.statusChart1 = initChart1;
                this.statusChart2 = initChart2;
                */
            },
            (error: HttpErrorResponse) => {
            }
        );
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
