import { Component } from '@angular/core';

@Component({
  selector: 'app-material-details',
  templateUrl: './material-details.component.html',
  styleUrl: './material-details.component.css',
})
export class MaterialDetailsComponent {

  storageCategory = '';
  storageCategoryDescription = '';
  materialLines = [];

  preview = '';
  currentFile?: File;

  ngOnInit() {

    this.storageCategory = JSON.parse(JSON.stringify(localStorage.getItem('storageCategory')));
    
    if (this.storageCategory == 'mountain') this.storageCategoryDescription = 'Τμήμα Ορεινής Διάσωσης';
    else if (this.storageCategory == 'water') this.storageCategoryDescription = 'Τμήμα Υγρού Στοιχείου';
    else if (this.storageCategory == 'disaster') this.storageCategoryDescription = 'Τμήμα Αντιμετώπισης Καταστροφών';
    else if (this.storageCategory == 'firstAid') this.storageCategoryDescription = 'Τμήμα Πρώτων Βοηθειών';
    else if (this.storageCategory == 'communications') this.storageCategoryDescription = 'Τμήμα Επικοινωνιών - Έρευνας & Τεχνολογίας';
    else if (this.storageCategory == 'socialCare') this.storageCategoryDescription = 'Τμήμα Κοινωνικής Μέριμνας & Ανθρωπιστικών Αποστολών';
  }

  selectFile(event: any) {
    this.preview = '';
    const selectedFiles = event.target.files;
  
    if (selectedFiles) {
      const file: File | null = selectedFiles.item(0);
  
      if (file) {
        this.preview = '';
        this.currentFile = file;
  
        const reader = new FileReader();
  
        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.preview = e.target.result;
        };
  
        reader.readAsDataURL(this.currentFile);
      }
    }
  }
  
  
}
