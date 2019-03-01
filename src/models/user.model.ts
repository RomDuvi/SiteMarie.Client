import { BaseModel } from './baseModel.model';
export class User extends BaseModel {
    constructor(
        private username: string,
        private password: string,
        private displayName: string,
        private isAdmin: boolean,
        private email: string) {
            super();
         }
}
