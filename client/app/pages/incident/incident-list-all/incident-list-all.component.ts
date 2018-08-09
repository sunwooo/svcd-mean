import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-incident-list-all',
  templateUrl: './incident-list-all.component.html',
  styleUrls: ['./incident-list-all.component.scss']
})
export class IncidentListAllComponent implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

}
 