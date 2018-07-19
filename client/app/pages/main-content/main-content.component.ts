import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StatisticService } from '../../services/statistic.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
    selector: 'app-main-content',
    templateUrl: './main-content.component.html',
    styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit {

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

    public single1 = [
        {
            "name": "접수대기",
            "value": 10
        },
        {
            "name": "처리중",
            "value": 20
        },
    ];
    public single2 = [
        {
            "name": "처리완료",
            "value": 2222
        },
        {
            "name": "미평가",
            "value": 3333
        },
    ];

    public single3 = [
        {
            "name": "매우 만족",
            "value": 100
        },
        {
            "name": "만족",
            "value": 2000
        },
        {
            "name": "보통",
            "value": 500
        },
        {
            "name": "불만족",
            "value": 200
        },
        {
            "name": "매우 불만족",
            "value": 10
        },
    ];


    public multi = [
        {
            "name": "2017",
            "series": [
                {
                    "name": "1월",
                    "value": 153
                },
                {
                    "name": "2월",
                    "value": 134
                },
                {
                    "name": "3월",
                    "value": 454
                },
                {
                    "name": "4월",
                    "value": 432
                },
                {
                    "name": "5월",
                    "value": 777
                },
                {
                    "name": "6월",
                    "value": 689
                },
                {
                    "name": "7월",
                    "value": 575
                },
                {
                    "name": "8월",
                    "value": 567
                },
                {
                    "name": "9월",
                    "value": 453
                },
                {
                    "name": "10월",
                    "value": 567
                },
                {
                    "name": "11월",
                    "value": 453
                },
                {
                    "name": "12월",
                    "value": 567
                }
            ]
        },

        {
            "name": "2018",
            "series": [
                {
                    "name": "1월",
                    "value": 453
                },
                {
                    "name": "2월",
                    "value": 567
                },
                {
                    "name": "3월",
                    "value": 453
                },
                {
                    "name": "4월",
                    "value": 567
                },
                {
                    "name": "5월",
                    "value": 453
                },
                {
                    "name": "6월",
                    "value": 567
                },
                {
                    "name": "7월",
                    "value": 453
                },
                {
                    "name": "8월",
                    "value": 0
                },
                {
                    "name": "9월",
                    "value": 0
                },
                {
                    "name": "10월",
                    "value": 0
                },
                {
                    "name": "11월",
                    "value": 0
                },
                {
                    "name": "12월",
                    "value": 0
                }
            ]
        }
    ];

    public single5 = [
        {
            "name": "e-HR",
            "value": 2222
        },
        {
            "name": "그룹웨어",
            "value": 1700
        },
        {
            "name": "ERP",
            "value": 900
        },
        {
            "name": "건설ERP",
            "value": 800
        },
        {
            "name": "SP",
            "value": 600
        },
    ];

    public activeEntries = [{
        "name": "그룹웨어",
        "value": 1700
    }]

    constructor(private modalService: NgbModal,
        private statisticService: StatisticService) {
    }

    ngOnInit() {
        this.getStatusCdCnt();
    }

    /**
     * 상태별 건수
     */
    getStatusCdCnt(){
        this.statisticService.getStatusCdCnt().subscribe(
            (res) => {
                console.log("res : ",res);
            },
            (error: HttpErrorResponse) => {
            }
        );
    }

    onSelect(data) {
        console.log('Item clicked', data);
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
      alert(1);
      this.modalService.open(content, { centered: true });
    }
    */

}
