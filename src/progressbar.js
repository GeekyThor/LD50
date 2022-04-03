export class ProgressBar
{
    constructor(scene, x, y, width, height, offset, color, bgcolor)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.bgcolor = bgcolor;
        this.offset = offset;

        this.progressBox = scene.add.graphics();
        this.progressBox.fillStyle(this.bgcolor, 0.8);
        this.progressBox.fillRect(x, y, width, height);
        this.progressBox.setDepth(1);

        this.progressBar = scene.add.graphics();
        this.progressBar.setDepth(1);
    }

    update(progress)
    {
        this.progressBox.clear();
        this.progressBox.fillStyle(this.bgcolor, 0.8);
        this.progressBox.fillRect(this.x, this.y, this.width, this.height);
        
        this.progressBar.clear();
        this.progressBar.fillStyle(this.color, 1);
        this.progressBar.fillRect(this.x + this.offset, this.y + this.offset, (this.width - 2 * this.offset) * progress, this.height - 2 * this.offset);
    }

    destroy()
    {
        this.progressBar.destroy();
        this.progressBox.destroy();
    }
}