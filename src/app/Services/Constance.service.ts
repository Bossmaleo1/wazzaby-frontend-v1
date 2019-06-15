
export class ConstanceService {

    dns = 'http://localhost';
    name_file: any;
    test_updatecachephoto = 1;
    commentobject: any;
    messagepublicobject: any;

    getDNS() {return this.dns;
    }

    setDNS(dns: string) {this.dns = dns;
    }
}