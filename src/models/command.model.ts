export class Command {
    public id: number;
    constructor(
        public pictureId: string,
        public buyerEmail: string,
        public buyerLastName: string,
        public buyerFirstName: string,
        public buyerAddress: string,
        public price: number
    ) {}
}
