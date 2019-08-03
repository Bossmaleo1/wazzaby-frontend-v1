import {Component, ElementRef, Inject, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {HomeDesignService} from '../Services/home.design.service';
import {MatSlideToggleChange, MatSnackBar, MatTabChangeEvent} from '@angular/material';
import {Router} from '@angular/router';
import {AuthService} from '../Services/auth.service';
import {PrivateUseronlineServices} from '../Services/private.useronline.services';
import {PrivateRecentconvertServices} from '../Services/private.recentconvert.services';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ConstanceService} from '../Services/Constance.service';
import {MessagePublic} from '../models/MessagePublic.model';
import {Subscription} from 'rxjs';
import {MessagepublicService} from '../Services/messagepublic.service';
import { speedDialFabAnimations } from './speed-dial-fab.animations';
import {PublicConvertServices} from '../Services/public.convert.services';





@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: speedDialFabAnimations
})
export class HomeComponent implements OnInit, OnDestroy {
    fabTogglerState = 'inactive';

    messagepublic: MessagePublic;
    messagepublicsubscription: Subscription;
    messagepublicform: FormGroup;

    @ViewChild('fileInput') fileInput: ElementRef;

    IconEtatColorPublicConver = true;
    IconEtatColorPrivateConver = false;

    /*la variable qui hidden le badges*/
    badgeshidden = false;
    badgetaille: any;
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
    afficher_spinner_messagepublic = false;
    empty_message = false;
    error_message: string;
    //variable permettant de dynamiser l'affichage de l'info bull sur
    //le mode aanonymous
    info_bulle: string;
    //variable who permet me to get a badges of notification number



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
      this.info_bulle = 'Cliquez ici pour activer le mode anonymous';
      if (this.constance.test_updatecachephoto === 1) {
        if (this.authService.getSessions().photo === '') {
            this.photo_user = this.constance.dns.concat('/uploads/photo_de_profil/').concat('ic_profile.png');
        } else {
          this.photo_user = this.constance.dns.concat('/uploads/photo_de_profil/').concat(this.authService.getSessions().photo);
        }
      } else if (this.constance.test_updatecachephoto === 2) {
          this.photo_user = this.authService.getSessions().photo;
      } else if (this.constance.test_updatecachephoto === 3) {
          if (this.authService.getSessions().photo === '') {
              this.photo_user = this.constance.dns.concat('/uploads/photo_de_profil/').concat('ic_profile.png');
          } else {
              this.photo_user = this.constance.dns.concat('/uploads/photo_de_profil/').concat(this.authService.getSessions().photo);
          }
      }
      this.problematique_libelle = this.authService.getSessions().libelle_prob;

      this.messagepublicsubscription = this.messagepublicservice.messageSubject.subscribe(
          (messagepublic: MessagePublic) => {
              this.messagepublic = messagepublic;
          }
      );
      this.messagepublicservice.emitMessage();
      this.initForm();
      if (typeof this.publicconvertservice.conversationsPublics === 'undefined') {
          this.afficher_spinner_messagepublic = true;
      }
      const url = this.constance.dns.concat('/WazzabyApi/public/api/displayPublicMessage?id_problematique=')
          .concat(this.authService.getSessions().id_prob)
          .concat('&id_user=').concat(this.authService.getSessions().id);
      const count_notification_url = this.constance.dns
          .concat('/WazzabyApi/public/api/CountNotification?id_recepteur=')
          .concat(this.authService.getSessions().id);
      this.httpClient
          .get(url)
          .subscribe(
              (response1) => {
                  this.publicconvertservice.conversationsPublics = response1;
                  this.afficher_spinner_messagepublic = false;
                  if ((this.publicconvertservice.conversationsPublics).length === 0) {
                      this.empty_message = true;
                      this.error_message = 'Il y a aucune publication pour cette problematique';
                  }
                  return response1;
              },
              (error) => {
                  this.afficher_spinner_messagepublic = false;
                  this.openSnackBar('Une erreur serveur vient de se produire', 'erreur');
                  this.empty_message = true;
                  this.error_message = 'Une erreur serveur vient de se produire';
      });

      this.httpClient
          .get(count_notification_url)
          .subscribe(
              (response1) => {
                  let countnotificationnumber: any;
                  countnotificationnumber = response1;
                  if (countnotificationnumber.count === 0) {
                      this.badgeshidden = false;
                  } else {
                      this.badgetaille = countnotificationnumber.count;
                  }
                  return response1;
              },
              (error) => {
              });
  }

  initForm() {
      this.messagepublicform = this.formBuilder.group({
          tenantPhotoId: '',
          problematique: ['', Validators.required]
          });
  }

  getColor(etat: boolean) {
    if (etat) {
      return '#64B5F6';
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
    onDialogPublicConvert() {
       this.block_boite_de_dialogue = 'block';
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
                        this.constance.messagepublicobject = response1;
                        this.disparaitrechamp = 'block';
                        this.disparaitreimage = 'block';
                        this.disparaitreprogressbar = 'none';
                        this.block_boite_de_dialogue = 'none';
                        const nom_du_user = ''.concat(this.authService.sessions.prenom).concat(' ').concat(this.authService.sessions.nom);
                        let maleosama = new Object();
                        maleosama['user_photo'] = this.authService.sessions.photo;
                        maleosama['countcomment'] = '0';
                        maleosama['name'] = nom_du_user;
                        maleosama['id'] = this.constance.messagepublicobject.id;
                        maleosama['updated'] = "A l'instant";
                        maleosama['status_text_content'] = libellemessagepublic;
                        maleosama['etat_photo_status'] = this.constance.messagepublicobject.etat_photo_status;
                        maleosama['status_photo'] =  this.constance.messagepublicobject.status_photo;
                        this.publicconvertservice.conversationsPublics.unshift(maleosama);

                        this.openSnackBar('Insertion effectuee avec succes !', 'succes');

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

    ModeAnonymous(event: MatSlideToggleChange) {
        event.source.color = "warn";
        if (event.checked) {
            //console.log("Le machin vient d'etre checker !!");
            this.info_bulle = 'Cliquez ici pour désactiver le mode anonymous';
        } else {
            this.info_bulle = 'Cliquez ici pour activer le mode anonymous';
            //console.log("Le machin vient d'etre dechecker !!");
        }
    }

}




