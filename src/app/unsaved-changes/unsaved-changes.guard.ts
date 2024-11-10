import { ActivatedRouteSnapshot, CanDeactivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

export interface UnsavedChangesComponent {
    canDeactivate: () => boolean;
}

@Injectable()
export class UnsavedChangesGuard implements CanDeactivate<UnsavedChangesComponent> {

    isNewMaterial = 'false';
    isMaterialEditEnabled = 'false';
    isDeletionSuccessfull = 'false';

    @ViewChild('exitWarning') exitWarning: any;

    constructor(private modalService: NgbModal, private router: Router) { }

    canDeactivate(component: UnsavedChangesComponent, route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        this.isNewMaterial = JSON.parse(JSON.stringify(localStorage.getItem("isNewMaterial")));
        this.isMaterialEditEnabled = JSON.parse(JSON.stringify(localStorage.getItem("isMaterialEditEnabled")));
        this.isDeletionSuccessfull = JSON.parse(JSON.stringify(localStorage.getItem("isDeletionSuccessfull")));

        //if (this.isNewMaterial == 'true' || this.isMaterialEditEnabled == 'true') {

            //if (!this.isDeletionSuccessfull) {
            //    console.log('feugeis?')

                //this.ShowExitWarning();
                //return false;
                //return confirm("Η εργασία δεν έχει ολοκληρωθεί. Έξοδος από τη σελίδα;"); //true; ////component.canDeactivate()
                // if (confirm("Η εργασία δεν έχει ολοκληρωθεί. Έξοδος από τη σελίδα;") == false) {
                //     return false;
                //     localStorage.setItem('isMaterialEditEnabled', 'false');
                // }
                // return false;
            //} else {
                return true;
            //}
            //return false;
        //} else {
            //return true;
        //}

        //return component.canDeactivate ? component.canDeactivate() : true;

    }

    ShowExitWarning() {
        this.modalService.open(this.exitWarning, { centered: true, size: 'sm', windowClass: 'zindex' });
    }

}