
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';

@Injectable()
export class Dashboard3Service {

    public headers:any;
    constructor(private auth: AuthService
              , private http: HttpClient  
    ){
        this.headers = new HttpHeaders().set('Authorization', this.auth.getToken());
    }

    /**
     * 년도별 요청자/담당자 수
     * @param condition
     */
    getChart3(condition): Observable<any> {
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/dashboard/chart3', {headers: this.headers, params: httpParams});
    }

    /**
     * 년도별 요청자 상위5
     * @param condition 
     */
    getChart3_1(condition): Observable<any> {
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/dashboard/chart3_1', {headers: this.headers, params: httpParams});
    }

    /**
     * 년도별 접수자 상위5
     * @param condition 
     */
    getChart3_2(condition): Observable<any> {
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/dashboard/chart3_2', {headers: this.headers, params: httpParams});
    }

    /**
     * 년도별 만족도 상위5
     * @param condition 
     */
    getChart3_3(condition): Observable<any> {
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/dashboard/chart3_3', {headers: this.headers, params: httpParams});
    }

    /**
     * 년도별 요청자 하위5
     * @param condition 
     */
    getChart3_4(condition): Observable<any> {
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/dashboard/chart3_4', {headers: this.headers, params: httpParams});
    }

    /**
     * 업무별 요청자/담당자 수
     */
    getChart3_5(condition): Observable<any> {
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/dashboard/chart3_5', {headers: this.headers, params: httpParams});
    }

}
