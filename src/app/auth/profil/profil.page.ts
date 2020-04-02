import {Component, OnInit, OnDestroy} from '@angular/core';
import {UserService} from 'src/app/services/user/user.service';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {FirebaseUtilsService} from 'src/app/services';
import {User} from 'src/app/models';
import {UtilsService} from 'src/app/services/utils/utils';
import * as R from 'ramda';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {ActionSheetController, AlertController, Platform} from '@ionic/angular';
import {ImagePicker, OutputType} from '@ionic-native/image-picker/ngx';
import {Base64} from '@ionic-native/base64/ngx';
import {ImageResizer} from '@ionic-native/image-resizer/ngx';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
    selector: 'app-profil',
    templateUrl: './profil.page.html',
    styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit, OnDestroy {

    profilForm = new FormGroup({
        firstName: new FormControl('', [Validators.required, Validators.minLength(3)]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(3)]),
        userName: new FormControl('', [Validators.required, Validators.minLength(3)])
    });

    currentUser: User;
    private onDestroy$ = new Subject<void>();

    constructor(private userService: UserService,
                private imagePicker: ImagePicker,
                private base64: Base64,
                private imageResizer: ImageResizer,
                public domSanitizer: DomSanitizer,
                private actionSheetController: ActionSheetController,
                private camera: Camera,
                private firebaseUtilsService: FirebaseUtilsService,
                private utilsService: UtilsService,
                private platform: Platform,
                public alertController: AlertController) {
    }

    ngOnInit() {
        this.firebaseUtilsService.getCurrentUser()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(currentUser => {
                this.profilForm.setValue({
                    firstName: R.pathOr<string>('', ['firstName'], currentUser),
                    lastName: R.pathOr<string>('', ['lastName'], currentUser),
                    userName: R.pathOr<string>('', ['userName'], currentUser),
                });
                this.currentUser = currentUser;
            });
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    updateProfil() {
        if (this.currentUser) {
            const user: Partial<User> = {
                firstName: this.profilForm.get('firstName').value || undefined,
                lastName: this.profilForm.get('lastName').value || undefined,
                userName: this.profilForm.get('userName').value || undefined
            };
            this.userService.update(this.currentUser.id, user)
                .then(_ => this.utilsService.presentToast('Profil Updated Successfully'))
                .catch(err => this.utilsService.presentErrorToast(`Profil Failed ${err}`));
        }
    }

    async presentActionSheet() {
        const actionSheet = await this.actionSheetController.create({
            header: 'Actions',
            buttons: [
                {
                    text: 'Take picture',
                    icon: 'camera',
                    handler: () => {
                        if (this.platform.is('cordova')) {
                            this.captureImage();
                        } else {
                            this.presentAlertProfil('Sorry', 'This option is not yet available on desktop.');
                        }
                    }
                },
                {
                    text: 'Choose Existing picture',
                    icon: 'image',
                    handler: () => {
                        if (this.platform.is('cordova')) {
                            this.chooseExistingImage();
                        } else {
                            this.presentAlertProfil('Sorry', 'This option is not yet available on desktop.');
                            document.getElementById('loadProfilePicture').click();
                        }
                    }
                },
                {
                    text: 'Cancel',
                    icon: 'close',
                    role: 'cancel',
                    handler: () => undefined
                }
            ]
        });
        await actionSheet.present();
    }


    handleFileInput(event) {
        console.log('input change');
        const file = event.dataTransfer ? event.dataTransfer.files[0] : event.target.files[0];

        const pattern = /image-*/;
        const reader = new FileReader();

        if (!file.type.match(pattern)) {
            alert('invalid format');
            return;
        }

        reader.onload = this._handleReaderLoaded.bind(this);
        reader.readAsDataURL(file);
    }

    _handleReaderLoaded(e) {
        console.log('_handleReaderLoaded');
        const reader = e.target;
        this.currentUser.picture = reader.result;
        this.updateProfilPicture();
    }


    async presentAlertProfil(alertTitle: string, text: string) {
        const alert = await this.alertController.create({
            header: alertTitle,
            message: text,
            buttons: ['OK']
        });

        await alert.present();
    }

    private captureImage() {
        const options: CameraOptions = {
            quality: 100,
            targetHeight: 96,
            targetWidth: 96,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
        };
        this.camera.getPicture(options)
            .then((imageData) => {
                if (imageData) {
                    const base64Image = 'data:image/jpeg;base64,' + imageData;
                    this.currentUser.picture = base64Image;
                    this.updateProfilPicture();
                }
            }, (err) => {
                this.utilsService.presentErrorToast(`Error occured, ${err}`);
            });
    }

    private async chooseExistingImage() {
        const hasReadPermission = await this.imagePicker.hasReadPermission();
        hasReadPermission ? await this.getPictures() : (async () => {
            const hasReadPermission = await this.imagePicker.requestReadPermission();
            hasReadPermission ? this.getPictures() : undefined;
        })();
    }

    private async getPictures() {
        try {
            const imageData = await this.imagePicker.getPictures({
                maximumImagesCount: 1,
                outputType: OutputType.FILE_URL
            });
            if (Array.isArray(imageData) && imageData.length) {
                const filePath = await this.imageResizer
                    .resize({
                        uri: imageData[0],
                        folderName: 'todoList_tmp',
                        quality: 100,
                        width: 96,
                        height: 96
                    });
                const base64File = await this.base64.encodeFile(filePath);
                this.currentUser.picture = base64File;
                this.updateProfilPicture();
            }
        } catch (err) {
            this.utilsService.presentErrorToast(`Error occured, ${err}`);
        }
    }

    private updateProfilPicture() {
        if (this.currentUser) {
            const picture: Partial<User> = {
                picture: this.currentUser.picture || undefined
            };
            this.userService.update(this.currentUser.id, picture)
                .then(_ => this.utilsService.presentToast('Profil Picture Updated Successfully'))
                .catch(err => this.utilsService.presentErrorToast(`Profil Failed ${err}`));
        }
    }
}
