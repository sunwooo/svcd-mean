import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';

@Injectable()
export class CompanyService {

    public headers:any;
    constructor(private auth: AuthService
              , private http: HttpClient  
    ){
        this.headers = new HttpHeaders().set('Authorization', this.auth.getToken());
    }

    /**
     * 회사리스트 가져오기 
    */
    
    getCompanyList(condition): Observable<any> {
        //console.log("===========================getCompanyList", condition);
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/company/list', {headers: this.headers, params: httpParams});
    }

    /**
     * 회사 수정
     * @param form 
    */
    putCompany(form:NgForm): Observable<any> {
        return this.http.put<any>('/api/company/update', form.value, {headers: this.headers, withCredentials:true});
    }

    /**
     * 회사 등록
     * @param company 
     */
    addCompany(company: NgForm): Observable<any> {
        return this.http.post<any>('/api/company/new', company, {headers: this.headers, withCredentials:true});
    }

    /**
     * 회사 삭제
     * @param companyId
     */
    delete(companyId): Observable<any>{
        var body = {_id:companyId};
        var httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: body
        };
        return this.http.delete<any>('/api/company/delete', httpOptions);
    }

}
