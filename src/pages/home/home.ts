import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import moment from 'moment';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(public navCtrl: NavController, private storage: Storage) {
  }

  startDate: Date;
  currentlySelectedDate: Date;
  selectedRecord: WeightRecord;

  ionViewDidLoad() {
    this.currentlySelectedDate = new Date();

    this.storage.get('startDate').then((startDate) => {
      this.startDate = startDate;
      const currentDateMoment = moment(new Date());
      const startDateMoment = moment(startDate);
      const daysSinceFastStart = currentDateMoment.diff(startDateMoment, 'days') + 1;

      this.selectedRecord = {
        date: new Date(),
        dayNum: daysSinceFastStart,
        img: null
      };
    });
  }

  isOnStartDay() {
    if (!this.currentlySelectedDate)
      return false;

    const currentlySelectedDateMoment = moment(this.currentlySelectedDate);
    const startDateMoment = moment(this.startDate);

    return currentlySelectedDateMoment.diff(startDateMoment, 'days') === 0;
  }

  isOnLatestDay() {
    if (!this.currentlySelectedDate)
      return false;

    const currentlySelectedDateMoment = moment(this.currentlySelectedDate);
    const todayMoment = moment(new Date());

    return currentlySelectedDateMoment.diff(todayMoment, 'days') === 0;
  }

  navDayBack() {
    this.currentlySelectedDate = moment(this.currentlySelectedDate).subtract(1, 'day').toDate();
  }

  navDayForward() {
    this.currentlySelectedDate = moment(this.currentlySelectedDate).add(1, 'day').toDate();
  }
}