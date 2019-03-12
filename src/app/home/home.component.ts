import {Component, ElementRef, Inject, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {HomeDesignService} from '../Services/home.design.service';
import {MatSnackBar, MatTabChangeEvent} from '@angular/material';
import {Router} from '@angular/router';
import {AuthService} from '../Services/auth.service';
import {Help1Services} from '../Services/help1.services';
import {PrivateUseronlineServices} from '../Services/private.useronline.services';
import {PrivateRecentconvertServices} from '../Services/private.recentconvert.services';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup, NgForm, ReactiveFormsModule, Validators} from '@angular/forms';
import {ConstanceService} from '../Services/Constance.service';
import {MessagePublic} from '../models/MessagePublic.model';
import {Subscription} from 'rxjs';
import {MessagepublicService} from '../Services/messagepublic.service';
import {DOCUMENT} from '@angular/common';
import { speedDialFabAnimations } from './speed-dial-fab.animations';
import {RequestOptions} from '@angular/http';
import {PublicConvertServices} from '../Services/public.convert.services';





@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: speedDialFabAnimations
})
export class HomeComponent implements OnInit, OnDestroy {

    //gestion du bouton flottant multiple
    fabButtons = [
        {
            icon: 'edit'
        },
        {
            icon: 'keyboard_arrow_up'
        }
    ];
    buttons = [];
    fabTogglerState = 'inactive';

    messagepublic: MessagePublic;
    messagepublicsubscription: Subscription;
    messagepublicform: FormGroup;

    @ViewChild('fileInput') fileInput: ElementRef;

    IconEtatColorPublicConver = true;
    IconEtatColorPrivateConver = false;

    /*la variable qui hidden le badges*/
    badgeshidden = false;
    badgetaille = 6;
    /*le tableau contenant les conversations des utilisateurs*/
    conversationsPublicsHome: any;
    privateusersOnlineHome: any;
    privaterecentConvertHome: any;

    animal: string;
    name: string;

    /*le status du block de la boite de dialogue*/
    block_boite_de_dialogue: string;

    afficher_spinner = false;

    // les coordonnees de l'utilisateurs
    nom: string;
    prenom: string;
    photo_user: string;
    problematique_libelle: string;
    // attributs pour la gestion du uploading des fichiers
    someUrlFile: any;
    imageSrc: any;

    disparaitreimage = 'none';
    disparaitreprogressbar = 'none';

    disparaitrechamp = 'block';
    filevalue: any;
    imagenamefordelete: any;
    id_messagepublic: any;
    id_photo: any;
    etat: any;


  constructor(private homedesign: HomeDesignService
              , private  router: Router
              , private authService: AuthService
              , private privateuseronlineservices: PrivateUseronlineServices
              , private privaterecentconvertservices: PrivateRecentconvertServices
              , private httpClient: HttpClient
              , public snackBar: MatSnackBar
              , private constance: ConstanceService
              , private messagepublicservice: MessagepublicService
              , private publicconvertservice: PublicConvertServices
              , private formBuilder: FormBuilder) {


  }

  ngOnInit() {
      this.privateusersOnlineHome = this.privateuseronlineservices.userOnlines;
      this.privaterecentConvertHome = this.privaterecentconvertservices.RecentConverts;
      this.nom = this.authService.getSessions().nom;
      this.prenom = this.authService.getSessions().prenom;
      this.etat = 1;
      if (this.authService.getSessions().photo === '') {
            this.photo_user = 'ic_profile.png';
      } else {
          this.photo_user = this.authService.getSessions().photo;
      }
      this.problematique_libelle = this.authService.getSessions().libelle_prob;

      this.messagepublicsubscription = this.messagepublicservice.messageSubject.subscribe(
          (messagepublic: MessagePublic) => {
              this.messagepublic = messagepublic;
          }
      );
      this.messagepublicservice.emitMessage();
      this.initForm();
      window.addEventListener('scroll', this.scroll, true);

      const url = this.constance.dns.concat('/WazzabyApi/public/api/displayPublicMessage?id_problematique=').concat(this.authService.getSessions().id_prob);
      this.httpClient
          .get(url)
          .subscribe(
              (response1) => {
                  this.publicconvertservice.conversationsPublics = response1;
                  return response1;
              },
              (error) => {
                  this.openSnackBar('Une erreur serveur vient de se produire', 'erreur');
              }
          );
  }

  initForm() {
      this.messagepublicform = this.formBuilder.group({
          tenantPhotoId: '',
          problematique: ['', Validators.required]
          });
  }

  getColor(etat: boolean) {
    if (etat) {
      return '#0D47A1';
    } else {
      return 'black';
    }
  }

  ChangeIconOne() {
      this.IconEtatColorPublicConver = true;
      this.IconEtatColorPrivateConver = false;
  }

  ChangeIconTwo() {
      this.IconEtatColorPublicConver = false;
      this.IconEtatColorPrivateConver = true;
  }

  /*La methode qui change la couleur de l'icone suivant l'onglet cliquer*/
  onLinkClick(event: MatTabChangeEvent) {

        if (event.index === 0) {
            this.ChangeIconOne();
        } else if (event.index === 1) {
            this.ChangeIconTwo();
        }
  }

    OnclickNotification() {
        this.badgeshidden = true;

        this.router.navigate(['notification']);
    }

    OnclickProblematique() {
      this.router.navigate(['problematique']);
    }

    OnDeconnect() {
        this.authService.signOut();
        this.router.navigate(['connexion']);
    }

    OnProfil() {
        this.router.navigate(['profil']);
    }

    /*Pour afficher la boite de dialogue*/
    onDialogPublicConvert(event) {
        if (event.srcElement.innerHTML === 'edit') {
            this.block_boite_de_dialogue = 'block';
        } else {
            window.scroll(0,0);
        }
    }

    /*Methode pour fermer la boite de dialogue*/
    onCloseDialog() {
        this.block_boite_de_dialogue = 'none';
        this.filevalue = null;
        this.imageSrc = "";
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }

	onChangeFile(event) {
        this.disparaitreprogressbar = 'block';
        //afficher_spinner
        const taille = event.target.files[0].name.split('.').length;
        const extension = event.target.files[0].name.split('.')[taille - 1].toLowerCase();
        this.imagenamefordelete = extension;

        if (extension === 'png' || extension === 'jpg' || extension === 'jpeg' || extension === 'gif') {

            if (event.target.files && event.target.files[0]) {
                const file = event.target.files[0];

                const reader = new FileReader();
                reader.onload = e => this.imageSrc = reader.result;

                reader.readAsDataURL(file);
                this.filevalue = file;
                /*formData.append('id_user', );
                formData.append('id_problematique', );*/
                const urlrecuperefile = this.constance.dns.concat('/WazzabyApi/public/api/photomessagepublic?file_extension=').concat(extension).concat('&id_user=').concat(this.authService.sessions.id).concat('&id_problematique=').concat(this.authService.sessions.id_prob);
                this.httpClient
                    .get(urlrecuperefile)
                    .subscribe(
                        (response) => {
                            this.constance.name_file = response;
                            const url1 = this.constance.dns.concat('/uploads/uploadScript.php');
                            let formData: FormData = new FormData();
                            formData.append('photostatus', this.filevalue);
                            formData.append('name_file', this.constance.name_file.name_file);
                            this.imagenamefordelete = this.constance.name_file.name_file.concat('.').concat(extension);
                            this.id_messagepublic = this.constance.name_file.id_messagepublic;
                            this.id_photo = this.constance.name_file.ID_photo;
                            this.httpClient
                                .post(url1, formData)
                                .subscribe(
                                    (response) => {
                                        this.disparaitreprogressbar = 'none';
                                        this.disparaitreimage = 'block';
                                        this.etat = 0;
                                    },
                                    (error) => {
                                        this.disparaitreprogressbar = 'none';
                                        this.openSnackBar('Une erreur serveur vient de se produire', 'erreur');
                                    }
                                );

                            return response;
                        },
                        (error) => {
                            this.openSnackBar('Une erreur serveur vient de se produire', 'erreur');
                            this.disparaitreprogressbar = 'none';
                        }
                    );

            }

        } else {
            this.openSnackBar('Veuillez choisir une image', 'erreur');
        }
	}

    onpenFileBrowser(event: any) {
        event.preventDefault();
        let element: HTMLElement = document.getElementById('tenantPhotoId') as HTMLElement;
        element.click();
    }



    ngOnDestroy() {
        window.removeEventListener('scroll', this.scroll, true);
        this.messagepublicsubscription.unsubscribe();
    }

    onSubmitForm() {
        this.disparaitrechamp = 'none';
        this.disparaitreimage = 'none';
        this.disparaitreprogressbar = 'block';
        const formvalue = this.messagepublicform.value;
        const libellemessagepublic = formvalue['problematique'];

        if (libellemessagepublic.length > 0 ) {
            const url = this.constance.dns.concat('/WazzabyApi/public/api/SaveMessagePublic?etat=').concat(this.etat).concat('&libelle=').concat(libellemessagepublic).concat('&id_problematique=').concat(this.authService.getSessions().id_prob).concat('&ID=').concat(this.authService.getSessions().id).concat('&id_message_public=').concat(this.id_messagepublic);
            this.httpClient
                .get(url)
                .subscribe(
                    (response1) => {
                        this.disparaitrechamp = 'block';
                        this.disparaitreimage = 'block';
                        this.disparaitreprogressbar = 'none';
                        this.block_boite_de_dialogue = 'none';
                        this.openSnackBar('Insertion effectuee avec succes !', 'succes');

                        /*if (this.etat === 0) {
                            this.publicconvertservice.itemobject.status_photo = this.imageSrc;
                            this.publicconvertservice.itemobject.etat_photo_status = 'block';
                        } else {
                            this.publicconvertservice.itemobject.etat_photo_status = 'none';
                            this.publicconvertservice.itemobject.status_photo = '';
                        }


                        if (this.authService.sessions.photo.length > 0 ) {
                            this.publicconvertservice.itemobject.user_photo = '';
                        } else {
                            this.publicconvertservice.itemobject.user_photo = '../../Icons/ic_profile_colorier.png';
                        }

                        this.publicconvertservice.itemobject.status_text_content = libellemessagepublic;
                        this.publicconvertservice.itemobject.updated = "A l'instant";
                        this.publicconvertservice.conversationsPublics.push(this.publicconvertservice.itemobject);*/

                        return response1;
                    },
                    (error) => {
                        this.disparaitrechamp = 'block';
                        this.disparaitreimage = 'block';
                        this.disparaitreprogressbar = 'none';
                        this.openSnackBar('Une erreur serveur vient de se produire', 'erreur');
                    }
                );
        } else {
            this.openSnackBar('Veuillez inserer un message public', 'erreur');
        }

    }

    scroll = (): void => {
        this.block_boite_de_dialogue = 'none';
    }

    showItems() {
        this.fabTogglerState = 'active';
        this.buttons = this.fabButtons;
    }

    hideItems() {
        this.fabTogglerState = 'inactive';
        this.buttons = [];
    }

    onToggleFab() {
        this.buttons.length ? this.hideItems() : this.showItems();
    }

    //methode pour supprimer la photo d'un status
    OnSupprimerPhoto() {
        this.disparaitreimage = 'none';
        this.disparaitreprogressbar = 'block';
        const urltemp = this.constance.dns.concat('/uploads/removeuploadScript.php?nomdufichier=').concat(this.imagenamefordelete);
        this.httpClient
            .get(urltemp)
            .subscribe(
                (response) => {
                    this.disparaitreprogressbar = 'none';
                   const urldelete = this.constance.dns.concat('/WazzabyApi/public/api/deletephotomessagepublic?ID=').concat(this.id_messagepublic).concat('&ID_photo=').concat(this.id_photo);
                   this.httpClient
                        .get(urldelete)
                        .subscribe(
                            (response1) => {
                                this.disparaitreprogressbar = 'none';
                                this.etat = 1;
                                return response1;
                            },
                            (error) => {
                            }
                        );
                    return response;
                },
                (error) => {
                    this.disparaitreprogressbar = 'none';
                    this.disparaitreimage = 'block';
                    this.openSnackBar('Une erreur serveur vient de se produire', 'erreur');
                }
            );
    }

}




