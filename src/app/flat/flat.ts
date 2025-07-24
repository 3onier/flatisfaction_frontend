import { User } from "../user/user";

export class Flat {
    public id: number|undefined = undefined;
    public name: string = '';
    public members: Array<User>|Array<number> = [];
    public admins: Array<User>|Array<number> = [];
    public can_member_edit_chores?: boolean;
}
