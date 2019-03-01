const config = require('../assets/config.json');

export class PaypalConfig {
    env = 'sandbox';
    client = new Client(config.paypalProdClient, config.paypalSandboxClient);
    commit = true;
    payment: any;
    onAuthorize: Function;
    onCancel: Function;
    onError: Function;
    style = {
        size: 'medium',
        color: 'blue',
        label: 'paypal',
        tagline: 'false',
        fundingicons: 'true'
    };

    constructor(onAuthorize: Function, onCancel: Function, onError: Function) {
        this.onAuthorize = onAuthorize;
        this.onCancel = onCancel;
        this.onError = onError;
    }

    createPayment(total: number, currency: string) {
        this.payment = (data, actions) => {
            return actions.payment.create({
                transactions: [{
                    amount: {
                        total: total,
                        currency: currency
                    }
                }]
            });
        };
    }
}


export class Client {
    constructor(
        private production: string,
        private sandbox: string
    ) {}
}
