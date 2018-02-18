import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { Storage } from '@ionic/storage';
import moment from 'moment';

@Component({ selector: 'page-welcome', templateUrl: 'welcome.html' })
export class WelcomePage {

  constructor(public navCtrl: NavController, private storage: Storage) { }

  startClicked() {
    const startDate = moment(new Date()).subtract(1, 'day').toDate();
    this
      .storage
      .set('startDate', startDate)
      .then(() => {
        this
          .navCtrl
          .push(HomePage);
      });
  }
}