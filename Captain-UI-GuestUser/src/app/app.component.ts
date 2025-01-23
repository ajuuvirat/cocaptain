import { Component } from '@angular/core';
import {NativeAudio} from '@capacitor-community/native-audio';
import { register } from 'swiper/element/bundle';
register();
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {
    this.preLoadAudio();
  }

   async preLoadAudio(){

    await NativeAudio.preload({
      assetId: "doorbell",
      assetPath: "confirmation-tone.wav",
      audioChannelNum: 1,
      isUrl: false
  });
  }
}
