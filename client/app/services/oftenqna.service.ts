import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class OftenqnaService {

    constructor(private http: HttpClient,
        private cookieService: CookieService
    ) { }

    /**
     * OftenqnaList 가져오기 
    */
    
    getOftenqnaList(condition): Observable<any> {
        console.log("===========================getOftenqnaList", condition);
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/oftenqna/list', {params: httpParams});
    }

    /**
     * 회사정보 수정
     * @param form 
    */
    //putCompany(form: NgForm): Observable<any> {
    //    return this.http.put<any>('/api/company/update', form.value, {withCredentials:true});
    //}

}
