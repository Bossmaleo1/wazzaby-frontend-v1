import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-problematique-item',
  templateUrl: './problematique-item.component.html',
  styleUrls: ['./problematique-item.component.scss']
})
export class ProblematiqueItemComponent implements OnInit {

    @Input() id: number;
    @Input() name: string;

  constructor() { }

  ngOnInit() {
  }

}
