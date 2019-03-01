import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Picture } from 'src/models/picture.model';
import { PictureService } from '../app/services/picture.service';
import { AuthService } from '../app/services/guard/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddPictureComponent } from './add-picture/add-picture.component';

@Component({
  selector: 'app-pictures',
  templateUrl: './pictures.component.html',
  styleUrls: ['./pictures.component.css']
})
export class PicturesComponent implements OnInit {
  pictures: Observable<Picture[]>;
  isAdmin = false;
  currentCategory: string;

  constructor(
    protected pictureService: PictureService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.isAdmin = this.authService.isAdminLogged();
    this.route.params.subscribe(params => {
      this.currentCategory = params.categoryId;
      this.pictures = this.pictureService.pictures;
      this.pictureService.getPictures(() => {
        this.pictureService.getPicturesByCategory(this.currentCategory);
      });
    });
  }

  displayPreview(index: number): void {
    this.router.navigate(['/preview'], { queryParams: { index: index, category: this.currentCategory }});
  }

  open() {
    this.modalService.open(AddPictureComponent, {size : 'lg'})
      .result
      .then(result => {
        this.ngOnInit();
      });
  }

}
