
export class ConstanceService {

    dns = 'http://localhost';
    name_file: any;

    getDNS() {return this.dns;
    }

    setDNS(dns: string) {this.dns = dns;
    }
}