import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CompanyProcessService {

  constructor(private http: HttpClient) { }

    /**
     * 회사업무 업무 Tree조회
     * @param condition 조건
     */
    getCompanyProcessTree(condition): Observable<any> {
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/companyProcess/companyProcessTree', {params: httpParams});
    }

    /**
     * 회사업무 수정
     * @param form 
    */
    putCompanyProcess(form:NgForm): Observable<any> {
       return this.http.put<any>('/api/companyProcess/update', form, {withCredentials:true});
    }

}
