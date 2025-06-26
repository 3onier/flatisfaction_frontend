import { Flat } from "../flat/flat";

export class Invite {
    public flat: number|Flat|undefined = undefined;
    public code: string = "";
    public max_uses: number = 0;
    public uses: number = 0;
    public is_expired: boolean = false;
}
