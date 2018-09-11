import { Component, OnInit, Input, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventEmitter } from "@angular/core";

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

  constructor() { }

  ngOnInit() {
   //console.log("popNotice : ", this.popNotice);
    //if(this.popup != ""){
 
      //this.getEmpInfo(this.popup);
    //}
    this.isLoading = false;
  }

  /**
   * 모달 닫기
  */
  closeModal($event) {
      this.cValues('Close click');
  }

}