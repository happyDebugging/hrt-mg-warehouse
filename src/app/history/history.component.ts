import { Component } from '@angular/core';
import { DbFunctionService } from '../shared/services/db-functions.service';
import { map, Subscription } from 'rxjs';
import { HistoryLines } from '../shared/models/history-lines.model';
import { initializeApp } from 'firebase/app';
import { getDatabase, query, startAt } from 'firebase/database';
import { getStorage, ref } from 'firebase/storage';
import { orderBy } from 'firebase/firestore';
import { queryRef } from 'firebase/data-connect';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent {

  historyLinesList = [{
    Id: '',
    Date: '',
    ActionType: '',
    MaterialName: '',
    SerialNumber: '',
    Responsible: ''
  }];

  getHistoryLines: Subscription = new Subscription;

  // Firebase web app configuration
  firebaseConfig = {
    apiKey: "AIzaSyAq82tP-XtNICS4oNiS2hKLN2tzElGQF0Q",
    authDomain: "hrt-mg-warehouse.firebaseapp.com",
    databaseURL: "https://hrt-mg-warehouse-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "hrt-mg-warehouse",
    storageBucket: "hrt-mg-warehouse.appspot.com",
    messagingSenderId: "814645994356",
    appId: "1:814645994356:web:7efe4746dd371d51338221"
  };

  // Initialize Firebase
  firebaseApp = initializeApp(this.firebaseConfig);

  // Initialize Realtime Database and get a reference to the service
  database = getDatabase(this.firebaseApp);
  // Initialize Cloud Storage and get a reference to the service
  storage = getStorage(this.firebaseApp);
  // Create a storage reference from our storage service
  storageRef = ref(this.storage, 'some-child');

  constructor(private dbFunctionService: DbFunctionService) { }

  ngOnInit() {
    this.GetHistoryLines();
  }

  GetHistoryLines() {
    this.historyLinesList = [];

    this.getHistoryLines = this.dbFunctionService.geHistoryLinesFromDb()
      .pipe(map((response: any) => {
        let markerArray: HistoryLines[] = [];

        for (const key in response) {
          if (response.hasOwnProperty(key)) {

            markerArray.push({ ...response[key], Id: key })

          }
        }

        return markerArray.reverse();

      }))
      .subscribe(
        (res: any) => {
          if ((res != null) || (res != undefined)) {
            console.log(res)
            const responseData = new Array<HistoryLines>(...res);

            for (const data of responseData) {

              const resObj = new HistoryLines();

              resObj.Id = data.Id;
              resObj.Date = data.Date;
              resObj.ActionType = data.ActionType;
              resObj.MaterialName = data.MaterialName;
              resObj.SerialNumber = data.SerialNumber;
              resObj.Responsible = data.Responsible;

              this.historyLinesList.push(resObj);

            }

            //this.historyLinesList.reverse();

          }
        },
        err => {
          //console.log(err);
        }
      );
  }

  nextPage() {

    const db = firebase.database();
    const postsRef = db.ref('posts');
    postsRef.orderByChild('created_at').limitToLast(10).once('value', (snapshot) => {
      // Process the snapshot data here
      console.log('snapshot '+snapshot)
    });

  }

  ngOnDestroy() {

    if (this.getHistoryLines && !this.getHistoryLines.closed) {
      this.getHistoryLines.unsubscribe();
    }

  }

}
