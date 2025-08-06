import {ChoreFrequencyEnum} from './enums'
import { WeekDays } from '../common/enums';
import { User } from '../user/user';
import { Flat } from '../flat/flat';

export class Chore {
    public id?: number;
    public name: string = "";
    public description: string = "";
    public start_date?: Date;
    public end_date?: Date;
    public effort?: number;
    public frequency: ChoreFrequencyEnum = ChoreFrequencyEnum.once;
    public frequency_gap: number = 1;
    public weekdays: Array<WeekDays> = [];
    public responsible_members: Array<number> = new Array<number>;
    public responsible_members_verbose: Array<User> = new Array<User>;
    public flat?: number;
    public flat_verbose?: Flat;
}

export type Chores = Array<Chore>;