import { Component } from '@angular/core';
import { DbFunctionService } from '../shared/services/db-functions.service';
import { map, Subscription } from 'rxjs';
import { HistoryLines } from '../shared/models/history-lines.model';
import { initializeApp } from 'firebase/app';
import { child, get, getDatabase, ref, onValue, query, startAt } from 'firebase/database';
import { collection, getFirestore, orderBy } from 'firebase/firestore';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent {

  pageCount = 1;
  historyRows = 10;
  leftPageNum = 1;
  midPageNum = 2;
  rightPageNum = 3;

  pageNumber = 1;
  itemsPerPage = 20;

  historyLinesList = [{
    Id: '',
    Date: '',
    ActionType: '',
    MaterialName: '',
    SerialNumber: '',
    Responsible: ''
  }];
  //historyLinesList: HistoryLines[] = [];

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

  constructor(private dbFunctionService: DbFunctionService) { }

  ngOnInit() {
    this.GetHistoryLines();
  }

  GetHistoryLines() {
    this.historyLinesList = [];

    //this.getHistoryLines = 
    this.dbFunctionService.geHistoryLinesFromDb(this.pageNumber, this.itemsPerPage)
      // .pipe(map((response: any) => {
      //   let markerArray: HistoryLines[] = [];

      //   for (const key in response) {
      //     if (response.hasOwnProperty(key)) {

      //       markerArray.push({ ...response[key], Id: key })

      //     }
      //   }

      //   return markerArray.reverse();

      // }))
      // .subscribe(
      .then(
        (res: any) => {
          if ((res != null) || (res != undefined)) {
            console.log(res)
            //const responseData = new Array<HistoryLines>(...res);

            for (const data of res) {

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


    // const startCountRef = ref(this.database, '/history');
    // let historyLines = new Array<HistoryLines>();
    // onValue(startCountRef, (snapshot) => {
    //   const res = snapshot.val();

    //   let markerArray: HistoryLines[] = [];

    //   for (const key in res) {
    //     if (res.hasOwnProperty(key)) {

    //       markerArray.push({ ...res[key], Id: key })

    //     }
    //   }
    //   markerArray.reverse();

    //   console.log(markerArray)
    //   let counter = 0;
    //   let index = 0;
    //   console.log(Math.ceil(markerArray.length / this.historyRows))

    //   for (var y = 0; y <= Math.ceil(markerArray.length / this.historyRows); y++) {
    //     historyLines = [];

    //     for (var i = y + counter; i <= y + counter + (this.historyRows - 1); i++) {
    //       let resObj = new HistoryLines();

    //       if (markerArray[i] != undefined) {
    //         resObj.Id = markerArray[i].Id;
    //         resObj.Date = markerArray[i].Date;
    //         resObj.ActionType = markerArray[i].ActionType;
    //         resObj.MaterialName = markerArray[i].MaterialName;
    //         resObj.SerialNumber = markerArray[i].SerialNumber;
    //         resObj.Responsible = markerArray[i].Responsible;

    //         historyLines.push(resObj);
    //       }
    //     }

    //     this.historyLinesList[index] = historyLines;

    //     counter += (this.historyRows - 1);
    //     index++;
    //   }

    //   console.log(this.historyLinesList)

    // });


  }

  nextPage() {
    if (this.pageCount < this.historyLinesList.length - 1) {
      this.pageNumber++;
      this.GetHistoryLines();

      this.pageCount++;
      console.log(this.pageCount)
      console.log(this.historyLinesList[this.pageCount])

      if (this.pageCount > 3) {
        this.UpdatePageNumbers();
      }

    }
  }

  previousPage() {

    if (this.pageCount > 1) {
      this.pageNumber--;
      this.GetHistoryLines();

      this.pageCount--;
      console.log(this.pageCount)
      console.log(this.historyLinesList[this.pageCount])
    }
  }

  setPageNumber(num: number) {

    this.pageCount = num;
    console.log(this.pageCount)
    console.log(this.historyLinesList[this.pageCount])

  }

  UpdatePageNumbers() {
    if (this.pageCount > this.midPageNum) {
      this.leftPageNum++;
      this.midPageNum++;
      this.rightPageNum++;
    } else if (this.pageCount < this.midPageNum) {
      this.leftPageNum--;
      this.midPageNum--;
      this.rightPageNum--;
    }

  }

  ngOnDestroy() {

    if (this.getHistoryLines && !this.getHistoryLines.closed) {
      this.getHistoryLines.unsubscribe();
    }

  }

}
