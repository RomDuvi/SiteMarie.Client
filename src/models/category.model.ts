import { BaseModel } from './baseModel.model';
import { PicturesCategories } from './picturesCategories.model';

export class Category extends BaseModel {
    name: string;
    description: string;
    pictureCategories: PicturesCategories[];
}
