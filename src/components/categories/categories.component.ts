import { Component, OnInit, ViewChild } from '@angular/core';
import { Category } from 'src/models/category.model';
import { CategoryService } from '../app/services/category.service';
import { Router } from '@angular/router';
import { AuthService } from '../app/services/guard/auth.service';
import { AddCategoryComponent } from './add-category/add-category.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastGeneratorService } from '../app/services/toastGenerator.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  @ViewChild(AddCategoryComponent) addCategory: AddCategoryComponent;
  categories: Category[];
  isAdmin = false;

  constructor(
    private sanitizer: DomSanitizer,
    protected categoryService: CategoryService,
    private router: Router,
    private auth: AuthService,
    private modalService: NgbModal,
    private toast: ToastGeneratorService
  ) { }

  ngOnInit() {
    this.categories = [];
    this.isAdmin = this.auth.isAdminLogged();
    this.categoryService.getCategories().subscribe((categories: Category[]) => {
      categories.forEach(category => {
        this.categoryService.getCategoryFile(category).subscribe(data => {
          const src = this.sanitizer.bypassSecurityTrustResourceUrl(`data:${category.fileType};base64,${data}`);
          category.src = src;
          this.categories.push(category);
        });
      });
    });
  }

  displayCategory(id: number) {
    this.router.navigate(['/pictures', id]);
  }

  open() {
    this.modalService.open(AddCategoryComponent, { size: 'lg' })
        .result
        .then(result => {
          this.ngOnInit();
        });
  }

  deleteCategory($event: any, index: number) {
    $event.stopPropagation();
    if (!this.isAdmin) {
      return;
    }
    this.categoryService.deleteCategory(this.categories[index]).subscribe(data => {
      this.categories.splice(index, 1);
      this.toast.toastSucess('Delete category', `The category ${data.name} has been deleted`);
    });
  }

  editCategory($event: any, category: any) {
    $event.stopPropagation();
    if (!this.isAdmin) {
      return;
    }
    const modalRef = this.modalService.open(AddCategoryComponent, {size: 'lg'});
    modalRef.componentInstance.category = category;
    modalRef.result.then(result => {
      this.ngOnInit();
    });
  }
}
