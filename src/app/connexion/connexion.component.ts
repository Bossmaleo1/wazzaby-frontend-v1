import { Component, OnInit } from '@angular/core';
import {AuthService} from '../Services/auth.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {ConstanceService} from '../Services/Constance.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent implements OnInit {

  authStatus: boolean;
  hide = true;
  //ngIf qui affiche le Spinner
  afficher_spinner = false;

  constructor(private authService: AuthService
              , private  router: Router
              , private httpClient: HttpClient
              , public snackBar: MatSnackBar
              , private constance: ConstanceService) { }

  ngOnInit() {
      this.authStatus = this.authService.isAuth;
  }


    onSubmit(form: NgForm) {
        this.afficher_spinner = true;
        const email = form.value['email'];
        const password = form.value['password'];
        const url = this.constance.dns.concat('/WazzabyApi/public/api/connexion?email=').concat(email).concat('&password=').concat(password);
        this.connexionToServer(url);
    }


    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }

    connexionToServer(url: string) {
        this.httpClient
            .get(url)
            .subscribe(
                (response) => {
                    this.authService.sessions = response;
                    console.log(this.authService.sessions);
                    if (this.authService.sessions.succes === 1) {
                        const libelle_boss = this.authService.sessions.libelle_prob;
                        this.constance.test_updatecachephoto = 1;
                        if (libelle_boss.length > 0) {
                            this.authService.isAuth = true;
                            this.router.navigate(['home']);
                        } else {
                            this.authService.isAuth = true;
                            this.authService.etat_problematique = false;
                            this.router.navigate(['problematique']);
                        }
                    } else {
                        this.authService.isAuth = false;
                        this.afficher_spinner = false;
                        this.openSnackBar('Vous avez entre le mauvais Login ou mot de passe', 'erreur');
                    }
                    return response;
                },
                (error) => {
                    this.afficher_spinner = false;
                    this.openSnackBar('Une erreur serveur vient de se produire', 'erreur');
                }
            );
    }

    switchinscript() {
      this.router.navigate(['inscript']);
    }

}
