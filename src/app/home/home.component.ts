import { Component, OnInit } from '@angular/core';
import { Users } from '../shared/models/users.model';
import { map } from 'rxjs';
import { DbFunctionService } from '../shared/services/db-functions.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

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

  constructor(private dbFunctionService: DbFunctionService) { }
  
  ngOnInit() {

    this.isUserLoggedIn = JSON.parse(JSON.stringify(localStorage.getItem("isUserLoggedIn")));
    this.loggedInUserId = JSON.parse(JSON.stringify(localStorage.getItem("loggedInUserId")));

    //this.loggedInUserId='';
    console.log(this.loggedInUserId)
    if (this.loggedInUserId == '') {
      this.GetLoggedInUserDetails();
    }
    
  }

  GetLoggedInUserDetails() {
    
    this.dbFunctionService.getUserDetailsFromDb()
      .pipe(map((response: any) => {
        let markerArray: Users[] = [];

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
            const responseData = new Array<Users>(...res);

            for (const data of responseData) {

              const resObj = new Users();

              resObj.Id = data.Id;
              resObj.UserId = data.UserId;
              resObj.FirstName = data.FirstName;
              resObj.LastName = data.LastName;
              resObj.Email = data.Email;
              resObj.Permissions = data.Permissions;

              if (this.loggedInUserId == resObj.UserId) {
                this.loggedInUser = resObj;
                console.log(this.loggedInUser.Id, ' ',this.loggedInUser.FirstName)
                console.log('this.loggedInUser.Permissions2', ' ',this.loggedInUser.Permissions)
                localStorage.setItem('loggedInUserName', this.loggedInUser.FirstName + ' ' + this.loggedInUser.LastName);
                localStorage.setItem("loggedInUserPermissions", this.loggedInUser.Permissions);
              }
              
            }
          }
        },
        err => {
          console.log(err);
        }
      );

  }

}
