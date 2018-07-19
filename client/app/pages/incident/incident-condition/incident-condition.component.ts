import { Component, OnInit } from '@angular/core';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import { MatDatepickerInputEvent, MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-incident-condition',
  templateUrl: './incident-condition.component.html',
  styleUrls: ['./incident-condition.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'ko-KR'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class IncidentConditionComponent implements OnInit {

    selectedOptions;

    date = new FormControl(new Date());
    serializedDate = new FormControl((new Date()).toISOString());

    taskTypeAreas: {
        name: string;
        selected: boolean;
    }[] = [
        {
            name: 'Area 1',
            selected: false
        },
        {
            name: 'Area 2',
            selected: false
        },
        {
            name: 'Area 3',
            selected: true
        },
    ];

    minDate = new Date(2015, 0, 1);
    maxDate = new Date(2030, 0, 1);

    events: string[] = [];

    addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
        //this.events.push(`${type}: ${event.value}`);
        console.log("========== addEvent ============");
        console.log("type : ", type, "event : ", event.value);
        console.log("================================");


    }

    myFilter = (d: Date): boolean => {
        const day = d.getDay();
        console.log("day : ", day);
        // Prevent Saturday and Sunday from being selected.
        return day !== 0 && day !== 6;
    }

    constructor() {

    }

    ngOnInit() {
    }

    onAreaListControlChanged(list) {
        //this.selectedOptions = list.selectedOptions.selected.map(item => item.value);
    }

    onNgModelChange(event) {

    }

}
