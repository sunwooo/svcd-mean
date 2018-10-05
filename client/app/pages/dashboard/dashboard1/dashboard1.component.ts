import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Dashboard1Service } from '../../../services/dashboard1.service';

@Component({
    selector: 'app-dashboard1',
    templateUrl: './dashboard1.component.html',
    styleUrls: ['./dashboard1.component.css']
})
export class Dashboard1Component implements OnInit {

    // being chart setting
    private formData: any = {};   //전송용 formData
    public monthlyCntChart = [];
    public higherObj: any = [];  //상위업무 리스트
    public selectedItem;                        //차트 선택 시 아이템명
    public view3: any[] = [880, 350];
    public chartData3: any[];

    // line, area
    autoScale = true;

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

    public colorScheme3 = {
        domain: ['#008fd4', '#b4985a', '#99ca3c', '#a7a9ac', '#f04124']
    };

    constructor(private dashboard1Service: Dashboard1Service) { }

    ngOnInit() {
        //월별 요청 건수
        this.dashboard1Service.getChart1(this.formData).subscribe(
            (res) => {
                console.log("res : ", res);

                var yearArray = res;
                var yearTmp = [];
                yearArray.forEach((yyyy, yIdx, result) => {
                    var tmp = new Array(yyyy.series.length);
                    yyyy.series.forEach((mm, mIdx) => {
                        tmp.splice(Number(mm.name) - 1, 1, { name: mm.name, value: mm.value });
                    });
                    yearTmp.push({ name: yyyy.name, series: tmp });
                    //yearTmp.push({ series: tmp });
                });
                this.monthlyCntChart = yearTmp;
                console.log("monthlyCntChart : ", this.monthlyCntChart);
            },
            (error: HttpErrorResponse) => {
                console.log('error :', error);
            }
        );


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
    }

    /**
     * 차트 선택 시
     * @param modalId 
     * @param data 
     */
    onSelect(modalId, data) {
        this.formData = data;
        //console.log("onSelect this.formData : ", this.formData);
        /*
        this.selectedItem = data.name;
        this.modalService.open(modalId, { windowClass: 'xxlModal', centered: true});
        */

        //월별 요청 건수 상위 리스트
        this.dashboard1Service.getChart1_1(this.formData).subscribe(
            (res) => {

                console.log("=======================================");
                console.log("res : ", res);
                console.log("=======================================");

                var dataArr = res;
                var tempArr = [];
                var series = [];


                dataArr.forEach((data) => {
                    var obj1: any = {};
                   
                    var series = [];
                    console.log("=========================================");
                    console.log("===================data ",data);
                    console.log("=========================================");
                    /*
                    data.grp.forEach((higher)=>{
                        var higherObj: any = {};
                        higherObj.name = higher.higher_nm;
                        higherObj.
                    })
                    
                    
                    var Cnt1: any = {};
                    var Cnt2: any = {};
                    var Cnt2: any = {};
                    



                    reqCnt.name = "요청자";
                    reqCnt.value = data.req;
                    series.push(reqCnt);
                    
                    mngCnt.name = "담당자";
                    mngCnt.value = data.mng;
                    series.push(mngCnt);

                    obj1.name = data._id.higher_nm; //업무명
                    obj1.series = series;

                    tempArr.push(obj1);
                    */

                });


                /*
                if (dataArr) {
                    

              
                    for (var i = 0; i < dataArr.length; i++) {
                        var obj1: any = {};
                        var higherCnt: any = {};

                       
                        for (var j = 0; j < 3; j++) {
                            if (dataArr[i].grp[j] == null) {
                                higherCnt = {
                                    name: "",
                                    value: 0
                                };
                            } else {
                                higherCnt = {
                                    name: "" + dataArr[i].grp[j].request_company_nm + "",
                                    value: "" + Number((dataArr[i].grp[j].count).toFixed(2)) + ""
                                };
                            }
                            console.log("dataArr["+i+"].grp["+j+"] : ", dataArr[i].grp[j]);
                            
                        }
                        

                        console.log("series : ", series);

                        obj1.name = 0[i]._id.higher_nm;
                        obj1.series = higherCnt;

                        tempArr.push(obj1);

                    }
                    

                    console.log("tempArr : ", tempArr);

                    //this.chartData3 = tempArr;

                }
                */
            },
            (error: HttpErrorResponse) => {
                console.log('error :', error);
            }
        );
    }

    onLegendLabelClick(entry) {
        console.log('Legend clicked', entry);
    }

    select(data) {
        console.log('Item clicked', data);
    }

}
