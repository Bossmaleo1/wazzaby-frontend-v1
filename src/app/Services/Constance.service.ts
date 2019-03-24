
export class ConstanceService {

    dns = 'http://localhost';
    name_file: any;
    test_updatecachephoto = 1;

    getDNS() {return this.dns;
    }

    setDNS(dns: string) {this.dns = dns;
    }
}