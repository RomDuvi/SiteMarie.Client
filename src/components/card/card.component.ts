import { Component, OnInit, Input } from '@angular/core';
import { PictureService } from '../app/services/picture.service';
import { Picture } from '../../models/picture.model';
import { AuthService } from '../app/services/guard/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdatePictureComponent } from '../pictures/update-picture/update-picture.component';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  picture: Picture;
  @Input() index = 0;
  @Input() id: string;
  isAdmin: boolean;

  constructor(
    protected pictureService: PictureService,
    protected authService: AuthService,
    private modalService: NgbModal
  ) {  }

  ngOnInit() {
    this.isAdmin = this.authService.isAdminLogged();
    this.loadPicture();
  }

  loadPicture() {
    this.picture = this.pictureService.getPictureFile(this.id);
  }

  deletePicture($event: any) {
    $event.stopPropagation();
    if (!this.isAdmin) {
      return;
    }
    this.pictureService.deletePicture(this.picture);
  }

  editPicture($event: any) {
    $event.stopPropagation();
    if (!this.isAdmin) {
      return;
    }
    const modalRef = this.modalService.open(UpdatePictureComponent, {size: 'lg'});
    modalRef.componentInstance.picture = this.picture;
    modalRef.result.then(result => {
      this.ngOnInit();
    });
  }
}
