
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';

@Injectable()
export class Dashboard1Service {

    constructor(private http: HttpClient) { }

    getChart1(condition): Observable<any> {
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/dashboard1/chart1', {params: httpParams});
    }


    getChart1_1(condition): Observable<any> {
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/dashboard1/chart1_1', {params: httpParams});
    }


}
