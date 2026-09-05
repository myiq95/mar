
export class BackgroundTTSWeb {
  async configureAudioSession(){ console.log('web mock'); }
  async speak(opts){ 
    if('speechSynthesis' in window){
      const u = new SpeechSynthesisUtterance(opts.text);
      u.lang = opts.language || 'ko-KR';
      u.rate = opts.rate || 1;
      speechSynthesis.speak(u);
    }
  }
  async stop(){ speechSynthesis.cancel(); }
  async pause(){ speechSynthesis.pause(); }
  async resume(){ speechSynthesis.resume(); }
}
