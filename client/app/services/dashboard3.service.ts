
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';

@Injectable()
export class Dashboard3Service {

    constructor(private http: HttpClient) { }

    /**
     * 년도별 요청자/담당자 수
     * @param condition
     */
    getChart3(condition): Observable<any> {
        console.log("====================================================================");
        console.log("====================================================================");
        console.log("====================================================================");
        console.log("====================================================================");
        console.log("====================================================================");
        console.log("====================================================================");
        console.log("Dashboard3Service getChart3 call!!!");
        
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/dashboard3/chart3', {params: httpParams});
    }


    getChart3_1(condition): Observable<any> {
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/dashboard3/chart3_1', {params: httpParams});
    }


}
