import { Component } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { deleteObject, getDownloadURL, getStorage, ref, uploadString } from "firebase/storage";
import { DbFunctionService } from '../shared/services/db-functions.service';
import { MaterialLines } from '../shared/models/material-lines.model';
import { map, Subscription } from 'rxjs';
import * as imageConversion from 'image-conversion';

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
  materialExpiryDate = '';
  isMaterialDamaged = false;
  isMaterialDeleted = false;
  CreatedAt = '';
  CreatedBy = '';
  LastUpdatedAt = '';
  LastUpdatedBy = '';
  materialPhoto = '';
  previousMaterialPhoto = '';

  isMaterialBorrowed = false;

  isSaveSuccessfull = false;

  hasPreviewPhotoChanged = false;

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


  updateMaterialLines: Subscription = new Subscription;

  constructor(private dbFunctionService: DbFunctionService) { }

  ngOnInit() {

    this.storageCategory = JSON.parse(JSON.stringify(localStorage.getItem('storageCategory')));

    if (this.storageCategory == 'mountain') this.storageCategoryDescription = 'Τμήμα Ορεινής Διάσωσης';
    else if (this.storageCategory == 'water') this.storageCategoryDescription = 'Τμήμα Υγρού Στοιχείου';
    else if (this.storageCategory == 'disaster') this.storageCategoryDescription = 'Τμήμα Αντιμετώπισης Καταστροφών';
    else if (this.storageCategory == 'firstAid') this.storageCategoryDescription = 'Τμήμα Πρώτων Βοηθειών';
    else if (this.storageCategory == 'communications') this.storageCategoryDescription = 'Τμήμα Επικοινωνιών - Έρευνας & Τεχνολογίας';
    else if (this.storageCategory == 'socialCare') this.storageCategoryDescription = 'Τμήμα Κοινωνικής Μέριμνας & Ανθρωπιστικών Αποστολών';

    this.GetItemDetailsToPreviewFromLocalStorage();

    this.GetMaterialPhotoFromStorage();

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

          imageConversion.dataURLtoFile(this.preview).then(p => {
            // imageConversion.compressAccurately(p, 300).then(res => {
            imageConversion.compress(p, 0.3).then(res => {
              imageConversion.filetoDataURL(res).then(url => {
                this.preview = url;
              });
            })
          });

        };

        reader.readAsDataURL(this.currentFile);

        this.hasPreviewPhotoChanged = true;
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

    if (this.materialId != '' && this.materialId != null && this.materialId != undefined) {
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
    updatedMaterialLine.ExpiryDate = this.materialExpiryDate;
    updatedMaterialLine.IsMaterialDamaged = this.isMaterialDamaged;
    updatedMaterialLine.IsMaterialDeleted = this.isMaterialDeleted;
    updatedMaterialLine.CreatedAt = this.CreatedAt;
    updatedMaterialLine.CreatedBy = this.CreatedBy;
    updatedMaterialLine.LastUpdatedAt = Date.now().toString();
    updatedMaterialLine.LastUpdatedBy = this.LastUpdatedBy;

    if (this.hasPreviewPhotoChanged) {
      updatedMaterialLine.Photo = this.materialName + '_' + this.materialserialNumber + '_' + Date.now().toString();
      localStorage.setItem('materialPhotoToPreview', updatedMaterialLine.Photo);

      const desertRef = ref(this.storage, this.previousMaterialPhoto);
      // Delete previous uploaded image
      deleteObject(desertRef).then(() => {
        console.log('File deleted successfully')
      }).catch((error) => {
        console.log(error)
      });

      this.storageRef = ref(this.storage, updatedMaterialLine.Photo);
      uploadString(this.storageRef, this.preview, 'data_url').then((snapshot) => {
        console.log('Uploaded image!');
      });
    } else {
      updatedMaterialLine.Photo = this.previousMaterialPhoto;
    }

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
    materialLine.ExpiryDate = this.materialExpiryDate;
    materialLine.IsMaterialDamaged = this.isMaterialDamaged;
    materialLine.IsMaterialDeleted = this.isMaterialDeleted;
    materialLine.CreatedAt = Date.now().toString();
    materialLine.CreatedBy = this.loggedInUserId;
    //materialLine.LastUpdatedAt = this.LastUpdatedAt;
    //materialLine.LastUpdatedBy = this.LastUpdatedBy;
    materialLine.Photo = this.materialName + '_' + this.materialserialNumber + '_' + Date.now().toString(); //this.materialPhoto;

    this.storageRef = ref(this.storage, materialLine.Photo);
    uploadString(this.storageRef, this.preview, 'data_url').then((snapshot) => {
      console.log('Uploaded image!');
    });

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
    if (this.materialBorrowedTo != '' && this.materialBorrowedTo != null && this.materialBorrowedTo != undefined && this.materialBorrowedTo != 'undefined') {
      this.isMaterialBorrowed = true;
    }
    this.materialBorrowedAt = JSON.parse(JSON.stringify(localStorage.getItem('materialBorrowedAtToPreview')));
    this.materialExpiryDate = JSON.parse(JSON.stringify(localStorage.getItem('materialExpiryDateToPreview')));
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
    this.previousMaterialPhoto = JSON.parse(JSON.stringify(localStorage.getItem('materialPhotoToPreview')));
  }

  GetMaterialPhotoFromStorage() {
    if (this.materialPhoto != null) {

      getDownloadURL(this.storageRef = ref(this.storage, this.materialPhoto))
        .then((url) => {
          // `url` is the download URL for 'images/stars.jpg'

          // // This can be downloaded directly:
          // const xhr = new XMLHttpRequest();
          // xhr.responseType = 'blob';
          // xhr.onload = (event) => {
          //   const blob = xhr.response;
          // };
          // xhr.open('GET', url);
          // xhr.send();

          // Or inserted into an <img> element
          this.preview = url;

        })
        .catch((error) => {
          // Handle any errors
          console.log(error)
        });

    }
  }

  ngOnDestroy() {

    if (this.updateMaterialLines && !this.updateMaterialLines.closed) {
      this.updateMaterialLines.unsubscribe();
    }

  }


}
