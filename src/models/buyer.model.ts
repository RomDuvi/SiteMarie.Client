export class Buyer {
    constructor(
        public email: string,
        public first_name: string,
        public last_name: string,
        public middle_name: string,
        public payer_id: string,
        public shipping_address: ShippingAddress
    ) {}
}

export class ShippingAddress {
    constructor(
        public city: string,
        public country_code: string,
        public line1: string,
        public line2: string,
        public postal_code: string,
        public recipient_name: string
    ) {}
}
