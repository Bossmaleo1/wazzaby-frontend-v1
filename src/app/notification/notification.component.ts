import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../Services/auth.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  constructor(private  router: Router, private authService: AuthService) { }

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
