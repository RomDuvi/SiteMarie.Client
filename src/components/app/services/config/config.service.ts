import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Config } from '../../../../models/config.model';
const config = require('../../../../assets/config.json');


@Injectable()
export class ConfigService {
  httpOptions = {
    headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
  };

  get config(): Config { return config; }

  constructor() {

  }
}
