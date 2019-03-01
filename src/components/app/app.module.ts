import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { NavModule } from '../nav/nav.module';
import { BodyComponent } from '../body/body.component';
import { BodyModule } from '../body/body.module';
import { NavComponent } from '../nav/nav.component';
import { CardComponent } from '../card/card.component';
import { PreviewComponent } from '../preview/preview.component';
import { AddPictureComponent } from '../pictures/add-picture/add-picture.component';
import { FooterComponent } from '../footer/footer.component';
import { AdminComponent } from '../admin/admin.component';
import { LoginComponent } from '../login/login.component';
import { CategoriesComponent } from '../categories/categories.component';
import { PicturesComponent } from '../pictures/pictures.component';
import { AddCategoryComponent } from '../categories/add-category/add-category.component';
import { UpdatePictureComponent } from '../pictures/update-picture/update-picture.component';

import { AuthGuard } from './services/guard/authGuard';
import { AuthService } from './services/guard/auth.service';
import { CustomHttpInterceptor } from './services/error/http.interceptor';
import { ToastGeneratorService } from './services/toastGenerator.service';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrash, faPencilAlt, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AngularDraggableModule } from 'angular2-draggable';
import { ToastrModule } from 'ngx-toastr';
import { PaypalComponent } from '../paypal/paypal.component';



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
    PaypalComponent
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
    AddPictureComponent
  ],
  providers: [
    AuthGuard,
    AuthService,
    ToastGeneratorService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomHttpInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    library.add(faTrash, faPencilAlt, faPlusCircle);
  }
}
