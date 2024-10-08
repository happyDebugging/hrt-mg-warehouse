import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        if (JSON.parse(JSON.stringify(localStorage.getItem("isUserLoggedIn"))) == 'true') {
            console.log('home1')
            //this.router.navigate(['home']);
            //window.location.href = environment.appUrl + '/home';
            return true;
        }

        console.log('auth1')
        this.router.navigate(['auth']);
        return false;

    }


}