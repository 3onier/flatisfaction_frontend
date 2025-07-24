import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'dateHumanReadable'
})
export class DateHumanReadable implements PipeTransform{

    private _setToMidnight(date: Date): Date{
        date.setHours(0);
        date.setSeconds(0);
        date.setMinutes(0);
        date.setMilliseconds(0);
        return date;
    }

    private _getYesterday(): Date{
        let out = new Date();
        out.setDate(out.getDate() - 1);
        return this._setToMidnight(out);
    }

    private _getTomorow(): Date{
        let out = new Date();
        out.setDate(out.getDate() + 1);
        return this._setToMidnight(out);
    }

    private _getToday(): Date{
        return this._setToMidnight(new Date());
    }

    public transform(value: any, ...args: any[]) {
        let date = new Date(value);
        // check if yesterday
        if(date.toString() == this._getYesterday().toString()){
            return 'Yesterday';
        }else if (date.toString() == this._getToday().toString()){
            return 'Today';
        }else if (date.toString() == this._getTomorow().toString()){
            return 'Tomorrow';
        }
        return value;
    }
}