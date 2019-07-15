

export class PublicConvertServices {

     conversationsPublics: any;
     itemobject: any;


    getPublicConversById(id: number) {
        /*const convert = this.conversationsPublics.find(
            (convertObject) => {
                return convertObject.id === id;
            }
        );*/
        return this.conversationsPublics[id];
    }

 }