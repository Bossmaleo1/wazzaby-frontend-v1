import {Component, Input, OnInit} from '@angular/core';
import {PublicConvertServices} from '../Services/public.convert.services';
import {ConstanceService} from '../Services/Constance.service';

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
    @Input() indexOfConvert: number;
    photo : string;

  constructor(private publicconvert: PublicConvertServices, private constance: ConstanceService) { }

  ngOnInit() {
      this.photo = this.constance.dns.concat('/uploads/photo_de_profil/').concat(this.user_photo);
  }

  OnIntervention(id: number) {
      /*console.log('id est : '+id);*/
  }



}
