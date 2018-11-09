import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';

@Injectable()
export class IncidentService {

    public headers:any;
    constructor(private auth: AuthService
              , private http: HttpClient  
    ){
        this.headers = new HttpHeaders().set('Authorization', this.auth.getToken());
    }

    /**
     * 문의내역 조회
     * @param condition 
     */
    getIncident(condition): Observable<any> {
        

        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/incident/list', {headers: this.headers, params: httpParams});
    }

    /**
     * 문의내역 excel data 조회
     * @param condition 
     */
    getExcelData(condition): Observable<any> {
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/incident/excelData', {headers: this.headers, params: httpParams});
    }

    /**
     * 문의하기 등록
     * @param incident 
     */
    addIncident(incident: NgForm): Observable<any> {
        return this.http.post<any>('/api/incident/new', incident, {headers: this.headers, withCredentials:true});
    }
    
    /**
     * 문의하기 상세보기
     * @param incident_id 
     */
    getIncidentDetail(incident_id: string): Observable<any> {
        return this.http.get<any>('/api/incident/detail', {headers: this.headers, params: new HttpParams().set('incident_id',incident_id)});
    }

    /**
     * 상위업무 변경
     * @param incident
     */
    setChangeHigher(incident: NgForm): Observable<any>{
        return this.http.put<any>('/api/incident/changeHigher', incident.value, {headers: this.headers, withCredentials:true});
    }

    /**
     * 업무 접수
     * @param incident
     */
    setReceipt(incident: NgForm): Observable<any>{
        return this.http.put<any>('/api/incident/receipt', incident.value, {headers: this.headers, withCredentials:true});
    }

    /**
     * 업무 완료
     * @param incident
     */
    setComplete(incident: NgForm): Observable<any>{
        return this.http.put<any>('/api/incident/complete', incident, {headers: this.headers, withCredentials:true});
    }

    /**
     * 업무 미완료
     * @param incident
     */
    setNComplete(incident: NgForm): Observable<any>{
        return this.http.put<any>('/api/incident/n_complete', incident.value, {headers: this.headers, withCredentials:true});
    }    

    /**
     * 업무 협의
     * @param incident
     */
    setHold(incident: NgForm): Observable<any>{
        return this.http.put<any>('/api/incident/hold', incident.value, {headers: this.headers, withCredentials:true});
    } 

    /**
     * 만족도 평가
     * @param valuation
     */
    setValuation(incident: NgForm): Observable<any>{
        return this.http.put<any>('/api/incident/valuation', incident.value, {headers: this.headers, withCredentials:true});
    }

    /**
     * 삭제하기
     * @param incidentId
     */
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
        headers.set('Authorization', this.auth.getToken());
        return this.http.post('/api/incident/download', body, {responseType : 'blob', headers : headers});
    }

    /**
     * 파일 삭제
     * @param incident
     */
    fileUpdate(incident){
        return this.http.put<any>('/api/incident/update', incident, {headers: this.headers, withCredentials:true});
    }

    /**
     * Dashboard용 Incident 조회
     * @param condition 
     */
    getIncidentDashboard(condition): Observable<any> {//getIncidentDashboard
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/incident/dashboard_list', {headers: this.headers, params: httpParams});
    }
}
