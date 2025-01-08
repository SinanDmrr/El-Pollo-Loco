class UI {
    constructor(canvas, soundManager, character) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.soundManager = soundManager;
        this.character = character;
        this.musicPaused = false;
        this.showInstruction = false;
        this.gameOver = false;
        this.endbossDefeated = false;
        this.gameRunning = false;
        this.icons = [];
    }

    draw() {
        if (this.gameOver) {
            this.drawGameOverScreen();
        } else if (this.endbossDefeated) {
            this.drawWinScreen();
        } else if (!this.gameRunning) {
            this.drawStartScreen();
        } else if (this.gameRunning) {
            this.soundManager.checkMusic(this.musicPaused);
            this.drawScreenIcons();
        }
    }

    drawScreenIcons() {
        let icons;
        if (this.gameOver || this.endbossDefeated) {
            icons = [{ src: 'assets/img/10_icons/home.png', x: 720 / 2 - 25, y: 50 }];
        } else if (!this.gameRunning) {
            icons = [
                { src: 'assets/img/10_icons/instruction.png', x: 0 + 25, y: 50 },
                { src: 'assets/img/10_icons/play.png', x: 720 / 2 - 25, y: 50 },
                { src: 'assets/img/10_icons/fullscreen.png', x: 720 - 75, y: 50 }
            ];
        } else if (this.gameRunning) {
            icons = [{ src: 'assets/img/10_icons/music.png', x: 720 / 2 - 25, y: 50 }];
        }
        this.iconsStyling(icons);
    }

    iconsStyling(icons) {
        icons.forEach(icon => {
            this.circleStyling(icon);
            let iconImage = new Image();
            iconImage.src = icon.src;
            if (this.gameRunning) {
                this.ctx.drawImage(iconImage, icon.x, icon.y, 40, 40);
            } else {
                iconImage.onload = () => {
                    this.ctx.drawImage(iconImage, icon.x, icon.y, 40, 40);
                };
            }
        });
    }

    circleStyling(icon) {
        this.ctx.beginPath();
        this.ctx.arc(icon.x + 20, icon.y + 20, 32, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'black';
        this.ctx.fill();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.arc(icon.x + 20, icon.y + 20, 30, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'orange';
        this.ctx.fill();
        this.ctx.closePath();
    }

    drawGameOverScreen() {
        let gameOverImage = new Image();
        gameOverImage.src = "assets/img/9_intro_outro_screens/game_over/game over.png";
        gameOverImage.onload = () => {
            this.ctx.drawImage(gameOverImage, 0, 0, this.canvas.width, this.canvas.height);
            this.drawScreenIcons();
        };
        this.soundManager.stopAll();
        this.musicPaused ? this.soundManager.stop('game_lose') : this.soundManager.play('game_lose');
    }

    drawWinScreen() {
        let winImage = new Image();
        winImage.src = "assets/img/9_intro_outro_screens/win/win_2.png";
        winImage.onload = () => {
            this.ctx.drawImage(winImage, 0, 0, this.canvas.width, this.canvas.height);
            this.drawScreenIcons();
        };
        this.soundManager.stop('backgroundmusic');
        this.musicPaused ? this.soundManager.stop('game_win') : this.soundManager.play('game_win');
    }

    drawStartScreen() {
        let startScreenImage = new Image();
        startScreenImage.src = 'assets/img/9_intro_outro_screens/start/startscreen_1.png';
        startScreenImage.onload = () => {
            this.ctx.drawImage(startScreenImage, 0, 0, this.canvas.width, this.canvas.height);
            this.drawScreenIcons();
        };
    }

    showInstructions() {
        if (this.showInstruction) {
            const introJump = 'W, ↑ - Jump';
            const introLeft = 'A, ← - Move to Left';
            const introRight = 'D, → - Move to Right';
            const introThrow = 'SPACE - Throw a Bottle';
            this.instructionBackground(introJump, introLeft, introRight, introThrow);
        } else {
            this.draw();
        }
    }

    instructionBackground(introJump, introLeft, introRight, introThrow) {
        this.ctx.fillStyle = 'rgba(139, 69, 19, 0.8)';
        this.ctx.fillRect(this.canvas.width / 4, this.canvas.height / 4, this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(introJump, this.canvas.width / 2, this.canvas.height / 2 - 25);
        this.ctx.fillText(introLeft, this.canvas.width / 2, this.canvas.height / 2 - 0);
        this.ctx.fillText(introRight, this.canvas.width / 2, this.canvas.height / 2 - (-25));
        this.ctx.fillText(introThrow, this.canvas.width / 2, this.canvas.height / 2 - (-50));
    }

    handleIconClick(icon) {
        switch (icon.name) {
            case 'home':
                this.resetGame();
                this.soundManager.stop('game_lose');
                this.soundManager.stop('game_win');
                this.soundManager.stop('chicken');
                break;
            case 'play':
                this.gameRunning = true;
                this.draw();
                break;
            case 'fullscreen':
                this.toggleFullscreen(this.canvas);
                break;
            case 'instruction':
                this.showInstruction = !this.showInstruction;
                this.showInstructions();
                break;
            case 'music':
                this.pauseMusic();
                break;
        }
    }

    toggleFullscreen(canvas) {
        if (!document.fullscreenElement) {
            canvas.requestFullscreen().then(() => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }).catch(err => {
                console.error(`Fullscreen-Fehler: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen().then(() => {
                canvas.width = 720;
                canvas.height = 480;
                this.draw();
            });
        }
    }

    pauseMusic() {
        this.musicPaused = !this.musicPaused;
    }

    getMousePosition(event) {
        const scaleX = this.canvas.width / this.canvas.offsetWidth;
        const scaleY = this.canvas.height / this.canvas.offsetHeight;
        return {
            x: event.offsetX * scaleX,
            y: event.offsetY * scaleY
        };
    }

    canvasClickListener() {
        this.canvas.addEventListener('click', (event) => {
            const { x: clickX, y: clickY } = this.getMousePosition(event);
            const icons = this.getIcons();
            const clickedIcon = icons.find(icon => this.isHovering(clickX, clickY, icon));

            if (clickedIcon) {
                this.handleIconClick(clickedIcon);
            }
        });
    }

    isHovering(mouseX, mouseY, icon) {
        const distance = Math.sqrt((mouseX - icon.x) ** 2 + (mouseY - icon.y) ** 2);
        return distance <= icon.radius;
    }

    getIcons() {
        let icons = [];
        if (this.gameOver || this.endbossDefeated) {
            icons.push({ x: 720 / 2, y: 50 + 25, radius: 32, name: 'home' });
        } else if (!this.gameRunning) {
            icons = [
                { x: 50, y: 50 + 25, radius: 32, name: 'instruction' },
                { x: 720 / 2, y: 50 + 25, radius: 32, name: 'play' },
                { x: 720 - 50, y: 50 + 25, radius: 32, name: 'fullscreen' }
            ];
        } else if (this.gameRunning) {
            icons.push({ x: 720 / 2, y: 50 + 25, radius: 32, name: 'music' });
        }
        return icons;
    }

    checkHovering(icons, mouseX, mouseY) {
        for (const icon of icons) {
            if (this.isHovering(mouseX, mouseY, icon)) {
                return true;
            }
        }
        return false;
    }

    mouseOverEventListener() {
        this.canvas.addEventListener('mousemove', (event) => {
            const { x: mouseX, y: mouseY } = this.getMousePosition(event);
            const icons = this.getIcons();
            const isHovering = this.checkHovering(icons, mouseX, mouseY);
            this.canvas.style.cursor = isHovering ? 'pointer' : 'default';
        });
    }
}
