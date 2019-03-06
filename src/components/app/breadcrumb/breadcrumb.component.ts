import { Component, OnInit, Input } from '@angular/core';
import { BreadCrumbElement } from '../../../models/breadcrumbElement.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {
  @Input() breadcrumb: BreadCrumbElement[];

  constructor(private router: Router) { }

  ngOnInit() {
  }

  navigate(route: string) {
    if(route === '') { return; }
    this.router.navigateByUrl(route);
  }

  isLast(i: number){
    return i === this.breadcrumb.length - 1;
  }
}
