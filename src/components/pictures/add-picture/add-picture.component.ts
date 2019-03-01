import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { PictureService } from '../../app/services/picture.service';
import { isNumeric } from 'jquery';
import { Category } from 'src/models/category.model';
import { CategoryService } from '../../app/services/category.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PicturesCategories } from '../../../models/picturesCategories.model';


@Component({
  selector: 'app-add-picture',
  templateUrl: './add-picture.component.html',
  styleUrls: ['./add-picture.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PictureService, CategoryService]
})
export class AddPictureComponent implements OnInit {
  pictureForm: FormGroup;
  submitted = false;
  error;
  progressValue;
  progressMessage = '';
  pictureCategories: PicturesCategories[];
  dropDownCategories: Category[];
  dropDownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    enableCheckAll: false,
    allowSearchFilter: true
  };

  constructor(private fb: FormBuilder,
      protected pictureService: PictureService,
      protected categoryService: CategoryService,
      private cd: ChangeDetectorRef,
      public modal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.pictureCategories = [];
    this.progressValue = 0;
    this.pictureForm = this.fb.group({
      displayName: ['', Validators.required],
      description: ['', Validators.required],
      pictureCategories: this.pictureCategories,
      file: ['', Validators.required],
      fileName: [''],
      price: ['', Validators.required],
      type: ['']
    });
    this.categoryService.getCategories().subscribe(data => {
      this.dropDownCategories = data.filter(cat => cat.id !== '40000000-0000-0000-0000-000000000001');
    });
  }

  get f() { return this.pictureForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.progressValue = 0;
    this.error = '';
    if (this.pictureForm.invalid) {
      return;
    }
    this.pictureService.addPicture(this.pictureForm.value, (message: any) => this.onLoadEvent(message), () => this.last());
  }

  onLoadEvent(message: any) {
    this.submitted = false;
    if (isNumeric(message)) {
      this.progressValue = +message;
    }
    this.progressMessage = message;
    this.cd.detectChanges();
  }

  last() {
    this.pictureForm.reset();
  }

  isNumeric(num: any) {
    return !isNaN(num);
  }

  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsBinaryString(file);
      reader.onload = () => {
        this.pictureForm.patchValue({
          fileName: file.name,
          file: <File>file,
          type: file.type
       });
        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
      };
    }
  }

  onCategorySelect(item: any) {
    const pictureCat = new PicturesCategories();
    pictureCat.categoryId = item.id;
    this.pictureCategories.push(pictureCat);
    this.pictureForm.patchValue({
      pictureCategories: this.pictureCategories
   });
  }
  onCategoryAll(items: any) {
    this.dropDownCategories.forEach(element => {
      const pictureCat = new PicturesCategories();
      pictureCat.categoryId = element.id;
      this.pictureCategories.push(pictureCat);
    });
    this.pictureForm.patchValue({
      pictureCategories: this.pictureCategories
    });
  }
} 
