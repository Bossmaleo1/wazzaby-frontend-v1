import {Component, Input, OnInit} from '@angular/core';
import {PublicConvertServices} from '../Services/public.convert.services';
import {ConstanceService} from '../Services/Constance.service';
import {Router} from '@angular/router';
import {PublicCommentsServices} from '../Services/public.comments.services';

@Component({
  selector: 'app-publicconvert',
  templateUrl: './publicconvert.component.html',
  styleUrls: ['./publicconvert.component.scss']
})
export class PublicconvertComponent implements OnInit {

    @Input() id: number;
    @Input() name: string;
    @Input() updated: string;
    @Input() user_photo: string;
    @Input() status_text_content: string;
    @Input() etat_photo: string;
    @Input() etat_photo_status: string;
    @Input() status_photo: string;
    @Input() countcomment: string;
    @Input() indexOfConvert: number;
    photo : string;
    jaime : number;
    jaimepas : number;

  constructor(private publicconvert: PublicConvertServices
              , private constance: ConstanceService
              , private publiccommentsservice: PublicCommentsServices
              , private  router: Router) {

  }

  ngOnInit() {
      this.jaime = 0;
      this.jaimepas = 0;
      this.photo = this.constance.dns.concat('/uploads/photo_de_profil/').concat(this.user_photo);
  }

  OnIntervention(id: number) {

      /*console.log('id est : '+id);*/
  }

  OnLaunchIntervention() {
        this.publiccommentsservice.id = this.id;
        this.publiccommentsservice.name = this.name;
        this.publiccommentsservice.updated = this.updated;
        this.publiccommentsservice.user_photo = this.user_photo;
        this.publiccommentsservice.status_photo = this.status_photo;
        this.publiccommentsservice.status_text_content = this.status_text_content;
        this.publiccommentsservice.etat_photo_status = this.etat_photo_status;
        /*this.constance.id_commentaire = this.indexOfConvert;*/
        this.router.navigate(['public-convert-details']);
  }

  Onjaime() {
      console.log(" J'aime !!");
  }

  Onjaimepas() {
      console.log(" J'aime pas !!");
  }

}
