class SoundManager {
    constructor(world) {
        if (SoundManager.instance) {
            return SoundManager.instance;
        }

        this.sounds = {};
        SoundManager.instance = this;
    }

    static getInstance() {
        return SoundManager.instance || new SoundManager();
    }

    /**
     * Loads a sound from the given source and assigns it a name.
     * @param {string} name - The name to assign to the sound.
     * @param {string} src - The source path of the sound file.
     */
    loadSound(name, src) {
        const sound = new Audio(src);
        sound.volume = 0.03;
        this.sounds[name] = sound;
    }

    /**
     * Plays the sound associated with the given name.
     * @param {string} name - The name of the sound to play.
     */
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

    /**
     * Stops the sound associated with the given name.
     * @param {string} name - The name of the sound to stop.
     */
    stop(name) {
        const sound = this.sounds[name];
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
        } else {
            console.error(`Sound ${name} wurde nicht gefunden.`);
        }
    }

    /**
     * Sets the volume for the sound associated with the given name.
     * @param {string} name - The name of the sound to adjust.
     * @param {number} volume - The volume level to set (between 0.0 and 1.0).
     */
    setVolume(name, volume) {
        const sound = this.sounds[name];
        if (sound) {
            sound.volume = volume;
        } else {
            console.error(`Sound ${name} wurde nicht gefunden.`);
        }
    }

    /**
     * Sets whether the sound associated with the given name should loop.
     * @param {string} name - The name of the sound to loop.
     * @param {boolean} [loop=true] - Whether the sound should loop.
     */
    loop(name, loop = true) {
        const sound = this.sounds[name];
        if (sound) {
            sound.loop = loop;
        } else {
            console.error(`Sound ${name} wurde nicht gefunden.`);
        }
    }

    /**
     * Plays all loaded sounds.
     */
    playAll() {
        for (let soundName in this.sounds) {
            this.sounds[soundName].play();
        }
    }

    /**
     * Pauses all loaded sounds.
     */
    pauseAll() {
        for (let soundName in this.sounds) {
            this.sounds[soundName].pause();
        }
    }

    /**
     * Stops all loaded sounds.
     */
    stopAll() {
        for (let soundName in this.sounds) {
            this.stop(soundName);
        }
    }

    /**
     * Loads the initial set of sounds used in the game.
     */
    loadStartSounds() {
        this.loadSound('walking', 'assets/sounds/walking.mp3');
        this.setVolume('walking', 0.08);
        this.loadSound('hurt', 'assets/sounds/hurt.mp3');
        this.setVolume('hurt', 0.08);
        this.loadSound('jumping', 'assets/sounds/jump.mp3');
        this.setVolume('jumping', 0.005);
        this.loadSound('throw', 'assets/sounds/throw.mp3');
        this.setVolume('throw', 0.3);
        this.loadSound('backgroundmusic', 'assets/sounds/background_music.mp3');
        this.setVolume('backgroundmusic', 0.02);
        this.loadSound('chicken', 'assets/sounds/chicken.mp3');
        this.loadSound('game_win', 'assets/sounds/game_win.mp3');
        this.loadSound('game_lose', 'assets/sounds/game_lose.mp3');
        this.loadSound('boss_chicken_start', 'assets/sounds/boss_chicken_start.mp3');
    }

    /**
     * Checks the current music status and plays or stops the background and chicken sounds accordingly.
     * @param {boolean} musicPaused - Indicates whether the music should be paused.
     */
    checkMusic(musicPaused) {
        if (musicPaused) {
            this.stop('backgroundmusic');
            this.loop('backgroundmusic', false);
            this.stop('chicken');
        } else {
            this.play('backgroundmusic');
            this.loop('backgroundmusic', true);
            this.play('chicken');
        }
    }
}
