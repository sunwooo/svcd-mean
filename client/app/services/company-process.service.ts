import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyProcessService {

    public headers:any;
    constructor(private auth: AuthService
              , private http: HttpClient  
    ){
        this.headers = new HttpHeaders().set('Authorization', this.auth.getToken());
    }

    /**
     * 회사업무 업무 Tree조회
     * @param condition 조건
     */
    getCompanyProcessTree(condition): Observable<any> {
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/companyProcess/companyProcessTree', {headers: this.headers, params: httpParams});
    }

    /**
     * 회사업무 수정
     * @param form 
    */
    putCompanyProcess(form:NgForm): Observable<any> {
       return this.http.put<any>('/api/companyProcess/update', form, {headers: this.headers, withCredentials:true});
    }

}
