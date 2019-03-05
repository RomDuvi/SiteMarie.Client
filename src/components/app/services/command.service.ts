import { Injectable } from '@angular/core';
import { ConfigService } from './config/config.service';
import { HttpClient } from '@angular/common/http';
import { Command } from '../../../models/command.model';

@Injectable()
export class CommandService extends ConfigService{
  apiUrl: string;

  constructor(private http: HttpClient) {
    super();
    this.apiUrl = this.config.baseUrl + this.config.commandUrl;
  }

  saveCommand(command: Command) {
    this.http.post(this.apiUrl, command, this.httpOptions).subscribe((data) => {
        console.log('Command saved');
    });
  }

  getCommands() {
      return this.http.get(this.apiUrl, this.httpOptions);
  }
}
