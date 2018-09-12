import { Component, OnInit, Input, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventEmitter } from "@angular/core";
import { escape } from "querystring";
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.css']
})
export class PopUpComponent implements OnInit {

  @Input() popNotice : string;
  @Input() cValues;  //모달창 닫기용
  @Input() dValues;  //모달창 무시용
  @Output() closeEvent = new EventEmitter<any>(); //삭제 후 다시 조회를 위한 이벤트

  public isLoading = true;
  public pop_day;

  constructor(public cookieService: CookieService) { }

  ngOnInit() {
    this.isLoading = false;


  }

  /**
   * 모달 닫기
  */
  closeModal($event) {
      this.cValues('Close click');
  }


  /**
   * 하루동안 열지 않기
   */
  closePopup(id) {
    
      var expiredDate = new Date();
      expiredDate.setDate( expiredDate.getDate() + 1 );
  
      if(this.pop_day){
        console.log("1 this.pop_day : ", this.pop_day);
        this.cookieService.set(id,'N', expiredDate );
      }else{
        console.log("2 this.pop_day : ", this.pop_day);
        this.cookieService.set(id,'Y', expiredDate );
      }

      console.log("this.cookieService.getAll()>>>>>>>>>>>>>>>", this.cookieService.getAll());
      this.cValues('Close click');

  }
  
}