import { Component } from '@angular/core';
import { PictureService } from './services/picture.service';
import { CategoryService } from './services/category.service';
import { ToastGeneratorService } from './services/toastGenerator.service';
import { CommandService } from './services/command.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [PictureService, CategoryService, ToastGeneratorService, CommandService]
})
export class AppComponent {
  constructor() {

  }

}
