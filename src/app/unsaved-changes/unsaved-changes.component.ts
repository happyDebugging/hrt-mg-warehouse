import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-unsaved-changes',
  templateUrl: './unsaved-changes.component.html',
  styleUrl: './unsaved-changes.component.css'
})
export class UnsavedChangesComponent {

  @ViewChild('exitWarning') exitWarning: any;

  constructor(private modalService: NgbModal, private router: Router) { }

  ShowExitWarning() {
    this.modalService.open(this.exitWarning, { centered: true, size: 'sm', windowClass: 'zindex' });
  }
  
  DismillModal() {
    this.modalService.dismissAll();
  }
  
}
