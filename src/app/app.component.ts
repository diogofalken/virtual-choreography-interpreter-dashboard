import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SourcesService } from './services/sources.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isLoading = false;

  constructor(
    private readonly sourcesService: SourcesService,
    private readonly snackBar: MatSnackBar
  ) {}

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
        this.snackBar.open('File is not a valid Excel file!');
        return;
      }

      if (file.size > 5000000) {
        this.snackBar.open('File is too big!');
        return;
      }

      this.isLoading = true;

      this.sourcesService.createSource(file).subscribe({
        next: (source) => {
          this.snackBar.open('File was uploaded with success!');
          this.isLoading = false;
        },
        error: () => {
          this.snackBar.open('An error occurred while uploading the file!');
        },
      });
    }
  }
}
