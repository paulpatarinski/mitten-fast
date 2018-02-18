import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {HomePage} from '../home/home';
import {Storage} from '@ionic/storage';

@Component({selector: 'page-welcome', templateUrl: 'welcome.html'})
export class WelcomePage {

  constructor(public navCtrl : NavController, private storage : Storage) {}

  startClicked() {
    this
      .storage
      .set('startDate', new Date())
      .then(() => {
        this
          .navCtrl
          .push(HomePage);
      });
  }
}