export class User {
    public id: number|undefined = undefined;
    public username: string = '';
    public first_name: string = '';
    public last_name: string = '';
    public email: string = "";

    public isValid(){
        // check if email is okay
        return true;
    }

}
