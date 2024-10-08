import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { environment } from '../../environments/environment.development';
//import { environment } from '../../environments/environment';
import { DbFunctionService } from '../shared/services/db-functions.service';
import { map } from 'rxjs';
import { Users } from '../shared/models/users.model';

@Injectable()
export class AuthService {

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

  // Initialize Firebase Authentication and get a reference to the service
  auth = getAuth(this.firebaseApp);

  constructor(private http: HttpClient, private router: Router, private dbFunctionService: DbFunctionService) { }

  AuthenticateUser() {

    this.userEmail = JSON.parse(JSON.stringify(localStorage.getItem("userEmail")));
    this.userPassword = JSON.parse(JSON.stringify(localStorage.getItem("userPassword")));

    this.errorMessageToShow = '';

    signInWithEmailAndPassword(this.auth, this.userEmail.trim(), this.userPassword.trim())
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;

        this.isUserLoggedIn = true;
        localStorage.setItem("isUserLoggedIn", "true");

        this.isCredentialsWrong = false;

        this.userEmail = '';
        this.userPassword = '';

        this.loggedInUserId = user.uid;
        localStorage.setItem("loggedInUserId", user.uid);

        //this.GetLoggedInUserDetails();

        //this.accessToken = user.accessToken;

        console.log(this.isUserLoggedIn);
        localStorage.setItem('isUserLoggedIn', this.isUserLoggedIn.toString());

        window.location.href = environment.appUrl + '/home';

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(error.code)

        if (error.code = 'auth/invalid-credential') {
          this.errorMessageToShow = 'Λάθος email ή κωδικός πρόσβασης.';
        } else if (error.code = 'auth/too-many-requests') {
          this.errorMessageToShow = 'Υπέρβαση προσπαθειών σύνδεσης, προσπαθήστε αργότερα.';
        } else {
          this.errorMessageToShow = '';
        }

        this.isUserLoggedIn = false;
        localStorage.clear();

        this.isCredentialsWrong = true;
      });

  }

  // GetLoggedInUserDetails() {

  //   this.dbFunctionService.getUserDetailsFromDb()
  //     .pipe(map((response: any) => {
        
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
  //             resObj.StorageCategory = data.StorageCategory;

  //             if (this.loggedInUserId == resObj.UserId) {
  //               this.loggedInUser = resObj;
  //               console.log(this.loggedInUser.Id, ' ',this.loggedInUser.FirstName)
  //             }
              
  //           }
  //         }
  //       },
  //       err => {
  //         console.log(err);
  //       }
  //     );

  // }

  LogoutUser() {
    this.isUserLoggedIn = JSON.parse(JSON.stringify(localStorage.getItem("isUserLoggedIn")));

    this.router.navigate(['auth']);
    console.log('this.isUserLoggedIn1 ' + this.isUserLoggedIn)
    return this.isUserLoggedIn;
  }


}
