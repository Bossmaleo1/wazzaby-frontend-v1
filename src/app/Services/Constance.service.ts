
export class ConstanceService {

    dns = 'http://wazzaby.com';
    name_file: any;
    //pour tester la photo
    test_updatecachephoto = 1;
    //pour stocker la liste des messages public
    messagepublicobject: any;

    getDNS() {return this.dns;
    }

    setDNS(dns: string) {this.dns = dns;
    }
}