import { Injectable } from '@angular/core';
import { Picture } from '../../../models/picture.model';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpRequest, HttpEvent, HttpEventType, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfigService } from './config/config.service';
import { map, tap, last } from 'rxjs/operators';
import { ToastGeneratorService } from './toastGenerator.service';
import saveAs from 'file-saver';
import { Command } from 'src/models/command.model';

@Injectable()
export class PictureService extends ConfigService {
    apiUrl: string;
    private _pictures: BehaviorSubject<Picture[]>;
    private dataStore: {
        pictures: Picture[],
        picturesByCategory: Picture[]
    };

    error;
    constructor(
        protected http: HttpClient,
        private sanitizer: DomSanitizer,
        private toast: ToastGeneratorService
    ) {
        super();
        this.apiUrl = this.config.baseUrl + this.config.pictureUrl;
        this.dataStore = { pictures: [], picturesByCategory: [] };
        this._pictures = <BehaviorSubject<Picture[]>>new BehaviorSubject([]);
    }

    private assign() {
        this._pictures.next(Object.assign({}, this.dataStore).pictures);
    }

    addPicture(picture: Picture, progressCallback: any, lasCallback: any) {
        const formData = new FormData();
        formData.append('file', picture.file);
        delete picture.file;
        formData.append('picture', JSON.stringify(picture));

        const req = new HttpRequest('POST', this.apiUrl, formData, { reportProgress: true});
        this.http.request(req).pipe(
            map(event => this.getEventMessage(event, picture.displayName)),
            tap(message => progressCallback(message)),
            last(lasCallback())
          ).subscribe((x: any) => { this.toast.toastSucess('Picture Created', `The picture ${x.displayName} has been created`); } );
    }

    getPictures(callback?) {
        if (this.dataStore.pictures.length > 0) {
            this.assign();
            if (callback) {
                callback();
            }
            return;
        }
        this.http.get<Picture[]>(this.apiUrl, this.httpOptions)
                .subscribe(data => {
                    this.dataStore.pictures = data;
                    this.assign();
                    if (callback) {
                        callback();
                    }
                }, err => {throw new Error(err); });
    }

    getPictureFile(pictureId: string): Picture {
        const picture = this.dataStore.pictures.find(pic => pic.id === pictureId);
        if (picture.src) {
            return picture;
        }
        this.http.get(this.apiUrl + '/file/' + pictureId, this.httpOptions).subscribe(data => {
            const src = this.sanitizer.bypassSecurityTrustResourceUrl(`data:${picture.type};base64,${data}`);
            picture.src = src;
            picture.loaded = true;
        });
        return picture;
    }

    getPictureByIndex(index: number): Picture {
        return this.dataStore.picturesByCategory[index];
    }

    getPicturesByCategory(categoryId: string) {
        const pictures = this.dataStore.pictures;
        const array =  pictures.filter(pic => {
            const cats = pic.pictureCategories.filter(cat => cat.categoryId === categoryId);
            return cats.length > 0;
        });
        this.dataStore.picturesByCategory = array;
        this._pictures.next(Object.assign({}, this.dataStore).picturesByCategory);
    }

    get pictures() { return this._pictures.asObservable(); }

    deletePicture(picture: Picture) {
        this.http.post(this.apiUrl + '/delete', picture, this.httpOptions).subscribe((data: Picture) => {
            const index = this.dataStore.pictures.indexOf(data);
            this.dataStore.pictures.splice(index, 1);
            this.toast.toastSucess('Picture deleted', `The picture ${data.displayName} has bean deleted`);
        });
    }

    updatePicture(picture: Picture) {
        this.http.put(this.apiUrl, picture, this.httpOptions).subscribe((data: Picture) => {
            const index = this.dataStore.pictures.indexOf(data);
            this.dataStore.pictures[index] = data;
            this.toast.toastSucess('Picture updated', `The picture ${data.displayName} has bean updated`);
        });
    }

    donwloadPictureFile(params: any) {
        this.http.get(this.apiUrl + `/file/${params.picture.id}/${params.ratio}`, {
            responseType: 'blob',
            headers: new HttpHeaders().append('Content-Type', 'application/json')
          }).subscribe((data) => {
            saveAs(data, params.picture.displayName + '.png');
        });
    }

    saveCommand(command: Command) {
        this.http.post(this.apiUrl + '/commands', command, this.httpOptions).subscribe((data) => {
            console.log('Command saved');
        });
    }

    getCommands() {
        return this.http.get(this.apiUrl + '/commands', this.httpOptions);
    }

    public hasPicture(): boolean {
        return this.dataStore.pictures.length > 0;
    }

    private getEventMessage(event: HttpEvent<any>, fileName: string): any {
        switch (event.type) {
          case HttpEventType.Sent:
            return `Uploading "${fileName}"`;

          case HttpEventType.UploadProgress:
            // Compute and show the % done:
            const percentDone = Math.round(100 * event.loaded / event.total);
            return percentDone;

          case HttpEventType.Response:
            this.dataStore.pictures.push(event.body);
            this.assign();
            return `"${fileName}" was completely uploaded!`;

          default:
            return `"${fileName}" surprising upload event: ${event.type}.`;
        }
      }
}
