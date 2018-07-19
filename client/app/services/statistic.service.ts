import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class StatisticService {

    constructor(private http: HttpClient,
        private cookieService: CookieService
    ) { }


    /**
     * 
     * @param  
     */
    getComHigher(): Observable<any> {

        //console.log("========addIncident(incident: NgForm): Observable<any>========");
        //console.log("incident : ", incident);
        //console.log("==============================================================");
        
        //var params = new HttpParams().set("yyyy","2018").set("company_cd","ISU_ST").set("mm","*").set("higher_cd","*");
        return this.http.get<any>('/api/statistic/comHigher?yyyy=2018&company_cd=ISU_ST&mm=*&higher_cd=*');
    }

    /**
     * 상태별 건수
     */
    getStatusCdCnt(): Observable<any>{
        return this.http.get<any>('/api/statistic/statusCdCnt');
    }
}
