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
  consumableMaterialExpirationDate: Array<Date> = [];

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
  soonToExpireConsumableMaterialLinesList: MaterialLines[] = [];
  borrowedMaterialLinesList: MaterialLines[] = [];

  getMaterialLines: Subscription = new Subscription;

  constructor(private dbFunctionService: DbFunctionService, private router: Router) { }

  ngOnInit() {

    let tokenSubscription = of(null).pipe(delay(36000000)).subscribe(() => { //logout after 10 hours
      console.log('EXPIRED!')
      sessionStorage.setItem('isUserLoggedIn', 'false');
      sessionStorage.setItem('sessionExpirationDate', '');
    });

    this.isUserLoggedIn = JSON.parse(JSON.stringify(sessionStorage.getItem("isUserLoggedIn")));
    this.loggedInUserId = JSON.parse(JSON.stringify(sessionStorage.getItem("loggedInUserId")));
    this.loggedInUser.Permissions = JSON.parse(JSON.stringify(sessionStorage.getItem("loggedInUserPermissions")));
    this.loggedInUser.FirstName = JSON.parse(JSON.stringify(sessionStorage.getItem("loggedInUserFirstName")));
    this.loggedInUser.LastName = JSON.parse(JSON.stringify(sessionStorage.getItem("loggedInUserLastName")));

    ////this.loggedInUserId='';
    //console.log(this.loggedInUserId)
    //if (this.loggedInUserId == '') {
    /////this.GetLoggedInUserDetails();
    //}

    this.GetFMaterialLines();

  }

  GetFMaterialLines() {
    this.soonToExpireMaterialLinesList = [];
    this.soonToExpireConsumableMaterialLinesList = [];
    this.materialExpirationDate = [];
    this.consumableMaterialExpirationDate = [];
    this.borrowedMaterialLinesList = [];

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
                resObj.AvailableMaterialQuantity = data.AvailableMaterialQuantity;
                resObj.StorageCategory = data.StorageCategory;
                resObj.StoringPlace = data.StoringPlace;
                resObj.StoredNearRepeater = data.StoredNearRepeater;//
                resObj.BorrowedTo = data.BorrowedTo;
                resObj.BorrowedAt = data.BorrowedAt;
                resObj.BorrowedMaterialQuantity = data.BorrowedMaterialQuantity;
                resObj.ExpiryDate = data.ExpiryDate;
                resObj.IsMaterialDamaged = data.IsMaterialDamaged;
                resObj.DamagedMaterialQuantity = data.DamagedMaterialQuantity;
                resObj.IsMaterialDeleted = data.IsMaterialDeleted;
                resObj.DeletedMaterialQuantity = data.DeletedMaterialQuantity;
                resObj.IsMaterialConsumable = data.IsMaterialConsumable;
                resObj.CreatedAt = data.CreatedAt;
                resObj.CreatedBy = data.CreatedBy;
                resObj.LastUpdatedAt = data.LastUpdatedAt;
                resObj.LastUpdatedBy = data.LastUpdatedBy;
                resObj.Photo = data.Photo;

                if (data.IsMaterialDamaged && data.AvailableMaterialQuantity==0) {
                  //do nothing
                } else if (data.IsMaterialDeleted && data.AvailableMaterialQuantity==0) {
                  //do nothing
                } else if (data.BorrowedTo) {
                  this.borrowedMaterialLinesList.push(resObj);
                } else {
                  
                  let threeMonthsPriorDate = new Date(new Date(resObj.ExpiryDate).setMonth(new Date(resObj.ExpiryDate).getMonth() - 3));
                  
                  if (this.todaysDate >= threeMonthsPriorDate) {
                    //console.log('todayDate ',this.todaysDate.toDateString())
                    //console.log("expirationDate: " + this.materialExpirationDate[responseData.indexOf(data)].toDateString());
                    //console.log("3 months Prior Date: " + threeMonthsPriorDate.toLocaleDateString());

                    if (data.IsMaterialConsumable) {
                      this.soonToExpireConsumableMaterialLinesList.push(resObj);
                      this.consumableMaterialExpirationDate.push(new Date(resObj.ExpiryDate));
                      
                      console.log(this.soonToExpireConsumableMaterialLinesList)
                    } else {
                      this.soonToExpireMaterialLinesList.push(resObj);
                      this.materialExpirationDate.push(new Date(resObj.ExpiryDate));
                      
                      console.log(this.soonToExpireMaterialLinesList)
                    }
                    
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

  SetMaterialDetailsTosessionStorage(soonToExpireMaterial: MaterialLines) {

    if (soonToExpireMaterial.StorageCategory == 'Τμήμα Ορεινής Διάσωσης') this.storageCategory = 'mountain';
    else if (soonToExpireMaterial.StorageCategory == 'Τμήμα Υγρού Στοιχείου') this.storageCategory = 'water';
    else if (soonToExpireMaterial.StorageCategory == 'Τμήμα Αντιμετώπισης Καταστροφών') this.storageCategory = 'disaster';
    else if (soonToExpireMaterial.StorageCategory == 'Τμήμα Πρώτων Βοηθειών') this.storageCategory = 'firstAid';
    else if (soonToExpireMaterial.StorageCategory == 'Τμήμα Επικοινωνιών - Έρευνας & Τεχνολογίας') this.storageCategory = 'communications';
    else if (soonToExpireMaterial.StorageCategory == 'Τμήμα Κοινωνικής Μέριμνας & Ανθρωπιστικών Αποστολών') this.storageCategory = 'socialCare';
  
    //console.log(this.storageCategory+'/material-lines'+'/item/'+ soonToExpireMaterial.SerialNumber)

    sessionStorage.setItem('materialState', 'available');

    sessionStorage.setItem('materialIdToPreview', soonToExpireMaterial.Id);
    sessionStorage.setItem('materialNameToPreview', soonToExpireMaterial.MaterialName);
    sessionStorage.setItem('materialserialNumberToPreview', soonToExpireMaterial.SerialNumber);
    sessionStorage.setItem('materialQuantityToPreview', soonToExpireMaterial.AvailableMaterialQuantity.toString()); // material.Quantity.toString()
    sessionStorage.setItem('availableMaterialQuantityToPreview', soonToExpireMaterial.AvailableMaterialQuantity.toString());
    sessionStorage.setItem('materialStorageCategoryToPreview', this.storageCategory);
    sessionStorage.setItem('storageCategory', this.storageCategory);
    sessionStorage.setItem('materialStoringPlaceToPreview', soonToExpireMaterial.StoringPlace);
    sessionStorage.setItem('materialStoredNearRepeaterToPreview', soonToExpireMaterial.StoredNearRepeater);
    sessionStorage.setItem('materialBorrowedToToPreview', soonToExpireMaterial.BorrowedTo);
    sessionStorage.setItem('materialBorrowedAtToPreview', soonToExpireMaterial.BorrowedAt);
    sessionStorage.setItem('materialBorrowedQuantityToPreview', soonToExpireMaterial.BorrowedMaterialQuantity.toString());
    sessionStorage.setItem('materialExpiryDateToPreview', soonToExpireMaterial.ExpiryDate);
    sessionStorage.setItem('isMaterialDamagedToPreview', soonToExpireMaterial.IsMaterialDamaged.toString());
    sessionStorage.setItem('damagedMaterialQuantityToPreview', soonToExpireMaterial.DamagedMaterialQuantity.toString());
    sessionStorage.setItem('isMaterialDeletedToPreview', soonToExpireMaterial.IsMaterialDeleted.toString());
    sessionStorage.setItem('deletedMaterialQuantityToPreview', soonToExpireMaterial.DeletedMaterialQuantity.toString());
    sessionStorage.setItem('isMaterialConsumableToPreview', soonToExpireMaterial.IsMaterialConsumable.toString());
    sessionStorage.setItem('CreatedAtToPreview', soonToExpireMaterial.CreatedAt);
    sessionStorage.setItem('CreatedByToPreview', soonToExpireMaterial.CreatedBy);
    sessionStorage.setItem('LastUpdatedAtToPreview', soonToExpireMaterial.LastUpdatedAt);
    sessionStorage.setItem('LastUpdatedByToPreview', soonToExpireMaterial.LastUpdatedBy);
    sessionStorage.setItem('materialPhotoToPreview', soonToExpireMaterial.Photo);

    this.router.navigate([this.storageCategory+'/material-lines'+'/item/'+ soonToExpireMaterial.SerialNumber]);
  }


  ngOnDestroy() {

    if (this.getMaterialLines && !this.getMaterialLines.closed) {
      this.getMaterialLines.unsubscribe();
    }

  }


}
