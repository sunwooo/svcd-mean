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

    /*
    getCompanyList(condition): Observable<any> {
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/company/list', {params: httpParams});
    }
    */

   getCompanyList(condition): Observable<any> {


    console.log("===========================getCompanyList", condition);
    var httpParams = new HttpParams({ fromObject: condition });
    return this.http.get<any>('/api/company/list', {params: httpParams});
  }

}
