import { Component, OnInit } from '@angular/core';
import { StatisticService } from '../../../services/statistic.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-com-higher',
    templateUrl: './com-higher.component.html',
    styleUrls: ['./com-higher.component.scss']
})
export class ComHigherComponent implements OnInit {

    public isLoading = true;
    public sData = null;

    constructor(
        private statisticService: StatisticService
    ) { }

    ngOnInit() {
        this.isLoading = false;
        this.getData();
    }

    getData() {

        this.statisticService.getComHigher().subscribe(
            (res) => {
                this.sData = res;
                console.log("sData : ", this.sData);
            },
            (error: HttpErrorResponse) => {
            }
        );
    }

}
