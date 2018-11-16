import { Component, OnInit } from '@angular/core';
import {AuthService} from '../Services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent implements OnInit {

  authStatus: boolean;
  hide = true;

  constructor(private authService: AuthService, private  router: Router) { }

  ngOnInit() {
      this.authStatus = this.authService.isAuth;
  }

    onSignIn() {
      this.authService.signIn();
      this.authStatus = this.authService.isAuth;
      this.router.navigate(['home']);
    }

    onSignOut() {
        this.authService.signOut();
        this.authStatus = this.authService.isAuth;
    }

}
