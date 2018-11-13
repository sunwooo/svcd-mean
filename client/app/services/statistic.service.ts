import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';

@Injectable()
export class StatisticService {

    public headers:any;
    constructor(private auth: AuthService
              , private http: HttpClient 
               
    ){
        this.headers = new HttpHeaders().set('Authorization', this.auth.getToken());
    }

    /**
     * 
     * @param  
     */
    getComHigher(): Observable<any> {

        //console.log("========addIncident(incident: NgForm): Observable<any>========");
        //console.log("incident : ", incident);
        //console.log("==============================================================");
        
        //var params = new HttpParams().set("yyyy","2018").set("company_cd","ISU_ST").set("mm","*").set("higher_cd","*");
        return this.http.get<any>('/api/statistic/comHigher?yyyy=2018&company_cd=ISU_ST&mm=*&higher_cd=*', {headers: this.headers});
    }

    /**
     * 상태별 건수
     */
    getStatusCdCnt(): Observable<any>{
        return this.http.get<any>('/api/statistic/statusCdCnt', {headers: this.headers});
    }

    /**
     * 만족도 현황
     */
    valuationCnt(condition): Observable<any> {
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/statistic/valuationCnt', {headers: this.headers, params: httpParams});
    }

    /**
     * 월별 건수
     */
    monthlyCnt(): Observable<any>{
        return this.http.get<any>('/api/statistic/monthlyCnt',{headers: this.headers});
    }
    
    /**
     * 신청건수 상위 업무
     */
    higherCnt(condition): Observable<any> {
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/statistic/higherCnt', {headers: this.headers, params: httpParams});
    }

    
}
