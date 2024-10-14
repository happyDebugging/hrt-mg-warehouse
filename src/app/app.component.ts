import { Component, ViewChild } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { DbFunctionService } from './shared/services/db-functions.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { getAuth, updatePassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'hrt-mg-warehouse';

  storageCategory = '';
  loggedInUserPermissions = '';

  userEmail = '';
  userPassword = '';
  accessToken = '';
  isCredentialsWrong = false;
  loggedInUserId = '';
  isUserLoggedIn = false;
  newUserPassword = '';
  newUserPasswordConfirmation = '';
  isPassword6Characters = true;
  isChangePasswordSuccessfull = false;
  errorMessageToShow = '';

  loggedInUser = {
    Id: '',
    UserId: '',
    FirstName: '',
    LastName: '',
    Email: '',
    Permissions: ''
  };

  @ViewChild('updatePassword') updatePassword: any;

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
  auth: any;


  constructor(private authService: AuthService, private dbFunctionService: DbFunctionService, private modalService: NgbModal) { }

  ngOnInit() {
    // Initialize Firebase Authentication and get a reference to the service
    this.auth = getAuth(this.firebaseApp);

    this.isUserLoggedIn = JSON.parse(JSON.stringify(localStorage.getItem("isUserLoggedIn")));
    this.loggedInUserId = JSON.parse(JSON.stringify(localStorage.getItem("loggedInUserId")));
    this.loggedInUserPermissions = JSON.parse(JSON.stringify(localStorage.getItem("loggedInUserPermissions")));
    console.log('this.loggedInUserPermissions1 ' + this.loggedInUserPermissions)

    if (JSON.parse(JSON.stringify(localStorage.getItem("isUserLoggedIn"))) == 'true') this.isUserLoggedIn = true; else this.isUserLoggedIn = false;
    console.log('this.isUserLoggedIn4 ' + this.isUserLoggedIn)

    this.storageCategory = JSON.parse(JSON.stringify(localStorage.getItem('storageCategory')));

    // this.dbFunctionService.postUsersToDb()
    //   .subscribe(
    //     (res: any) => {
    //       console.log(res);
    //       if ((res != null) || (res != undefined)) {

    //       }
    //     },
    //     err => {
    //       console.log(err);
    //     }
    //   );

  }

  SetMountainCategory() {
    localStorage.setItem('storageCategory', 'mountain');
    console.log('mountain')
  }

  SetWaterCategory() {
    localStorage.setItem('storageCategory', 'water');
    console.log('water')
  }

  SetDisasterCategory() {
    localStorage.setItem('storageCategory', 'disaster');
    console.log('disaster')
  }

  SetFirstAidCategory() {
    localStorage.setItem('storageCategory', 'firstAid');
    console.log('firstAid')
  }

  SetCommunicationsCategory() {
    localStorage.setItem('storageCategory', 'communications');
    console.log('communications')
  }

  SetSocialCareCategory() {
    localStorage.setItem('storageCategory', 'socialCare');
    console.log('socialCare')
  }

  ToggleNavBarControls() {
    this.isUserLoggedIn = true;
  }

  PrepareToUpdateUserPassword() {
    this.modalService.open(this.updatePassword, { centered: true, size: 'sm', windowClass: 'zindex' });
  }

  UpdateUserPassword() {

    const user = this.auth.currentUser;

    updatePassword(user, this.newUserPassword).then(() => {
      // Update successful.
      //this.modalService.dismissAll();
      this.isChangePasswordSuccessfull = true;

      this.newUserPassword = '';
      this.newUserPasswordConfirmation = '';
      this.isPassword6Characters = true;

      setTimeout(() => {
        this.DismillModal();
        this.isChangePasswordSuccessfull = false;

        this.Logout();

      }, 2500);

    }).catch((error) => {
      console.log(error)

      this.isPassword6Characters = false;
    });
  }

  DismillModal() {
    this.modalService.dismissAll();
  }

  Logout() {
    this.isUserLoggedIn = false;

    localStorage.setItem('isUserLoggedIn', this.isUserLoggedIn.toString());
    localStorage.setItem('sessionExpirationDate', '');

    this.authService.LogoutUser();

    console.log('this.isUserLoggedIn2 ' + JSON.parse(JSON.stringify(localStorage.getItem("isUserLoggedIn"))))
  }


}
