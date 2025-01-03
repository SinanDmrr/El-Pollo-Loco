class GameScreen {
    constructor(canvas, ctx, buttonText, buttonCallback, backgroundImagePath) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.buttonText = buttonText;
        this.buttonCallback = buttonCallback;
        this.backgroundImagePath = backgroundImagePath;
    }

    draw() {
        const screenImg = new Image();
        screenImg.src = this.backgroundImagePath;

        screenImg.onload = () => {
            this.ctx.drawImage(screenImg, 0, 0, this.canvas.width, this.canvas.height);

            // Button
            const buttonWidth = 200;
            const buttonHeight = 50;
            const buttonX = (this.canvas.width - buttonWidth) / 2;
            const buttonY = this.canvas.height / 2 + 180;

            this.ctx.fillStyle = "#FF6347";
            this.ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

            this.ctx.fillStyle = "#FFFFFF";
            this.ctx.font = "30px Arial";
            this.ctx.fillText(
                this.buttonText,
                buttonX + buttonWidth / 2 - this.ctx.measureText(this.buttonText).width / 2,
                buttonY + buttonHeight / 2 + 10
            );
        };

        screenImg.onerror = () => {
            console.error('Bild konnte nicht geladen werden:', this.backgroundImagePath);
        };
    }

    checkForButtonClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const buttonWidth = 200;
        const buttonHeight = 50;
        const buttonX = (this.canvas.width - buttonWidth) / 2;
        const buttonY = this.canvas.height / 2 + 150;

        if (
            mouseX >= buttonX &&
            mouseX <= buttonX + buttonWidth &&
            mouseY >= buttonY &&
            mouseY <= buttonY + buttonHeight
        ) {
            this.buttonCallback();
        }
    }

    isMouseOverButton(mouseX, mouseY) {
        const buttonWidth = 200;
        const buttonHeight = 50;
        const buttonX = (this.canvas.width - buttonWidth) / 2;
        const buttonY = this.canvas.height / 2 + 180;

        return (
            mouseX >= buttonX &&
            mouseX <= buttonX + buttonWidth &&
            mouseY >= buttonY &&
            mouseY <= buttonY + buttonHeight
        );
    }

}
