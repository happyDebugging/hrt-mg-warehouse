import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'hrt-mg-warehouse';

  storageCategory = '';

  ngOnInit() {

    this.storageCategory = JSON.parse(JSON.stringify(localStorage.getItem('storageCategory')));

  }

  SetMountainCategory() {
    localStorage.setItem('storageCategory', 'mountain');
    console.log('mountain')
  }

  SetWaterCategory() {
    localStorage.setItem('storageCategory', 'water');
    console.log('water')
  }

  SetDisasterCategory() {
    localStorage.setItem('storageCategory', 'disaster');
    console.log('disaster')
  }

  SetFirstAidCategory() {
    localStorage.setItem('storageCategory', 'firstAid');
    console.log('firstAid')
  }

  SetCommunicationsCategory() {
    localStorage.setItem('storageCategory', 'communications');
    console.log('communications')
  }

  SetSocialCareCategory() {
    localStorage.setItem('storageCategory', 'socialCare');
    console.log('socialCare')
  }
  
}
