import { Flat } from '../flat/flat';
import { User } from '../user/user';
import { Chore } from './chore';

export class ChoreAppointment {
    public id: number | null = null;
    public date: Date | null = null;
    public flat: number | null = null;
    public flat_verbose: Flat | null = null;
    public chore: number | null = null;
    public chore_verbose: Chore | null = null;
    public executor: number| null = null;
    public executor_verbose: User | null = null;
    public assigned_member: number | null = null;
    public assigned_member_verbose: User | null = null;
    public is_completed: boolean = false;

}

export type ChoreAppointments = Array<ChoreAppointment>;