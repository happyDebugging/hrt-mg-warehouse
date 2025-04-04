import { Component } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';
import { AuthService } from '../auth/auth.service';
import { DbFunctionService } from '../shared/services/db-functions.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {

  href: string = '';

  sessionToken = '';
  userEmail = '';

  newUserPassword = '';
  newUserPasswordConfirmation = '';
  isPassword6Characters = true;
  isChangePasswordSuccessfull = false;
  errorMessageToShow = '';

  // Initialize Supabase
  private supabase: SupabaseClient

  constructor(private dbFunctionService: DbFunctionService, private router: Router) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  ngOnInit() {
    this.href = this.router.url;
    this.sessionToken = this.href.substr(this.href.lastIndexOf('token/') + 6, 6);
    this.userEmail = this.href.substr(this.href.lastIndexOf('/') + 1);
    console.log(this.sessionToken)
  }

  async UpdateUserPassword() {
    //await this.supabase.auth.exchangeCodeForSession(this.sessionToken).then(async (res) => {

      await this.supabase.auth.updateUser({ password: this.newUserPassword })
      .then((res) => {
        console.log(res)
        // Update successful
        this.isChangePasswordSuccessfull = true;

        this.newUserPassword = '';
        this.newUserPasswordConfirmation = '';
        this.isPassword6Characters = true;

        //this.UpdateUserPasswordInDb();

        setTimeout(() => {
          this.isChangePasswordSuccessfull = false;
          //window.location.href = environment.appUrl + '/auth';
        }, 2500);

      }).catch((error) => {
        console.log(error)

        this.isPassword6Characters = false;
      });

    //});
    
  }

  UpdateUserPasswordInDb() {

    // const hasChangedPassword = true;

    // this.dbFunctionService.updateUserPasswordToDb(this.userEmail, hasChangedPassword)
    //   .then(
    //     (res: any) => {
    //       if ((res != null) || (res != undefined)) {
    //         console.log(res)
    //       }
    //     },
    //     err => {
    //       console.log(err);
    //     }
    //   );
  }

}
