import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../app/services/category.service';
import { Category } from 'src/models/category.model';
import { ToastGeneratorService } from '../../app/services/toastGenerator.service';

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
    private toast: ToastGeneratorService
  ) { }

  ngOnInit() {
    if (this.category) {
      this.categoryForm = this.fb.group({
        name: [this.category.name, Validators.required],
        description: [this.category.description, Validators.required]
      });
    } else {
      this.categoryForm = this.fb.group({
        name: ['', Validators.required],
        description: ['', Validators.required]
      });
    }
  }

  get f() { return this.categoryForm.controls; }

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
