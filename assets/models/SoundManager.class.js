class SoundManager {
    constructor() {
        if (SoundManager.instance) {
            return SoundManager.instance;
        }

        this.sounds = {};
        SoundManager.instance = this;
    }

    static getInstance() {
        return SoundManager.instance || new SoundManager();
    }

    loadSound(name, src) {
        const sound = new Audio(src);
        sound.volume = 0.03;
        this.sounds[name] = sound;
    }

    play(name) {
        const sound = this.sounds[name];
        if (sound) {
            if (sound.paused || sound.ended) {
                sound.play();
            }
        } else {
            console.error(`Sound ${name} wurde nicht gefunden.`);
        }
    }

    stop(name) {
        const sound = this.sounds[name];
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
        } else {
            console.error(`Sound ${name} wurde nicht gefunden.`);
        }
    }

    setVolume(name, volume) {
        const sound = this.sounds[name];
        if (sound) {
            sound.volume = volume;
        } else {
            console.error(`Sound ${name} wurde nicht gefunden.`);
        }
    }

    loop(name, loop = true) {
        const sound = this.sounds[name];
        if (sound) {
            sound.loop = loop;
        } else {
            console.error(`Sound ${name} wurde nicht gefunden.`);
        }
    }

    playAll() {
        for (let soundName in this.sounds) {
            this.sounds[soundName].play();
        }
    }

    pauseAll() {
        for (let soundName in this.sounds) {
            this.sounds[soundName].pause();
        }
    }

    stopAll() {
        for (let soundName in this.sounds) {
            this.stop(soundName);
        }
    }
}
