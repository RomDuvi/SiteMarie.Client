import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base-component/base-component.component';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent extends BaseComponent implements OnInit {
  constructor() {
    super();
  }
  ngOnInit() {
  }
}
