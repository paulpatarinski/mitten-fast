import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import moment from 'moment';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(public navCtrl: NavController, private storage : Storage) {
  }

  ionViewDidLoad() {
    this.storage.get('startDate').then((startDate) => {
      const currentDateMoment = moment(new Date());
      const startDateMoment =moment(startDate);
      const daysSinceFastStart = currentDateMoment.diff(startDateMoment, 'days');

      this.selectedRecord = {
        date : new Date(),
        dayNum : daysSinceFastStart,
        img : null
      };
    });
  }

  public selectedRecord : WeightRecord;
}
