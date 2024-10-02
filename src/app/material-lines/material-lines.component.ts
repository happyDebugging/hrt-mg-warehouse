import { Component } from '@angular/core';

@Component({
  selector: 'app-material-lines',
  templateUrl: './material-lines.component.html',
  styleUrl: './material-lines.component.css'
})
export class MaterialLinesComponent {

  storageCategory = '';
  storageCategoryDescription = '';
  materialLines = [];

  ngOnInit() {

    this.storageCategory = JSON.parse(JSON.stringify(localStorage.getItem('storageCategory')));
    
    if (this.storageCategory == 'mountain') this.storageCategoryDescription = 'Τμήμα Ορεινής Διάσωσης';
    else if (this.storageCategory == 'water') this.storageCategoryDescription = 'Τμήμα Υγρού Στοιχείου';
    else if (this.storageCategory == 'disaster') this.storageCategoryDescription = 'Τμήμα Αντιμετώπισης Καταστροφών';
    else if (this.storageCategory == 'firstAid') this.storageCategoryDescription = 'Τμήμα Πρώτων Βοηθειών';
    else if (this.storageCategory == 'communications') this.storageCategoryDescription = 'Τμήμα Επικοινωνιών - Έρευνας & Τεχνολογίας';
    else if (this.storageCategory == 'socialCare') this.storageCategoryDescription = 'Τμήμα Κοινωνικής Μέριμνας & Ανθρωπιστικών Αποστολών';
  }

}
