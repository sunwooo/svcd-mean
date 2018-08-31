import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {  TreeviewItem, TreeviewConfig } from 'ngx-treeview';

@Component({
    selector: 'app-my-process',
    templateUrl: './my-process.component.html',
    styleUrls: ['./my-process.component.css']
})
export class MyProcessComponent implements OnInit {

    public config = {
        hasAllCheckBox: true,
        hasFilter: false,
        hasCollapseExpand: false,
        decoupleChildFromParent: false,
        maxHeight: 500
    }

    public items: TreeviewItem[];

    constructor() { 
        
    }

    ngOnInit() {
        var a = new TreeviewItem({
            text: 'IT', value: 9, children: [
                {
                    text: 'Programming', value: 91, children: [{
                        text: 'Frontend', value: 911, children: [
                            { text: 'Angular 1', value: 9111 },
                            { text: 'Angular 2', value: 9112 },
                            { text: 'ReactJS', value: 9113 }
                        ]
                    }, {
                        text: 'Backend', value: 912, children: [
                            { text: 'C#', value: 9121 },
                            { text: 'Java', value: 9122 },
                            { text: 'Python', value: 9123, checked: false }
                        ]
                    }]
                },
                {
                    text: 'Networking', value: 92, children: [
                        { text: 'Internet', value: 921 },
                        { text: 'Security', value: 922 }
                    ]
                }
            ]
        });
        this.items[0] = a;
    }

    onSubmit() {
    }

    onSelectedChange(higher) {
    }

    onFilterChange(higher) {
    }

    setHigher(higher){

    }

}

