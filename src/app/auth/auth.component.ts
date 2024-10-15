import { Component, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit {

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

  hasForgottenPassword = false;
  emailSent = false;

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

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.hasForgottenPassword = false;

    localStorage.setItem('isUserLoggedIn', this.isUserLoggedIn.toString());

    this.isUserLoggedIn = JSON.parse(JSON.stringify(localStorage.getItem("isUserLoggedIn")));
    this.loggedInUserId = JSON.parse(JSON.stringify(localStorage.getItem("loggedInUserId")));

    console.log(this.loggedInUserId)

  }

  EnterMailForPasswordReset() {
    this.hasForgottenPassword = true;
    this.emailSent = false;
  }

  ReturnToSignIn() {
    this.hasForgottenPassword = false;
  }

  ResetPassword() {
    sendPasswordResetEmail(this.auth, this.userEmail)
      .then(() => {

        this.emailSent = true;

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(errorMessage)

      });
  }

  Login() {
    localStorage.setItem('userEmail', this.userEmail);
    localStorage.setItem('userPassword', this.userPassword);

    this.errorMessageToShow = '';
    this.authService.AuthenticateUser().then(res => {
      this.errorMessageToShow = JSON.parse(JSON.stringify(localStorage.getItem("signinErrorMessage")));
      if (this.errorMessageToShow != '') {
        console.log('111111111111111111111')
        this.isCredentialsWrong = true;
      } else {
        console.log('22222222222222')
        this.isCredentialsWrong = false;
      }
    });

  }

}
