import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category } from 'src/models/category.model';
import { ToastGeneratorService } from '../../services/toastGenerator.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css'],
  providers: [CategoryService]
})
export class AddCategoryComponent implements OnInit {
  @Input() category: Category;
  categoryForm: FormGroup;
  submitted: boolean;
  error: string;
  loading: boolean;

  constructor(
    public modal: NgbActiveModal,
    private fb: FormBuilder,
    protected categoryService: CategoryService,
    private cd: ChangeDetectorRef,
    private toast: ToastGeneratorService
  ) { }

  ngOnInit() {
    if (this.category) {
      this.categoryForm = this.fb.group({
        name: [this.category.name, Validators.required],
        description: [this.category.description, Validators.required],
        file: [''],
        fileType: ['']
      });
    } else {
      this.categoryForm = this.fb.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
        file: [''],
        fileType: ['']
      });
    }
  }

  get f() { return this.categoryForm.controls; }

  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsBinaryString(file);
      reader.onload = () => {
        this.categoryForm.patchValue({
          file: <File>file,
          fileType: file.type
       });
        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
      };
    }
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';
    if (this.categoryForm.invalid) {
      return;
    }
    this.loading = true;
    if (this.category) {
      this.category.name = this.categoryForm.get('name').value;
      this.category.description = this.categoryForm.get('description').value;
      this.category.file = this.categoryForm.get('file').value;
      this.category.fileType = this.categoryForm.get('fileType').value;
      this.categoryService.updateCategory(this.category).subscribe(data => {
        this.loading = false;
        this.toast.toastSucess('Category updated', `The category ${data.name} has been updated`);
        this.modal.close();
      });
    } else {
      this.categoryService.addCategory(this.categoryForm.value).subscribe(data => {
        this.loading = false;
        this.toast.toastSucess('Category created', `The category ${data.name} has been created`);
        this.modal.close();
      });
    }
  }
}
