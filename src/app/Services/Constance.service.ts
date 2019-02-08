
export class ConstanceService {

    dns = 'http://localhost';

    getDNS() {return this.dns;
    }

    setDNS(dns: string) {this.dns = dns;
    }
}