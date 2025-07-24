import { inject, Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";

@Injectable({
    providedIn: 'root'
})
export class ToastService{

    private _toastController = inject(ToastController);

    private _duration = 5000;

    private async _createToast(message: string, color?: string){
        let toast = await this._toastController.create({
            message: message,
            duration: this._duration,
            position: 'bottom',
            swipeGesture: "vertical",
            color: color
        });
        return toast
    }

    public async displaySuccessToast(message: string){
        let toast = await this._createToast(message, 'success');
        await toast.present();
    }

    public async displayErrorToast(message: string){
        let toast = await this._createToast(message, 'danger');
        await toast.present();
    }

    public async displayWarningToast(message: string){
        let toast = await this._createToast(message, 'warning');
        await toast.present();
    }

    public async displayToast(message: string){
        let toast = await this._createToast(message);
        await toast.present();
    }

}