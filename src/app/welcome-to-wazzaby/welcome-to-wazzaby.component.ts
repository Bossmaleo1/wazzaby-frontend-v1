import { Component, OnInit } from '@angular/core';
import {ProblematiqueItemService} from '../Services/problematique.item.service';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../Services/auth.service';
import {MatSnackBar} from '@angular/material';
import {ConstanceService} from '../Services/Constance.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-welcome-to-wazzaby',
  templateUrl: './welcome-to-wazzaby.component.html',
  styleUrls: ['./welcome-to-wazzaby.component.scss']
})
export class WelcomeToWazzabyComponent implements OnInit {

    afficher_spinner = false;

  constructor(private problematiqueitemservice: ProblematiqueItemService
      , private httpClient: HttpClient
      , private authService: AuthService
      , public snackBar: MatSnackBar
      , private constance: ConstanceService
      , public  router: Router) { }

  ngOnInit() {
  }

  connexionToServer(url: string) {
        this.httpClient
            .get(url)
            .subscribe(
                (response) => {
                    this.authService.sessions = response;
                    console.log(response);
                    this.authService.isAuth = true;
                    this.afficher_spinner = false;
                    this.authService.etat_problematique = false;
                    this.router.navigate(['problematique']);
                },
                (error) => {
                    this.afficher_spinner = false;
                    this.openSnackBar('Une erreur serveur vient de se produire', 'erreur');
                }
            );
    }

  onNext() {
      this.afficher_spinner = true;
      const email = this.authService.sessions.email;
      const password = this.authService.sessions.password;
      const url = this.constance.dns.concat('/WazzabyApi/public/api/connexion?email=').concat(email).concat('&password=').concat(password);
      this.connexionToServer(url);
  }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }



}
