import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class UsermanageService {

    constructor(private http: HttpClient,
        private cookieService: CookieService
    ) { }

    getUsermanageList(condition): Observable<any> {

    console.log("==================services getUsermanageList", condition);
    var httpParams = new HttpParams({ fromObject: condition });
    return this.http.get<any>('/api/user/list', {params: httpParams});
  }

}
