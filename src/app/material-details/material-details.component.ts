import { Component } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { DbFunctionService } from '../shared/services/db-functions.service';
import { MaterialLines } from '../shared/models/material-lines.model';
import { map, Subscription } from 'rxjs';

@Component({
  selector: 'app-material-details',
  templateUrl: './material-details.component.html',
  styleUrl: './material-details.component.css',
})
export class MaterialDetailsComponent {

  loggedInUserId = '';
  isUserLoggedIn = false;

  storageCategory = '';
  storageCategoryDescription = '';
  materialLines = [];
  isNewMaterialLineAdded = false;

  preview = 'photo-file.gif';
  currentFile?: File;

  materialId = '';
  materialName = '';
  materialserialNumber = '';
  materialQuantity = 0;
  materialStorageCategory = '';
  materialStoringPlace = '';
  materialStoredNearRepeater = '';
  materialBorrowedTo = '';
  materialBorrowedAt = '';
  isMaterialDamaged = false;
  isMaterialDeleted = false;
  CreatedAt = '';
  CreatedBy = '';
  LastUpdatedAt = '';
  LastUpdatedBy = '';
  materialPhoto = '';

  isMaterialBorrowed = false;

  isSaveSuccessfull = false;

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

  updateMaterialLines: Subscription = new Subscription;

  constructor(private dbFunctionService: DbFunctionService) { }

  ngOnInit() {

    // Initialize Firebase
    const firebaseApp = initializeApp(this.firebaseConfig);
    // Initialize Realtime Database and get a reference to the service
    const database = getDatabase(firebaseApp);

    this.storageCategory = JSON.parse(JSON.stringify(localStorage.getItem('storageCategory')));

    if (this.storageCategory == 'mountain') this.storageCategoryDescription = 'Τμήμα Ορεινής Διάσωσης';
    else if (this.storageCategory == 'water') this.storageCategoryDescription = 'Τμήμα Υγρού Στοιχείου';
    else if (this.storageCategory == 'disaster') this.storageCategoryDescription = 'Τμήμα Αντιμετώπισης Καταστροφών';
    else if (this.storageCategory == 'firstAid') this.storageCategoryDescription = 'Τμήμα Πρώτων Βοηθειών';
    else if (this.storageCategory == 'communications') this.storageCategoryDescription = 'Τμήμα Επικοινωνιών - Έρευνας & Τεχνολογίας';
    else if (this.storageCategory == 'socialCare') this.storageCategoryDescription = 'Τμήμα Κοινωνικής Μέριμνας & Ανθρωπιστικών Αποστολών';

    this.GetItemDetailsToPreviewFromLocalStorage();

  }

  selectFile(event: any) {
    this.preview = '';
    const selectedFiles = event.target.files;

    if (selectedFiles) {
      const file: File | null = selectedFiles.item(0);

      if (file) {
        this.preview = '';
        this.currentFile = file;

        const reader = new FileReader();

        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.preview = e.target.result;
        };

        reader.readAsDataURL(this.currentFile);
      }
    }
  }

  SetMaterialAsBorrowed(value: string) {
    if (value == 'borrowed') this.isMaterialBorrowed = true;
    else this.isMaterialBorrowed = false;
  }

  RadioSelectMaterialDamagedState(isMaterialDamaged: boolean) {
    this.isMaterialDeleted = false;
  }

  RadioSelectMaterialDeletedState(isMaterialDamaged: boolean) {
    this.isMaterialDamaged = false;
  }

  DecideOnSaveMethod() {

    console.log('this.materialId ' + this.materialId)

    if (this.materialId != '' && this.materialId != null  && this.materialId != undefined) {
      this.UpdateMaterialLine();
    } else {
      this.PostMaterialLine();
    }

  }

  UpdateMaterialLine() {

    let updatedMaterialLine = new MaterialLines;

    updatedMaterialLine.Id = this.materialId;
    updatedMaterialLine.MaterialName = this.materialName;
    updatedMaterialLine.SerialNumber = this.materialserialNumber;
    updatedMaterialLine.Quantity = this.materialQuantity;
    updatedMaterialLine.StorageCategory = this.storageCategoryDescription;
    updatedMaterialLine.StoringPlace = this.materialStoringPlace;
    updatedMaterialLine.StoredNearRepeater = this.materialStoredNearRepeater;//
    if (!this.isMaterialBorrowed) {
      updatedMaterialLine.BorrowedTo = '';
      updatedMaterialLine.BorrowedAt = '';
    } else {
      updatedMaterialLine.BorrowedTo = this.materialBorrowedTo;
      updatedMaterialLine.BorrowedAt = this.materialBorrowedAt;
    }
    updatedMaterialLine.IsMaterialDamaged = this.isMaterialDamaged;
    updatedMaterialLine.IsMaterialDeleted = this.isMaterialDeleted;
    updatedMaterialLine.CreatedAt = this.CreatedAt;
    updatedMaterialLine.CreatedBy = this.CreatedBy;
    updatedMaterialLine.LastUpdatedAt = Date.now().toString();
    updatedMaterialLine.LastUpdatedBy = this.LastUpdatedBy;
    updatedMaterialLine.Photo = this.materialPhoto;

    this.updateMaterialLines = this.dbFunctionService.updateMaterialLinesToDb(updatedMaterialLine)
      .pipe(map((response: any) => {

        this.isSaveSuccessfull = true;

        setTimeout(() => {
          this.isSaveSuccessfull = false;
        }, 2000);

      }))
      .subscribe(
        (res: any) => {
          if ((res != null) || (res != undefined)) {
            console.log(res)
          }
        },
        err => {
          console.log(err);
        }
      );
  }

  PostMaterialLine() {

    let materialLine = new MaterialLines;
    console.log(this.materialId)

    materialLine.Id = this.materialId;
    materialLine.MaterialName = this.materialName;
    materialLine.SerialNumber = this.materialserialNumber;
    materialLine.Quantity = this.materialQuantity;
    materialLine.StorageCategory = this.storageCategoryDescription;
    materialLine.StoringPlace = this.materialStoringPlace;
    materialLine.StoredNearRepeater = this.materialStoredNearRepeater;//
    materialLine.BorrowedTo = this.materialBorrowedTo;
    materialLine.BorrowedAt = this.materialBorrowedAt;
    materialLine.IsMaterialDamaged = this.isMaterialDamaged;
    materialLine.IsMaterialDeleted = this.isMaterialDeleted;
    materialLine.CreatedAt = Date.now().toString();
    materialLine.CreatedBy = this.loggedInUserId;
    //materialLine.LastUpdatedAt = this.LastUpdatedAt;
    //materialLine.LastUpdatedBy = this.LastUpdatedBy;
    materialLine.Photo = this.materialPhoto;

    this.dbFunctionService.postMaterialLineToDb(materialLine)
      .subscribe(
        (res: any) => {
          console.log(res);
          if ((res != null) || (res != undefined)) {

            this.isNewMaterialLineAdded = true;

            this.isSaveSuccessfull = true;

            setTimeout(() => {
              this.isSaveSuccessfull = false;
            }, 2000);

          }
        },
        err => {
          console.log(err);
        }
      );
  }

  GetItemDetailsToPreviewFromLocalStorage() {
    this.materialId = JSON.parse(JSON.stringify(localStorage.getItem('materialIdToPreview')));
    this.materialName = JSON.parse(JSON.stringify(localStorage.getItem('materialNameToPreview')));
    this.materialserialNumber = JSON.parse(JSON.stringify(localStorage.getItem('materialserialNumberToPreview')));
    this.materialQuantity = JSON.parse(JSON.stringify(localStorage.getItem('materialQuantityToPreview')));
    this.materialStorageCategory = JSON.parse(JSON.stringify(localStorage.getItem('materialStorageCategoryToPreview')));
    this.materialStoringPlace = JSON.parse(JSON.stringify(localStorage.getItem('materialStoringPlaceToPreview')));
    this.materialStoredNearRepeater = JSON.parse(JSON.stringify(localStorage.getItem('materialStoredNearRepeaterToPreview')));
    this.materialBorrowedTo = JSON.parse(JSON.stringify(localStorage.getItem('materialBorrowedToToPreview')));
    if (this.materialBorrowedTo!='' && this.materialBorrowedTo!=null && this.materialBorrowedTo!=undefined  && this.materialBorrowedTo!='undefined') {
      this.isMaterialBorrowed = true;
    }
    this.materialBorrowedAt = JSON.parse(JSON.stringify(localStorage.getItem('materialBorrowedAtToPreview')));
    if (JSON.parse(JSON.stringify(localStorage.getItem('isMaterialDamagedToPreview'))) == 'true') {
      this.isMaterialDamaged = true;
    } else this.isMaterialDamaged = false;
    if (JSON.parse(JSON.stringify(localStorage.getItem('isMaterialDeletedToPreview'))) == 'true') {
      this.isMaterialDeleted = true;
    } else this.isMaterialDeleted = false;
    this.CreatedAt = JSON.parse(JSON.stringify(localStorage.getItem('CreatedAtToPreview')));
    this.CreatedBy = JSON.parse(JSON.stringify(localStorage.getItem('CreatedByToPreview')));
    this.LastUpdatedAt = JSON.parse(JSON.stringify(localStorage.getItem('LastUpdatedAtToPreview')));
    this.LastUpdatedBy = JSON.parse(JSON.stringify(localStorage.getItem('LastUpdatedByToPreview')));
    this.materialPhoto = JSON.parse(JSON.stringify(localStorage.getItem('materialPhotoToPreview')));
  }

  ngOnDestroy() {

    if (this.updateMaterialLines && !this.updateMaterialLines.closed) {
      this.updateMaterialLines.unsubscribe();
    }

  }


}
