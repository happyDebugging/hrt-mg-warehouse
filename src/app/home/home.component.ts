import { Component, OnInit } from '@angular/core';
import { delay, map, of, Subscription } from 'rxjs';
import { DbFunctionService } from '../shared/services/db-functions.service';
import { MaterialLines } from '../shared/models/material-lines.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  todaysDate = new Date();
  materialExpirationDate: Array<Date> = [];

  loggedInUserId = '';
  isUserLoggedIn = false;

  loggedInUser = {
    Id: '',
    UserId: '',
    FirstName: '',
    LastName: '',
    Email: '',
    Permissions: ''
  };

  storageCategory = '';
  storageCategoryDescription = '';
  soonToExpireMaterialLinesList: MaterialLines[] = [];

  getMaterialLines: Subscription = new Subscription;

  constructor(private dbFunctionService: DbFunctionService) { }

  ngOnInit() {

    let tokenSubscription = of(null).pipe(delay(36000000)).subscribe(() => { //logout after 10 hours
      console.log('EXPIRED!')
      localStorage.setItem('isUserLoggedIn', 'false');
      localStorage.setItem('sessionExpirationDate', '');
    });

    this.isUserLoggedIn = JSON.parse(JSON.stringify(localStorage.getItem("isUserLoggedIn")));
    this.loggedInUserId = JSON.parse(JSON.stringify(localStorage.getItem("loggedInUserId")));
    this.loggedInUser.Permissions = JSON.parse(JSON.stringify(localStorage.getItem("loggedInUserPermissions")));
    this.loggedInUser.FirstName = JSON.parse(JSON.stringify(localStorage.getItem("loggedInUserFirstName")));
    this.loggedInUser.LastName = JSON.parse(JSON.stringify(localStorage.getItem("loggedInUserLastName")));

    ////this.loggedInUserId='';
    //console.log(this.loggedInUserId)
    //if (this.loggedInUserId == '') {
    /////this.GetLoggedInUserDetails();
    //}

    this.GetFMaterialLines();

  }

  // GetLoggedInUserDetails() {

  //   this.dbFunctionService.getUserDetailsFromDb()
  //     .pipe(map((response: any) => {
  //       let markerArray: Users[] = [];

  //       for (const key in response) {
  //         if (response.hasOwnProperty(key)) {

  //           markerArray.push({ ...response[key], Id: key })

  //         }
  //       }

  //       return markerArray.reverse();
  //     }))
  //     .subscribe(
  //       (res: any) => {
  //         if ((res != null) || (res != undefined)) {
  //           //console.log(res)
  //           const responseData = new Array<Users>(...res);

  //           for (const data of responseData) {

  //             const resObj = new Users();

  //             resObj.Id = data.Id;
  //             resObj.UserId = data.UserId;
  //             resObj.FirstName = data.FirstName;
  //             resObj.LastName = data.LastName;
  //             resObj.Email = data.Email;
  //             resObj.Permissions = data.Permissions;

  //             if (this.loggedInUserId == resObj.UserId) {
  //               this.loggedInUser = resObj;
  //               console.log(this.loggedInUser.Id, ' ', this.loggedInUser.FirstName)
  //               console.log('this.loggedInUser.Permissions2', ' ', this.loggedInUser.Permissions)
  //               localStorage.setItem('loggedInUserName', this.loggedInUser.FirstName + ' ' + this.loggedInUser.LastName);
  //               localStorage.setItem("loggedInUserPermissions", this.loggedInUser.Permissions);
  //             }

  //           }
  //         }
  //       },
  //       err => {
  //         console.log(err);
  //       }
  //     );
  // }


  GetFMaterialLines() {
    this.soonToExpireMaterialLinesList = [];
    this.materialExpirationDate = [];

    this.getMaterialLines = this.dbFunctionService.getMaterialLinesFromDb()
      .pipe(map((response: any) => {
        let markerArray: MaterialLines[] = [];

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
            //console.log(res)
            const responseData = new Array<MaterialLines>(...res);

            for (const data of responseData) {
              //console.log(data.StorageCategory, ' ', this.loggedInUser.Permissions)

              if (data.StorageCategory == this.loggedInUser.Permissions || this.loggedInUser.Permissions == 'All') {

                const resObj = new MaterialLines();

                resObj.Id = data.Id;
                resObj.MaterialName = data.MaterialName;
                resObj.SerialNumber = data.SerialNumber;
                resObj.Quantity = data.Quantity;
                resObj.StorageCategory = data.StorageCategory;
                resObj.StoringPlace = data.StoringPlace;
                resObj.StoredNearRepeater = data.StoredNearRepeater;//
                resObj.BorrowedTo = data.BorrowedTo;
                resObj.BorrowedAt = data.BorrowedAt;
                resObj.ExpiryDate = data.ExpiryDate;
                resObj.IsMaterialDamaged = data.IsMaterialDamaged;
                resObj.IsMaterialDeleted = data.IsMaterialDeleted;
                resObj.CreatedAt = data.CreatedAt;
                resObj.CreatedBy = data.CreatedBy;
                resObj.LastUpdatedAt = data.LastUpdatedAt;
                resObj.LastUpdatedBy = data.LastUpdatedBy;
                resObj.Photo = data.Photo;

                if (data.IsMaterialDamaged) {
                  //do nothing
                } else if (data.IsMaterialDeleted) {
                  //do nothing
                } else {
                  
                  this.materialExpirationDate[responseData.indexOf(data)] = new Date(resObj.ExpiryDate);
                  
                  let threeMonthsPriorDate = new Date(new Date(resObj.ExpiryDate).setMonth(new Date(resObj.ExpiryDate).getMonth() - 3));
                  
                  if (this.todaysDate >= threeMonthsPriorDate) {
                    //console.log("expirationDate: " + this.materialExpirationDate[responseData.indexOf(data)]);
                    //console.log("3 months Prior Date: " + threeMonthsPriorDate.toLocaleDateString());
                    //console.log('todayDate ',this.todaysDate.toLocaleDateString())

                    this.soonToExpireMaterialLinesList.push(resObj);
                    console.log(this.soonToExpireMaterialLinesList)
                  }

                }

              }

            }

          }
        },
        err => {
          //console.log(err);
        }
      );
  }


  ngOnDestroy() {

    if (this.getMaterialLines && !this.getMaterialLines.closed) {
      this.getMaterialLines.unsubscribe();
    }

  }


}
