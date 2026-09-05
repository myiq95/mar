
import { registerPlugin } from '@capacitor/core';
export const BackgroundTTS = registerPlugin('BackgroundTTS', {
  web: () => import('./web').then(m => new m.BackgroundTTSWeb())
});
