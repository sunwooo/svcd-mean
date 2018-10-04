
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';

@Injectable()
export class Dashboard2Service {

    constructor(private http: HttpClient) { }

    getChart2(condition): Observable<any> {
        console.log("Dashboard2Service getChart2 call!!!");
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/dashboard/chart2', {params: httpParams});
    }


    getChart2_1(condition): Observable<any> {
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/dashboard/chart2_1', {params: httpParams});
    }


}
