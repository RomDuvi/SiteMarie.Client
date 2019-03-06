import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { AppComponent } from './app.component';
import { NavModule } from './nav/nav.module';
import { BodyComponent } from './body/body.component';
import { BodyModule } from './body/body.module';
import { NavComponent } from './nav/nav.component';
import { CardComponent } from './card/card.component';
import { PreviewComponent } from './preview/preview.component';
import { AddPictureComponent } from './pictures/add-picture/add-picture.component';
import { FooterComponent } from './footer/footer.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { CategoriesComponent } from './categories/categories.component';
import { PicturesComponent } from './pictures/pictures.component';
import { AddCategoryComponent } from './categories/add-category/add-category.component';
import { UpdatePictureComponent } from './pictures/update-picture/update-picture.component';
import { PaypalComponent } from './paypal/paypal.component';

import { AuthGuard } from './services/guard/authGuard';
import { AuthService } from './services/guard/auth.service';
import { CustomHttpInterceptor } from './services/error/http.interceptor';
import { ToastGeneratorService } from './services/toastGenerator.service';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrash, faPencilAlt, faPlusCircle, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AngularDraggableModule } from 'angular2-draggable';
import { ToastrModule } from 'ngx-toastr';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';
import { BaseComponent } from './base-component/base-component.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';



const appRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'categories', component: CategoriesComponent},
  {path: 'admin', component: AdminComponent, canActivate: [AuthGuard]},
  {path: 'preview', component: PreviewComponent},
  {path: '', redirectTo: '/categories', pathMatch: 'full'},
  {path: 'pictures/:categoryId', component: PicturesComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    BodyComponent,
    CardComponent,
    PreviewComponent,
    AddPictureComponent,
    FooterComponent,
    LoginComponent,
    AdminComponent,
    CategoriesComponent,
    PicturesComponent,
    AddCategoryComponent,
    UpdatePictureComponent,
    PaypalComponent,
    DeleteModalComponent,
    BaseComponent,
    BreadcrumbComponent
  ],
  imports: [
    NgMultiSelectDropDownModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    NavModule,
    BodyModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularDraggableModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true
    }),
    RouterModule.forRoot(
      appRoutes
    ),
    FontAwesomeModule
  ],
  entryComponents: [
    AddCategoryComponent,
    UpdatePictureComponent,
    AddPictureComponent,
    DeleteModalComponent
  ],
  providers: [
    AuthGuard,
    AuthService,
    ToastGeneratorService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomHttpInterceptor,
      multi: true
    },
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    library.add(faTrash, faPencilAlt, faPlusCircle, faChevronRight);
  }
}
