import { Component, OnInit, Input } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Dashboard1Service } from '../../../services/dashboard1.service';

@Component({
    selector: 'app-dashboard1',
    templateUrl: './dashboard1.component.html',
    styleUrls: ['./dashboard1.component.css']
})
export class Dashboard1Component implements OnInit {

    @Input() searchYyyy;
    @Input() searchMm;
    @Input() searhHigherCd;
    @Input() searchCompany;

    // being chart setting
    private formData: any = {};   //전송용 formData
    public monthlyCntChart = [];
    public higherObj: any = [];  //상위업무 리스트
    public selectedItem;                        //차트 선택 시 아이템명
    public view3: any[] = [1750, 350];
    public chartData3: any[];
    public comCntChart = [];
    public precessCntChart = [];

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
        this.getChart();
    }


    /**
     * 인터페이스용 API(부모에서 호출)
     */
    reload(yyyy, mm, higher_cd, company_cd) {

        this.searchYyyy = yyyy;
        this.searchMm = mm;
        this.searhHigherCd = higher_cd;
        this.searchCompany = company_cd;

        this.getChart();
    }

    /**
     * 차트 데이타 호출
     */
    getChart() {

        this.formData.yyyy = this.searchYyyy;
        this.formData.mm = this.searchMm;
        this.formData.higher_cd = this.searhHigherCd;
        this.formData.company_cd = this.searchCompany;

        this.getChart1();
        this.getChart2();
        this.getChart3();
        this.getChart4();
    }

    /**
     * 월별 요청 건수
     */
    getChart1() {
        this.dashboard1Service.getChart1(this.formData).subscribe(
            (res) => {
                //console.log("res : ", res);

                var yearArray = res;
                var yearTmp = [];
                yearArray.forEach((yyyy, yIdx, result) => {
                    var tmp = new Array(yyyy.series.length);
                    //console.log("yyyy.series : ", yyyy.series);

                    yyyy.series.forEach((mm, mIdx) => {
                        tmp.splice(Number(mm.name) - 1, 1, { name: mm.name, value: mm.value });
                    });
                    yearTmp.push({ name: yyyy.name, series: tmp });
                    //yearTmp.push({ series: tmp });
                });
                this.monthlyCntChart = yearTmp;
                //console.log("monthlyCntChart : ", this.monthlyCntChart);
            },
            (error: HttpErrorResponse) => {
                console.log('error :', error);
            }
        );
    }

    /**
     * 요청 건수 상위 리스트
     */
    getChart2() {
        this.dashboard1Service.getChart1_1(this.formData).subscribe(
            (res) => {

                //console.log("=======================================");
                //console.log("res : ", res);
                //console.log("=======================================");

                var dataArr = res;
                var tempArr = [];

                dataArr.forEach((data) => {
                    var obj1: any = {};

                    var series = [];
                    
                    var loopCnt = 0;
                    data.grp.forEach((company)=>{

                        if(loopCnt == 5){
                            return;
                        }
                        var cmp: any = {};
                        cmp.name = company.request_company_nm;
                        cmp.value = company.count;
                        series.push(cmp);

                        loopCnt++;

                    });

                    obj1.name = data._id.higher_nm; //업무명
                    obj1.series = series;

                    //console.log("=========================================");
                    //console.log("===================obj1 ", obj1);
                    //console.log("=========================================");

                    tempArr.push(obj1);

                    //console.log("=========================================");
                    //console.log("===================tempArr ", tempArr);
                    //console.log("=========================================");
                });
                this.chartData3 = tempArr;
                //console.log("=========================================");
                //console.log("===================this.chartData3 ", this.chartData3);
                //console.log("=========================================");

            },
            (error: HttpErrorResponse) => {
                console.log('error :', error);
            }
        );
    }

    /**
     * 건수별 상위 업체 리스트
     */
    getChart3() {
        this.dashboard1Service.getChart1_2(this.formData).subscribe(
            (res) => {
                this.comCntChart = res;
            },
            (error : HttpErrorResponse) => {

            }
        )
    }

    /**
     * 건수별 상위 업체 리스트
     */
    getChart4() {
        this.dashboard1Service.getChart1_3(this.formData).subscribe(
            (res) => {
                //console.log("res !!!!!!!!! : ", res);
                this.precessCntChart = res;
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
        //console.log("onSelect this.formData : ", this.formData);
    }

    onLegendLabelClick(entry) {
        console.log('Legend clicked', entry);
    }

    select(data) {
        console.log('Item clicked', data);
    }

}
