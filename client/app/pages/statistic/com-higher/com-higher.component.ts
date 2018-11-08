import { Component, OnInit } from '@angular/core';
import { StatisticService } from '../../../services/statistic.service';
import { HttpErrorResponse } from '@angular/common/http';

export interface Transaction {
  item: string;
  cost1: number;
  cost2: number;
  cost3: number;
  cost4: number;
  cost5: number;
  cost6: number;
  cost7: number;
}



@Component({
    selector: 'app-com-higher',
    templateUrl: './com-higher.component.html',
    styleUrls: ['./com-higher.component.scss']
})
export class ComHigherComponent implements OnInit {

    public isLoading = true;
    public sData = null;

    displayedColumns: string[] = ['회사명', '상위업무명', '총요청건수', '처리중건수', '해결건수', '미해결건수', '해결률(%)', '평점' ];
    
    transactions:any;
    

    constructor(
        private statisticService: StatisticService
    ) { }

    getTotalCost() {
        //return this.transactions.map(t => t.cost1).reduce((acc, value) => acc + value, 0);
       
    }

    ngOnInit() {
        this.isLoading = false;
        this.getData();
    }

    getData() {

        this.statisticService.getComHigher().subscribe(
            (res) => {
                this.sData = res;
                console.log("sData : ", this.sData);
                console.log("sData.length : ", this.sData.length);
                //displayedColumns: string[] = ['회사명', '상위업무명', '총요청건수', '처리중건수', '해결건수', '미해결건수', '해결률(%)', '평점' ];
                //console.log("this.sData._id.request_company_nm : ", this.sData[0]._id.request_company_nm);
                //console.log("this.sData._id.higher_nm : ", this.sData[0]._id.higher_nm);
                var rowArray=[];
                for(var i = 0 ; i < this.sData.length ; i++){
                    var row :any = {};
                    row.item = this.sData[i]._id.request_company_nm;
                    row.cost1 = this.sData[i]._id.higher_nm;
                    row.cost2 = this.sData[i].totalCnt;
                    row.cost3 = this.sData[i].stCnt2;
                    row.cost4 = this.sData[i].stCnt3_4;
                    row.cost5 = Number(this.sData[i].totalCnt - this.sData[i].stCnt3_4);
                    row.cost6 = this.sData[i].solRatio;
                    row.cost7 = this.sData[i].valAvg;

                    //console.log("row : ", row);
                    rowArray.push(row);
                    
                    
                }
                this.transactions = rowArray;

                console.log("transactions : ", JSON.stringify(this.transactions));
                //this.transactions = this.transactions;
                //console.log("transactions : ", JSON.stringify(this.transactions));

                //this.transactions = [{"item":"[그룹]주식회사 이수시스템","cost1":"그룹웨어","cost2":22,"cost3":0,"cost4":22,"cost5":0,"cost6":"100.00","cost7":"5.00"},{"item":"주식회사 이수시스템","cost1":"그룹웨어","cost2":15,"cost3":1,"cost4":14,"cost5":1,"cost6":"93.33","cost7":"5.00"},{"item":"[그룹]주식회사 이수시스템","cost1":"PC 및 주변기기 장애","cost2":1,"cost3":0,"cost4":1,"cost5":0,"cost6":"100.00","cost7":0},{"item":"주식회사 이수시스템","cost1":"PC 및 주변기기 장애","cost2":2,"cost3":0,"cost4":2,"cost5":0,"cost6":"100.00","cost7":0},{"item":"주식회사 이수시스템","cost1":"건설 ERP","cost2":1,"cost3":0,"cost4":1,"cost5":0,"cost6":"100.00","cost7":"5.00"},{"item":"[그룹]주식회사 이수시스템","cost1":"건설 ERP","cost2":1,"cost3":0,"cost4":1,"cost5":0,"cost6":"100.00","cost7":"Infinity"},{"item":"[그룹]주식회사 이수시스템","cost1":"OPTI-HR","cost2":25,"cost3":4,"cost4":21,"cost5":4,"cost6":"84.00","cost7":"5.00"},{"item":"주식회사 이수시스템","cost1":"OPTI-HR","cost2":2,"cost3":0,"cost4":2,"cost5":0,"cost6":"100.00","cost7":"5.00"},{"item":"[그룹]주식회사 이수시스템","cost1":"SAP ERP","cost2":34,"cost3":0,"cost4":34,"cost5":0,"cost6":"100.00","cost7":"5.00"},{"item":"주식회사 이수시스템","cost1":"SAP ERP","cost2":8,"cost3":0,"cost4":8,"cost5":0,"cost6":"100.00","cost7":"5.00"},{"item":"[그룹]주식회사 이수시스템","cost1":"계정관리","cost2":13,"cost3":0,"cost4":13,"cost5":0,"cost6":"100.00","cost7":0},{"item":"주식회사 이수시스템","cost1":"계정관리","cost2":1,"cost3":0,"cost4":1,"cost5":0,"cost6":"100.00","cost7":0},{"item":"[그룹]주식회사 이수시스템","cost1":"BI","cost2":2,"cost3":0,"cost4":2,"cost5":0,"cost6":"100.00","cost7":0},{"item":"주식회사 이수시스템","cost1":"보안","cost2":1,"cost3":0,"cost4":1,"cost5":0,"cost6":"100.00","cost7":0}];
                
                
                /*
                this.transactions = 
                [{item: 'Beach ball', cost1: 4, cost2: 4, cost3: 4, cost4: 4, cost5: 4,cost6: 4,cost7: 4},
                {item: 'Towel', cost1: 5, cost2: 4, cost3: 4, cost4: 4, cost5: 4,cost6: 4,cost7: 4},
                {item: 'Frisbee', cost1: 2, cost2: 4, cost3: 4, cost4: 4, cost5: 4,cost6: 4,cost7: 4},
                {item: 'Sunscreen', cost1: 4,cost2: 4, cost3: 4, cost4: 4, cost5: 4,cost6: 4,cost7: 4},
                {item: 'Cooler', cost1: 25,cost2: 4, cost3: 4, cost4: 4, cost5: 4,cost6: 4,cost7: 4},
                {item: 'Swim suit', cost1: 15,cost2: 4, cost3: 4, cost4: 4, cost5: 4,cost6: 4,cost7: 4}];
                */
            },
            (error: HttpErrorResponse) => {
            }
        );
    }

}
