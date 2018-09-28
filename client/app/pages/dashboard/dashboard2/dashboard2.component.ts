import { Component, OnInit } from '@angular/core';
import { Dashboard2Service } from '../../../services/dashboard2.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Input, Output } from "@angular/core";

@Component({
  selector: 'app-dashboard2',
  templateUrl: './dashboard2.component.html',
  styleUrls: ['./dashboard2.component.css']
})
export class Dashboard2Component implements OnInit {
  @Input() searchYyyy;
  @Input() searchMm;
  @Input() searhHigherCd;
  @Input() searchCompany;

  private formData: any = {};   //전송용 formData
  public higherObj: any = [];  //상위업무 리스트

  public bubble = [];

  /** being chart setting */
  //public view: any[] = [700, 300];
  public view: any[];
  public width: number = 700;
  public height: number = 300;
  public fitContainer: boolean = false;

  // options
  public showXAxis = true;
  public showYAxis = true;
  public gradient = true;
  public showLegend = true;
  public legendTitle = 'Company';
  public showXAxisLabel = true;
  public tooltipDisabled = false;
  public xAxisLabel = 'Year';
  public showYAxisLabel = true;
  public yAxisLabel = 'Valuation';
  public showGridLines = true;
  public innerPadding = '30%';
  public barPadding = 8;
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
  public showDataLabel = true;

  /*
  public colorScheme = {
  //domain: ['#01579b', '#7aa3e5', '#a8385d', '#00bfa5', '#ffbb00', '#99e000']
    domain: ['#01579b', '#7aa3e5', '#00bfa5', '#e1d248', '#b1b1b1', '#a8385d']
  };
  */


  //public colorScheme = [{name:'OPTI-HR',value:'#e1d248'}];
  //domain: ['#01579b', '#7aa3e5', '#a8385d', '#00bfa5', '#ffbb00', '#99e000']
  //domain: ['#01579b', '#7aa3e5', '#00bfa5', '#e1d248', '#b1b1b1', '#a8385d']
  //};


  constructor(private dashboard2Service: Dashboard2Service
    , private router: Router) { }

  ngOnInit() {

    this.getMaxHigherCnt();

    //this.setColorScheme('cool');
    

    //bubble[]
    //name : 상위업무
    //x: 년도
    //y: 평점
    //r: 요청 건수
    this.bubble = [
      {
        "name": "OPTI-HR",
        "series": [
          {
            "name": "2016",
            "x": "2016",
            "y": 2,
            "r": 3000
          },
          {
            "name": "2017",
            "x": "2017",
            "y": 4.5,
            "r": 3500
          },
          {
            "name": "2018",
            "x": "2018",
            "y": 5,
            "r": 3905
          }
          
        ]
      },
      {
        "name": "PC 및 주변기기 장애",
        "series": [
          {
            "name": "2016",
            "x": "2016",
            "y": 2,
            "r": 600
          },
          {
            "name": "2017",
            "x": "2017",
            "y": 3,
            "r": 1800
          },
          {
            "name": "2018",
            "x": "2018",
            "y": 4,
            "r": 1700
          }
          
        ]
      },
      {
        "name": "그룹웨어",
        "series": [
          {
            "name": "2016",
            "x": "2016",
            "y": 3,
            "r": 1500
          },
          {
            "name": "2017",
            "x": "2017",
            "y": 4,
            "r": 650
          },
          {
            "name": "2018",
            "x": "2018",
            "y": 5,
            "r": 2500
          }
          
        ]
      },
      {
        "name": "SAP ERP",
        "series": [
          {
            "name": "2016",
            "x": "2016",
            "y": 1,
            "r": 500
          },
          {
            "name": "2017",
            "x": "2017",
            "y": 3,
            "r": 800
          },
          {
            "name": "2018",
            "x": "2018",
            "y": 4.5,
            "r": 1000
          }          
        ]
      },
      {
        "name": "오라클 ERP",
        "series": [
          {
            "name": "2016",
            "x": "2016",
            "y": 2,
            "r": 900
          },
          {
            "name": "2017",
            "x": "2017",
            "y": 3,
            "r": 1800
          },
          {
            "name": "2018",
            "x": "2018",
            "y": 4.2,
            "r": 2000
          }          
        ]
      }
      /*
      {
        "name": "Germany",
        "series": [
          {
            "name": "2018",
            "x": "2009-12-31T15:00:00.000Z",
            "y": 5,
            "r": 80.4
          },
          {
            "name": "2017",
            "x": "1999-12-31T15:00:00.000Z",
            "y": 4.5,
            "r": 78
          },
          {
            "name": "2016",
            "x": "1989-12-31T15:00:00.000Z",
            "y": 2,
            "r": 79
          }
        ]
      },
      {
        "name": "United States",
        "series": [
          {
            "name": "2010",
            "x": "2009-12-31T15:00:00.000Z",
            "y": 4,
            "r": 310
          },
          {
            "name": "2000",
            "x": "1999-12-31T15:00:00.000Z",
            "y": 3,
            "r": 283
          },
          {
            "name": "1990",
            "x": "1989-12-31T15:00:00.000Z",
            "y": 2,
            "r": 253
          }
        ]
      },
      {
        "name": "France",
        "series": [
          {
            "name": "2010",
            "x": "2009-12-31T15:00:00.000Z",
            "y": 5,
            "r": 63
          },
          {
            "name": "2000",
            "x": "1999-12-31T15:00:00.000Z",
            "y": 4,
            "r": 59.4
          },
          {
            "name": "1990",
            "x": "1989-12-31T15:00:00.000Z",
            "y": 3,
            "r": 56.9
          }
        ]
      },
      {
        "name": "United Kingdom",
        "series": [
          {
            "name": "2010",
            "x": "2009-12-31T15:00:00.000Z",
            "y": 4.5,
            "r": 62.7
          },
          {
            "name": "2000",
            "x": "1999-12-31T15:00:00.000Z",
            "y": 3,
            "r": 58.9
          },
          {
            "name": "1990",
            "x": "1989-12-31T15:00:00.000Z",
            "y": 1,
            "r": 57.1
          }
        ]
      }*/

    ];
    /*
    if (this.bubble.length > 1) {
      const index = Math.floor(Math.random() * this.bubble.length);
      this.bubble.splice(index, 1);
      this.bubble = [...this.bubble];
    }

    // bubble
      const bubbleYear = Math.floor((2010 - 1990) * Math.random() + 1990);
      const bubbleEntry = {
        name: "AAA",
        series: [
          {
            name: '' + bubbleYear,
            x: new Date(bubbleYear, 0, 1),
            y: Math.floor(30 + Math.random() * 70),
            r: Math.floor(30 + Math.random() * 20)
          }
        ]
      };

      this.bubble = [...this.bubble, bubbleEntry];

      */
  }



  
 
  /**
   * 상위업무(1순위 요청) 조회
  **/

  getMaxHigherCnt() {
    console.log("getMaxHigherCnt function call!!!");
    /*
    this.formData.yyyy = this.searchYyyy;
    this.formData.mm = this.searchMm;
    this.formData.higher_cd = this.searhHigherCd;
    this.formData.company_cd = this.searchCompany;
    */
    //this.formData.yyyy = "2018";
    //this.formData.mm = "*";
    this.formData.higher_cd = "*";
    this.formData.company_cd = "*";
    //this.dashboard2Service.getMaxHigherCnt({ scope: "*" }).subscribe(
    this.dashboard2Service.getChart2(this.formData).subscribe(

      (res) => {

        this.higherObj = res;
        for (var i = 0; i < this.higherObj.length; i++) {
            /**
             * {
                "name": "OPTI-HR",
                "series": [
                  {
                    "name": "2016",
                    "x": "2016",
                    "y": 2,
                    "r": 3000
                  },
                  {
                    "name": "2017",
                    "x": "2017",
                    "y": 4.5,
                    "r": 3500
                  },
                  {
                    "name": "2018",
                    "x": "2018",
                    "y": 5,
                    "r": 3905
                  }
                  
                ]
              },
             */
            //var text = { id: "" + this.higherObj[i].company_cd + "", itemName: "" + this.higherObj[i].company_nm + "" };
            var text = { name: "" + this.higherObj[i]._id.higher_nm + "", series:  "" + this.higherObj[i].totalCnt + "" };

            console.log("this.higherObj[i].grp.length :" , this.higherObj[i].grp.length);

            console.log("this.higherObj[0].grp.register_yyyy :" , this.higherObj[0].grp.register_yyyy);
            console.log("this.higherObj[0].grp.count :" , this.higherObj[i].grp[0].count);

            console.log("this.higherObj[1].grp.register_yyyy :" , this.higherObj[1].grp.register_yyyy);
            console.log("this.higherObj[1].grp.count :" , this.higherObj[i].grp[1].count);


            console.log("text :" + JSON.stringify(text));

            
    
            //{"name":"OPTI-HR","series":"12028"}
            

            //this.dropdownList.push(text);
        }
        
        //console.log("getCompany res ====>" , JSON.stringify(res));
        //console.log("getCompany res ====>" , JSON.stringify(res));
        /*
        this.companyObj = res;
        for (var i = 0; i < this.companyObj.length; i++) {

            var text = { id: "" + this.companyObj[i].company_cd + "", itemName: "" + this.companyObj[i].company_nm + "" };
            //console.log("text :" + text);
            // {id:"7",itemName:"France"},

            this.dropdownList.push(text);
        }
          */
      },
      (error: HttpErrorResponse) => {
      }
    );
  }

}
