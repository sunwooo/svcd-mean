import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { NgForm } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class IncidentService {

    constructor(private http: HttpClient,
        private cookieService: CookieService
    ) { }

    getUserIncident(condition): Observable<any> {
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/incident/userlist', {params: httpParams});
    }

    /**
     * 
     * @param incident 
     */
    addIncident(incident: NgForm): Observable<any> {
        return this.http.post<any>('/api/incident/new', incident, {withCredentials:true});
    }
    
    /**
     * 
     * @param incident_id 
     */
    getIncidentDetail(incident_id: string): Observable<any> {
        return this.http.get<any>('/api/incident/detail', {params: new HttpParams().set('incident_id',incident_id)});
    }


    putValuation(valuation: NgForm): Observable<any>{
        return this.http.put<any>('/api/incident/valuation', valuation.value, {withCredentials:true});
    }

    delete(incidentId): Observable<any>{
        var body = {id:incidentId};
        var httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: body
        };
        return this.http.delete<any>('/api/incident/delete', httpOptions);
    }

    /**
     * 파일 다운로드
     * @param filepath
     */
    fileDownLoad(filepath){
        var body = {filepath:filepath};
        var headers = new HttpHeaders().append('Content-Type','application/json');
        return this.http.post('/api/incident/download', body, {responseType : 'blob', headers : headers});
    }
}
