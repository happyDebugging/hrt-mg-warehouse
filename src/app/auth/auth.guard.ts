import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment.development';
//import { environment } from '../../environments/environment';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        const expireDateString = localStorage.getItem('sessionExpirationDate');
        //console.log('sessionExpirationDate ', expireDateString)

        const now = new Date();
        const today = now.getTime() / 1000;
        //console.log('now ', now)
        //console.log('today ', today)

        if (expireDateString == null || expireDateString.trim() === '' || today > parseInt(expireDateString)) {
            //this.router.navigate(['auth']);
            window.location.href = environment.appUrl + '/auth';
            return false;
        }

        if (JSON.parse(JSON.stringify(localStorage.getItem("isUserLoggedIn"))) == 'true') {
            //console.log('home1')
            //this.router.navigate(['home']);
            //window.location.href = environment.appUrl + '/home';
            return true;
        }

        //console.log('auth1')
        this.router.navigate(['auth']);
        return false;

    }


}