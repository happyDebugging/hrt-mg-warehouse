import { Component, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { environment } from '../../environments/environment';

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

  ngOnInit() {

    this.isUserLoggedIn = JSON.parse(JSON.stringify(localStorage.getItem("isUserLoggedIn")));
    this.loggedInUserId = JSON.parse(JSON.stringify(localStorage.getItem("loggedInUserId")));

    console.log(this.loggedInUserId)

  }

  AuthenticateUser() {

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

        //this.accessToken = user.accessToken;

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


}
