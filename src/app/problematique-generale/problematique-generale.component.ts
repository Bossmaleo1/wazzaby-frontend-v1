import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../Services/auth.service';

export interface Section {
    name: string;
    updated: Date;
}

@Component({
  selector: 'app-problematique-generale',
  templateUrl: './problematique-generale.component.html',
  styleUrls: ['./problematique-generale.component.scss']
})
export class ProblematiqueGeneraleComponent implements OnInit {

  constructor(private  router: Router, private authService: AuthService) { }

    problematiques: Section[] = [
        {
            name: 'Meloncolique',
            updated: new Date('1/1/16'),
        },
        {
            name: 'Sport',
            updated: new Date('1/17/16'),
        },
        {
            name: 'Politique',
            updated: new Date('1/28/16'),
        },
        {
            name: 'Business',
            updated: new Date('1/28/16'),
        },
        {
            name: 'Religion',
            updated: new Date('1/28/16'),
        },
        {
            name: 'Famille',
            updated: new Date('1/28/16'),
        },
        {
            name: 'Musique',
            updated: new Date('1/28/16'),
        },
        {
            name: 'Fete/Ceremonie/Evenement',
            updated: new Date('1/28/16'),
        },
        {
            name: 'Arts',
            updated: new Date('1/28/16'),
        }
    ];


  ngOnInit() {
  }

  OnBack() {
    this.router.navigate(['home']);
  }

  OnDeconnect() {
    this.authService.signOut();
    this.router.navigate(['connexion']);
  }

}
