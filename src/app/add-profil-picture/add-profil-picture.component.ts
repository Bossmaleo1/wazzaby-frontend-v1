import { Component, OnInit } from '@angular/core';
import {AddProfilPictureService} from '../Services/add.profil.picture.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ConstanceService} from '../Services/Constance.service';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../Services/auth.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-add-profil-picture',
  templateUrl: './add-profil-picture.component.html',
  styleUrls: ['./add-profil-picture.component.scss']
})
export class AddProfilPictureComponent implements OnInit {


    addphotoform: FormGroup;
    imageSrc: any;
    filevalue: any;
    disparaitreprogressbar: any;
    disparaitreblock: any;

  constructor(private addprofilpictureservice: AddProfilPictureService
      , private formBuilder: FormBuilder
      , private constance: ConstanceService
      , private httpClient: HttpClient
      , public snackBar: MatSnackBar
      , private authService: AuthService) { }

  ngOnInit() {
      if (this.constance.test_updatecachephoto === 1) {
          if (this.authService.getSessions().photo === '') {
              this.imageSrc = this.constance.dns.concat('/uploads/photo_de_profil/').concat('ic_profile_colorier.png');
          } else {
              this.imageSrc = this.constance.dns.concat('/uploads/photo_de_profil/').concat(this.authService.getSessions().photo);
          }
      } else if (this.constance.test_updatecachephoto === 2) {
          this.imageSrc = this.authService.getSessions().photo;
      } else if (this.constance.test_updatecachephoto === 3) {
          if (this.authService.getSessions().photo === '') {
              this.imageSrc = this.constance.dns.concat('/uploads/photo_de_profil/').concat('ic_profile_colorier.png');
          } else {
              this.imageSrc = this.constance.dns.concat('/uploads/photo_de_profil/').concat(this.authService.getSessions().photo);
          }
      }
      this.disparaitreprogressbar = 'none';
      this.disparaitreblock = 'block';
      this.initForm();
  }

    initForm() {
        this.addphotoform = this.formBuilder.group({
            tenantPhotoId: ''
        });
    }

    onpenFileBrowser(event: any) {
        event.preventDefault();
        let element: HTMLElement = document.getElementById('tenantPhotoId') as HTMLElement;
        element.click();
    }

    onChangeFile(event) {
        this.disparaitreprogressbar = 'block';
        this.disparaitreblock = 'none';

        const taille = event.target.files[0].name.split('.').length;
        const extension = event.target.files[0].name.split('.')[taille - 1].toLowerCase();

        if (extension === 'png' || extension === 'jpg' || extension === 'jpeg' || extension === 'gif') {

            let libelle_photo = 'photo_';
            libelle_photo = libelle_photo.concat(this.authService.sessions.id).concat('.').concat(extension);
            if (event.target.files && event.target.files[0]) {
                const file = event.target.files[0];

                const reader = new FileReader();
                reader.onload = e => this.imageSrc = reader.result;

                reader.readAsDataURL(file);
                this.filevalue = file;
                const url = this.constance.dns.concat('/WazzabyApi/public/api/updatelibelleuserphoto?id_user=').concat(this.authService.sessions.id).concat('&libelle_photo=').concat(libelle_photo);
                this.httpClient
                    .get(url)
                    .subscribe(
                        (response) => {
                            const url1 = this.constance.dns.concat('/uploads/uploadPhotodeprofil.php');
                            let formData: FormData = new FormData();
                            formData.append('photostatus', this.filevalue);
                            formData.append('name_file', libelle_photo);
                            this.httpClient
                                .post(url1, formData)
                                .subscribe(
                                    (response1) => {
                                        this.disparaitreprogressbar = 'none';
                                        this.disparaitreblock = 'block';
                                        if (this.constance.test_updatecachephoto != 3) {
                                            this.constance.test_updatecachephoto = 2;
                                            this.authService.sessions.photo = reader.result;
                                        }
                                        this.openSnackBar('Votre photo a ete mise a jour avec succes', 'succes');
                                    },
                                    (error) => {
                                        this.openSnackBar('Une erreur serveur vient de se produire', 'erreur');
                                        this.disparaitreprogressbar = 'none';
                                        this.disparaitreblock = 'block';
                                    }
                                );

                            return response;
                        },
                        (error) => {

                        }
                    );

            }

        }

    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }

}
