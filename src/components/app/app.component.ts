import { Component } from '@angular/core';
import { PictureService } from './services/picture.service';
import { CategoryService } from './services/category.service';
import { ToastGeneratorService } from './services/toastGenerator.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [PictureService, CategoryService, ToastGeneratorService]
})
export class AppComponent {
  constructor() {

  }

}
