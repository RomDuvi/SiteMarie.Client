import { Injectable } from '@angular/core';
import { ConfigService } from './config/config.service';
import { HttpClient } from '@angular/common/http';
import { Category } from 'src/models/category.model';
import { Observable } from 'rxjs';

@Injectable()
export class CategoryService extends ConfigService {
    apiUrl: string;
    error;

    constructor(protected http: HttpClient) {
        super();
        this.apiUrl = this.config.baseUrl + this.config.categoryUrl;
    }

    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(this.apiUrl, this.httpOptions);
    }

    addCategory(category: Category): Observable<Category> {
        return this.http.post<Category>(this.apiUrl, category);
    }

    deleteCategory(category: Category): Observable<Category> {
        return this.http.post<Category>(this.apiUrl + '/delete', category, this.httpOptions);
    }

    updateCategory(category: Category): Observable<Category> {
        return this.http.put<Category>(this.apiUrl, category, this.httpOptions);
    }
}
