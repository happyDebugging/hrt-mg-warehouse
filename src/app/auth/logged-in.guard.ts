import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment.development';
//import { environment } from '../../environments/environment';

@Injectable()
export class LoggedInGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        if (JSON.parse(JSON.stringify(sessionStorage.getItem("isUserLoggedIn"))) == 'true') {
            this.router.navigate(['home']);
            return false;
        } 

        return true;
    }


}