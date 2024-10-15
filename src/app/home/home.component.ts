import { Component, OnInit } from '@angular/core';
import { delay, map, of, Subscription } from 'rxjs';
import { DbFunctionService } from '../shared/services/db-functions.service';
import { MaterialLines } from '../shared/models/material-lines.model';
import { Router } from '@angular/router';

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

  constructor(private dbFunctionService: DbFunctionService, private router: Router) { }

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
                    console.log('todayDate ',this.todaysDate.toISOString())
                    console.log("expirationDate: " + this.materialExpirationDate[responseData.indexOf(data)].toISOString());
                    //console.log("3 months Prior Date: " + threeMonthsPriorDate.toLocaleDateString());

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

  SetMaterialDetailsToLocalStorage(soonToExpireMaterial: MaterialLines) {

    if (soonToExpireMaterial.StorageCategory == 'Τμήμα Ορεινής Διάσωσης') this.storageCategory = 'mountain';
    else if (soonToExpireMaterial.StorageCategory == 'Τμήμα Υγρού Στοιχείου') this.storageCategory = 'water';
    else if (soonToExpireMaterial.StorageCategory == 'Τμήμα Αντιμετώπισης Καταστροφών') this.storageCategory = 'disaster';
    else if (soonToExpireMaterial.StorageCategory == 'Τμήμα Πρώτων Βοηθειών') this.storageCategory = 'firstAid';
    else if (soonToExpireMaterial.StorageCategory == 'Τμήμα Επικοινωνιών - Έρευνας & Τεχνολογίας') this.storageCategory = 'communications';
    else if (soonToExpireMaterial.StorageCategory == 'Τμήμα Κοινωνικής Μέριμνας & Ανθρωπιστικών Αποστολών') this.storageCategory = 'socialCare';
  
    console.log(this.storageCategory+'/material-lines'+'/item/'+ soonToExpireMaterial.SerialNumber)

    localStorage.setItem('materialIdToPreview', soonToExpireMaterial.Id);
    localStorage.setItem('materialNameToPreview', soonToExpireMaterial.MaterialName);
    localStorage.setItem('materialserialNumberToPreview', soonToExpireMaterial.SerialNumber);
    localStorage.setItem('materialQuantityToPreview', soonToExpireMaterial.Quantity.toString());
    localStorage.setItem('materialStorageCategoryToPreview', soonToExpireMaterial.StorageCategory);
    localStorage.setItem('materialStoringPlaceToPreview', soonToExpireMaterial.StoringPlace);
    localStorage.setItem('materialStoredNearRepeaterToPreview', soonToExpireMaterial.StoredNearRepeater);
    localStorage.setItem('materialBorrowedToToPreview', soonToExpireMaterial.BorrowedTo);
    localStorage.setItem('materialBorrowedAtToPreview', soonToExpireMaterial.BorrowedAt);
    localStorage.setItem('materialExpiryDateToPreview', soonToExpireMaterial.ExpiryDate);
    localStorage.setItem('isMaterialDamagedToPreview', soonToExpireMaterial.IsMaterialDamaged.toString());
    localStorage.setItem('isMaterialDeletedToPreview', soonToExpireMaterial.IsMaterialDeleted.toString());
    localStorage.setItem('CreatedAtToPreview', soonToExpireMaterial.CreatedAt);
    localStorage.setItem('CreatedByToPreview', soonToExpireMaterial.CreatedBy);
    localStorage.setItem('LastUpdatedAtToPreview', soonToExpireMaterial.LastUpdatedAt);
    localStorage.setItem('LastUpdatedByToPreview', soonToExpireMaterial.LastUpdatedBy);
    localStorage.setItem('materialPhotoToPreview', soonToExpireMaterial.Photo);

    this.router.navigate([this.storageCategory+'/material-lines'+'/item/'+ soonToExpireMaterial.SerialNumber]);
  }


  ngOnDestroy() {

    if (this.getMaterialLines && !this.getMaterialLines.closed) {
      this.getMaterialLines.unsubscribe();
    }

  }


}
