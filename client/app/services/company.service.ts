import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class CompanyService {

    constructor(private http: HttpClient,
        private cookieService: CookieService
    ) { }

    /**
     * 회사리스트 가져오기 
    */
    
    getCompanyList(condition): Observable<any> {
        console.log("===========================getCompanyList", condition);
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/company/list', {params: httpParams});
    }

    /**
     * 회사 수정
     * @param form 
    */
    putCompany(form:NgForm): Observable<any> {
        return this.http.put<any>('/api/company/update', form.value, {withCredentials:true});
    }

    /**
     * 회사 등록
     * @param qna 
     */
    addCompany(company: NgForm): Observable<any> {
        return this.http.post<any>('/api/company/new', company, {withCredentials:true});
    }

}
