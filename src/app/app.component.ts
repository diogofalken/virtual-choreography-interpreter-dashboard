import { Component } from '@angular/core';
import { SourcesService } from './services/sources.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isLoading = false;

  constructor(private readonly sourcesService: SourcesService) {}

  uploadFile() {
    const input = document.querySelector('#file-upload') as HTMLInputElement;

    if (input) {
      input.click();
    }
  }

  onFileUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;

    if (files?.length > 0) {
      const file = files[0];

      if (
        file.type !==
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        alert('File is not a valid Excel file!');
        return;
      }

      if (file.size > 5000000) {
        alert('File is too big!');
        return;
      }

      this.isLoading = true;

      this.sourcesService.createSource(file).subscribe({
        next: (source) => {
          alert('File was uploaded with success!');
          this.isLoading = false;
        },
        error: () => {
          alert('An error occurred while uploading the file!');
        },
      });
    }
  }
}
