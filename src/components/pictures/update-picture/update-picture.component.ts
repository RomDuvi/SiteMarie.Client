import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PictureService } from '../../app/services/picture.service';
import { Picture } from 'src/models/picture.model';

@Component({
  selector: 'app-update-picture',
  templateUrl: './update-picture.component.html',
  styleUrls: ['./update-picture.component.css'],
  providers: [PictureService]
})
export class UpdatePictureComponent implements OnInit {
  @Input() picture: Picture;
  pictureForm: FormGroup;
  submitted: boolean;
  error: string;
  loading: boolean;

  constructor(
    public modal: NgbActiveModal,
    private fb: FormBuilder,
    protected pictureService: PictureService
  ) { }

  ngOnInit() {
    this.pictureForm = this.fb.group({
      displayName: [this.picture.displayName, Validators.required],
      description: [this.picture.description, Validators.required],
      price: ['', Validators.required]
    });
  }

  get f() { return this.pictureForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.error = '';
    if (this.pictureForm.invalid) {
      return;
    }
    this.loading = true;
    delete this.picture.loaded;
    delete this.picture.src;
    this.picture.displayName = this.pictureForm.get('displayName').value;
    this.picture.description = this.pictureForm.get('description').value;
    this.picture.price = this.pictureForm.get('price').value;
    this.pictureService.updatePicture(this.picture);
    this.modal.close();
  }

}
