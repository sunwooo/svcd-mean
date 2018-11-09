
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';

@Injectable()
export class CommonApiService {

    public headers:any;
    constructor(private auth: AuthService
              , private http: HttpClient  
    ){
        this.headers = new HttpHeaders().set('Authorization', this.auth.getToken());
    }

    /**
     * 상위업무 JSON 조회
     * @param condition 조건
     */
    getHigher(condition): Observable<any> {
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/higherProcess', {headers: this.headers, params: httpParams});
    }

    /**
     * 하위업무 JSON 조회
     * @param condition 조건
     */
    getLower(condition): Observable<any> {
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/lowerProcess', {headers: this.headers, params: httpParams});
    }

    /**
     * 본인업무 JSON 조회
     * @param condition 조건
     */
    getMyProcess(): Observable<any> {
        var httpParams = new HttpParams({ fromObject: {}});
        return this.http.get<any>('/api/myProcess', {headers: this.headers, params: httpParams});
    }

    /**
     * 등록요청 년도 조회
     */
    getRegisterYyyy(): Observable<any> {
        var httpParams = new HttpParams({ fromObject: {}});
        return this.http.get<any>('/api/registerYyyy', {headers: this.headers, params: httpParams});
    }

    /**
     * 회사리스트 JSON 조회
     * @param condition 조건
     */
    getCompany(condition): Observable<any> {
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/company', {headers: this.headers, params: httpParams});
    }

    /**
     * 진행상태 JSON 조회
     * @param condition 조건
     */
    getProcessStatus(condition): Observable<any> {
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/processStatus', {headers: this.headers, params: httpParams});
    }

    /**
     * 진행상태 JSON 조회
     * @param condition 조건
     */
    getProcessGubun(condition): Observable<any> {
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/processGubun', {headers: this.headers, params: httpParams});
    }

}
