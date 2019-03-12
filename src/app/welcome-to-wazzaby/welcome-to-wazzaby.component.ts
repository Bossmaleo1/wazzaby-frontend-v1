import { Component, OnInit } from '@angular/core';
import {ProblematiqueItemService} from '../Services/problematique.item.service';

@Component({
  selector: 'app-welcome-to-wazzaby',
  templateUrl: './welcome-to-wazzaby.component.html',
  styleUrls: ['./welcome-to-wazzaby.component.scss']
})
export class WelcomeToWazzabyComponent implements OnInit {

  constructor(private problematiqueitemservice: ProblematiqueItemService) { }

  ngOnInit() {
  }

}
