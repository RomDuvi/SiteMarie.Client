import { Component, OnInit } from '@angular/core';
import { BreadCrumbElement } from '../../../models/breadcrumbElement.model';

@Component({
  selector: 'app-base-component',
  templateUrl: './base-component.component.html',
  styleUrls: ['./base-component.component.css']
})
export class BaseComponent implements OnInit {
  public breadCrumb: BreadCrumbElement[];

  constructor() {
    this.breadCrumb = [];
    this.breadCrumb.push(new BreadCrumbElement('Home', ''));
  }

  ngOnInit() {
  }

  public addInBreadcrumb(element: BreadCrumbElement): void {
    this.breadCrumb.push(element);
  }
}
