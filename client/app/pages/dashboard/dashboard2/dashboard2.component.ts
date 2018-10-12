import { Component, OnInit } from '@angular/core';
import { Dashboard2Service } from '../../../services/dashboard2.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Input, Output } from "@angular/core";
import { getOrCreateChangeDetectorRef } from '@angular/core/src/render3/di';
import { CookieService } from 'ngx-cookie-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-dashboard2',
    templateUrl: './dashboard2.component.html',
    styleUrls: ['./dashboard2.component.css']
})
export class Dashboard2Component implements OnInit {
    @Input() searchYyyy;
    @Input() searchMm;
    @Input() searhHigherCd;
    @Input() searhHigherNm;
    @Input() searchCompany;

    private formData: any = {};   //전송용 formData
    public higherObj: any = [];  //상위업무 리스트

    public bubble: any = [];
    public single: any = [];
    public com_high: any = [];
    public com_low: any = [];
    public valuationChart = [];

    public selectedItem;                        //차트 선택 시 아이템명
    

    /** being chart setting */
    //public view: any[] = [700, 300];
    //public view: any[];
    //public width: number = 700;
    //public height: number = 300;
    public fitContainer: boolean = false;

    // options
    //1
    public showXAxis = true;
    public showYAxis = true;
    public gradient = true;
    public showLegend = true;
    public legendTitle = 'Company';
    public showXAxisLabel = true;
    public tooltipDisabled = false;
    public showYAxisLabel = true;
    public yAxisLabel = 'Valuation';
    public showGridLines = true;
    public innerPadding = '30%';
    public barPadding = 20;
    public groupPadding = 16;
    public roundDomains = true;
    public maxRadius = 20;
    public minRadius = 3;
    public showSeriesOnHover = true;
    public roundEdges: boolean = true;
    public animations: boolean = true;
    public xScaleMin: any;
    public xScaleMax: any;
    public yScaleMin: number;
    public yScaleMax: number;
    public autoScale = true;

    //2
    public gradient2: boolean = false;
    public showLegend2 = false;
    public xAxisLabel2 = 'Task';
    public showXAxisLabel2 = true;
    public showYAxisLabel2 = true;
    public legendTitle2 = 'Task';
    public showDataLabel: boolean = false;


    /*
    //3 Combo Chart
    barChart: any[] = this.barChart;
    //public barChart :any = [];
    lineChartSeries: any[] = this.lineChartSeries;
    lineChart: any[] = this.lineChart;
    lineChartScheme = {
      name: 'coolthree',
      selectable: true,
      group: 'Ordinal',
      //domain: ['#01579b', '#7aa3e5', '#a8385d', '#00bfa5']
      domain: ['#a8385d', '#7aa3e5', '#a27ea8', '#aae3f5']
    };
  
    comboBarScheme = {
      name: 'singleLightBlue',
      selectable: true,
      group: 'Ordinal',
      domain: ['#01579b']
    };
    */



    public colorScheme = {
        //domain: ['#01579b', '#7aa3e5', '#a8385d', '#00bfa5', '#ffbb00', '#99e000']
        domain: ['#a8385d', '#7aa3e5', '#a27ea8', '#aae3f5', '#adcded', '#a95963'
            , '#bf9d76', '#e99450', '#d89f59', '#f2dfa7', '#a5d7c6', '#7794b1'
            , '#647c8a', '#3f51b5', '#a7b61a', '#DBED91']
    };

    public colorScheme2 = {
        domain: ['#7aa3e5']
        //domain: ['#01579b', '#7aa3e5', '#a8385d', '#00bfa5', '#ffbb00', '#99e000']
        //domain: ['#a8385d', '#7aa3e5', '#a27ea8', '#aae3f5', '#adcded', '#a95963'] 
        //,'#bf9d76','#e99450','#d89f59','#f2dfa7','#a5d7c6','#7794b1'
        //,'#647c8a', '#3f51b5','#a7b61a', '#DBED91']
    };

    public colorScheme3 = {
        domain: ['#a8385d']
        //domain: ['#01579b', '#7aa3e5', '#a8385d', '#00bfa5', '#ffbb00', '#99e000']
        //domain: ['#a8385d', '#7aa3e5', '#a27ea8', '#aae3f5', '#adcded', '#a95963'] 
        //,'#bf9d76','#e99450','#d89f59','#f2dfa7','#a5d7c6','#7794b1'
        //,'#647c8a', '#3f51b5','#a7b61a', '#DBED91']
    };

    public colorScheme4 = {
        domain: ['#008fd4', '#b4985a', '#99ca3c', '#a7a9ac', '#f04124']
    };



    //public colorScheme = [{name:'OPTI-HR',value:'#e1d248'}];
    //domain: ['#01579b', '#7aa3e5', '#a8385d', '#00bfa5', '#ffbb00', '#99e000']
    //domain: ['#01579b', '#7aa3e5', '#00bfa5', '#e1d248', '#b1b1b1', '#a8385d']
    //};


    constructor(private dashboard2Service: Dashboard2Service
        , private router: Router
        , public cookieService: CookieService
        , private modalService: NgbModal) { }

    ngOnInit() {

        var date = new Date();
        this.searchYyyy = date.getFullYear();
        this.getChart();

        //this.setColorScheme('cool');

        //bubble[]
        //상위 5개 만족도 조회
        //name : 상위업무
        //x: 년도
        //y: 평점
        //r: 요청건수

        //single[]
        //업무별 만족도 조회

    }

    /**
     * 차트 데이타 호출
     */
    getChart(){

        this.formData.yyyy = this.searchYyyy;
        this.formData.mm = this.searchMm;
        this.formData.higher_cd = this.searhHigherCd;
        this.formData.company_cd = this.searchCompany;

        this.getValuation_1();  //상위 5개 만족도 조회
        this.getValuation_5();  //조건별 만족도 조회
        this.getValuation_2();  //업무별 만족도 조회
        this.getValuation_3();  //회사별 만족도 조회 (상위)
        this.getValuation_4();  //회사별 만족도 조회 (하위)

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
     * 상위업무 5개 만족도 현황 조회
    **/
    getValuation_1() {
        //console.log("getMaxHigherCnt function call!!!");
        //console.log("bbbbbbbbbbbbbb this.searchYyyy :", this.searchYyyy);
        //this.formData.yyyy = this.searchYyyy;
        this.formData.mm = this.searchMm;
        this.formData.higher_cd = this.searhHigherCd;
        this.formData.company_cd = this.searchCompany;

        //console.log("this.formData >>>>>>>>>", this.formData);

        //this.formData.yyyy = "2018";
        //this.formData.mm = "*";
        //this.formData.higher_cd = "*";
        //this.formData.company_cd = "*";
        //this.dashboard2Service.getMaxHigherCnt({ scope: "*" }).subscribe(
        this.dashboard2Service.getChart2(this.formData).subscribe(

            (res) => {

                this.higherObj = res;
                //console.log("this.higherObj.length : ", this.higherObj.length);
                var tmpBubble = [];
                for (var i = 0; i < this.higherObj.length; i++) {
                    var obj1: any = {};
                    obj1.name = this.higherObj[i]._id.higher_nm;
                    //console.log("obj1 : ", obj1);
                    var series = [];
                    for (var j = 0; j < this.higherObj[i].grp.length; j++) {
                        var obj2: any = {};
                        obj2.name = this.higherObj[i].grp[j].register_yyyy;
                        obj2.x = this.higherObj[i].grp[j].register_yyyy;
                        /**Y축에 Count가 나오도록*/
                        //obj2.y = this.higherObj[i].grp[j].count;
                        //obj2.r = (this.higherObj[i].grp[j].avg).toFixed(2);
                        /**Y축에 Valuation이 나오도록*/
                        obj2.y = Number((this.higherObj[i].grp[j].avg).toFixed(2));

                        //obj2.y = 100*j*i;

                        obj2.r = this.higherObj[i].grp[j].count;
                        //console.log("obj2 : ", obj2);
                        series.push(obj2);
                        //console.log("series : ", series);

                    }
                    obj1.series = series;
                    //console.log("obj1 : ", obj1);
                    tmpBubble.push(obj1);
                    //console.log("tmpBubble : ", JSON.stringify(tmpBubble));  
                }
                this.bubble = tmpBubble;

                //alert(JSON.stringify(this.bubble));
            },
            (error: HttpErrorResponse) => {
            },
            () => {
                //console.log("this.searchYyyy1 : ", this.searchYyyy);
                //console.log("this.searchMm1 : ", this.searchMm);
                //console.log("this.searhHigherCd1 : ", this.searhHigherCd);
                //console.log("this.searchCompany1 : ", this.searchCompany);
            }
        );
    }

    /**
     * 업무별 만족도 현황 조회
    **/
    getValuation_2() {

        this.formData.yyyy = this.searchYyyy;
        //this.formData.mm = this.searchMm;
        this.formData.higher_cd = this.searhHigherCd;
        this.formData.company_cd = this.searchCompany;

        //console.log("this.formData >>>>>>>>>", JSON.stringify(this.formData));


        this.dashboard2Service.getChart2_1(this.formData).subscribe(
            (res) => {

                this.higherObj = res;

                var tmpSingle = [];

                for (var i = 0; i < this.higherObj.length; i++) {
                    for (var j = 0; j < this.higherObj[i].grp.length; j++) {
                        if (this.higherObj[i].grp[j].register_yyyy == this.searchYyyy) {
                            //obj1.value =  Number((this.higherObj[i].grp[j].avg).toFixed(1));
                            var obj1 = { name: "" + this.higherObj[i]._id.higher_nm + "", value: "" + Number((this.higherObj[i].grp[j].avg).toFixed(2)) + "" };
                            //console.log("obj1 : >>>>>>>>>", obj1);
                        }
                    }
                    tmpSingle.push(obj1);
                }
                this.single = tmpSingle;
            },
            (error: HttpErrorResponse) => {
            },
            () => {
                //console.log("this.searchYyyy2 : ", this.searchYyyy);
                //console.log("this.searchMm2 : ", this.searchMm);
                //console.log("this.searhHigherCd2 : ", this.searhHigherCd);
                //console.log("this.searchCompany2 : ", this.searchCompany);
            }
        );
    }

    /**
     * 회사별 만족도 현황 조회(상위10개사)
    **/
    getValuation_3() {

        this.formData.yyyy = this.searchYyyy;
        this.formData.mm = this.searchMm;
        this.formData.higher_cd = this.searhHigherCd;
        this.formData.company_cd = this.searchCompany;

        //console.log("this.formData >>>>>>>>>", JSON.stringify(this.formData));


        this.dashboard2Service.getChart2_2(this.formData).subscribe(
            (res) => {

                this.higherObj = res;

                var tmpCom1 = [];

                for (var i = 0; i < this.higherObj.length; i++) {
                    for (var j = 0; j < this.higherObj[i].grp.length; j++) {
                        if (this.higherObj[i].grp[j].register_yyyy == this.searchYyyy) {
                            var obj1 = { name: "" + this.higherObj[i]._id.company_nm + "", value: "" + Number((this.higherObj[i].grp[j].avg).toFixed(2)) + "" };
                            //console.log("obj1 : >>>>>>>>>", JSON.stringify(obj1));
                        }
                    }
                    tmpCom1.push(obj1);

                }
                this.com_high = tmpCom1;
                //console.log("this.com1 : ", JSON.stringify(this.com_high));  
            },
            (error: HttpErrorResponse) => {
            },
            () => {
                /*
                console.log("this.searchYyyy2 : ", this.searchYyyy);
                console.log("this.searchMm2 : ", this.searchMm);
                console.log("this.searhHigherCd2 : ", this.searhHigherCd);
                console.log("this.searchCompany2 : ", this.searchCompany);
                */
            }
        );
    }

    /**
     * 회사별 만족도 현황 조회(하위10개사)
    **/
    getValuation_4() {

        this.formData.yyyy = this.searchYyyy;
        this.formData.mm = this.searchMm;
        this.formData.higher_cd = this.searhHigherCd;
        this.formData.company_cd = this.searchCompany;

        //console.log("this.formData >>>>>>>>>", JSON.stringify(this.formData));


        this.dashboard2Service.getChart2_3(this.formData).subscribe(
            (res) => {

                this.higherObj = res;

                var tmpCom2 = [];

                for (var i = 0; i < this.higherObj.length; i++) {
                    for (var j = 0; j < this.higherObj[i].grp.length; j++) {
                        if (this.higherObj[i].grp[j].register_yyyy == this.searchYyyy) {
                            //obj1.value =  Number((this.higherObj[i].grp[j].avg).toFixed(1));
                            var obj1 = { name: "" + this.higherObj[i]._id.company_nm + "", value: "" + Number((this.higherObj[i].grp[j].avg).toFixed(2)) + "" };
                            //console.log("obj1 : >>>>>>>>>", JSON.stringify(obj1));
                        }
                    }
                    tmpCom2.push(obj1);

                }
                this.com_low = tmpCom2;
                //console.log("this.com1 : ", JSON.stringify(this.com_low));
            },
            (error: HttpErrorResponse) => {
            },
            () => {
                /*
                console.log("this.searchYyyy2 : ", this.searchYyyy);
                console.log("this.searchMm2 : ", this.searchMm);
                console.log("this.searhHigherCd2 : ", this.searhHigherCd);
                console.log("this.searchCompany2 : ", this.searchCompany);
                */
            }
        );
    }

    /**
     * 조건별 만족도 현황 조회
    **/
    getValuation_5() {

        this.formData.yyyy = this.searchYyyy;
        this.formData.mm = this.searchMm;
        this.formData.higher_cd = this.searhHigherCd;
        this.formData.company_cd = this.searchCompany;

        this.dashboard2Service.getChart2_4(this.formData).subscribe(
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
        );
    }

    /**
     * 차트 선택 시
     * @param modalId 
     * @param data 
     */
    onSelect(modalId, data) {
        console.log("onSelect : ", modalId, data);
        
        this.selectedItem = data.name;
        this.modalService.open(modalId, { windowClass: 'xxlModal', centered: true});
        
    }

    onLegendLabelClick(entry) {
        console.log('Legend clicked', entry);
    }

    select(data) {
        console.log('Item clicked', data);
    }

}
