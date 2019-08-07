import { Component, OnInit } from '@angular/core';
import {PublicConvertServices} from '../Services/public.convert.services';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../Services/auth.service';
import {PublicCommentsServices} from '../Services/public.comments.services';
import {ConstanceService} from '../Services/Constance.service';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-publicconvert-details',
  templateUrl: './publicconvert-details.component.html',
  styleUrls: ['./publicconvert-details.component.scss']
})
export class PublicconvertDetailsComponent implements OnInit {

  id: number;
  name: string;
  updated: string;
  user_photo: string;
  status_photo: string;
  status_text_content: string;
  etat_photo_status: string;
  comments: any;
  libelle_comment = '';
  testevent = 1;


  constructor(private publicconvert: PublicConvertServices
              , private route: ActivatedRoute
              , private  router: Router
              , private httpClient: HttpClient
              , private authService: AuthService
              , public snackBar: MatSnackBar
              , private constance: ConstanceService
              , private publiccomments: PublicCommentsServices) { }

  ngOnInit() {
      this.id = this.publiccomments.id;
      this.name = this.publiccomments.name;
      this.updated = this.publiccomments.updated;
      this.user_photo = this.constance.dns.concat('/uploads/photo_de_profil/').concat(this.publiccomments.user_photo);
      this.status_photo = this.publiccomments.status_photo;
      this.status_text_content = this.publiccomments.status_text_content;
      this.etat_photo_status = this.publiccomments.etat_photo_status;
      const url = this.constance.dns.concat('/WazzabyApi/public/api/displayComment?id_messagepublic=').concat(this.publiccomments.id);
      this.connexionToServer2(url);
  }

  onSendComment() {
      this.addComment();
  }


  OnBack() {
        this.router.navigate(['home']);
  }


  connexionToServer(url: string) {
        this.httpClient
            .get(url)
            .subscribe(
                (response) => {
                    return response;
                },
                (error) => {
                    this.openSnackBar('Une erreur inconnue vient de se produire suite a votre insertion !', 'erreur');
                }
            );
    }

    connexionToServer2(url: string) {
        this.httpClient
            .get(url)
            .subscribe(
                (response2) => {
                    this.publiccomments.Comments = response2;
                    this.comments = this.publiccomments.Comments;
                    return response2;
                },
                (error) => {
                    this.openSnackBar('Une erreur serveur vient de se produire !', 'erreur');
                }
            );
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }

    addComment() {
        const nom_du_user = ''.concat(this.authService.sessions.prenom).concat(' ').concat(this.authService.sessions.nom);
        let maleosama = new Object();
        maleosama['id'] = 1;
        maleosama['name'] = nom_du_user;
        maleosama['updated'] = "A l'instant";
        maleosama['user_photo'] = this.constance.dns.concat('/uploads/photo_de_profil/').concat(this.authService.sessions.photo);
        maleosama['status_text_content'] = this.libelle_comment;
        this.publiccomments.Comments.unshift(maleosama);

        this.comments = this.publiccomments.Comments;

        const url = this.constance.dns.concat('/WazzabyApi/public/api/addComment?id_messagepublic=').concat(this.publiccomments.id).concat('&libelle_comment=').concat(this.libelle_comment).concat('&id_user=').concat(this.authService.sessions.id);
        this.libelle_comment = '';
        this.connexionToServer(url);
    }
}
