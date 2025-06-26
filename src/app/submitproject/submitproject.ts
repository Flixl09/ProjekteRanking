import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-submitproject',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './submitproject.html',
  styleUrl: './submitproject.scss',
})
export class Submitproject{

  placeholders(): any[] {
      const count = 10 - this.projectImagesUrls.length;
      return new Array(count);
  }

  protected imageCount: number = 10;

  protected projectName: string = 'PlaceholderName';
  protected editProjectName: boolean = false;

  protected projectDescription: string = 'PlaceholderDescription';
  protected editProjectDescription: boolean = false;

  protected projectShortDescription: string = 'PlaceholderShortDescription';
  protected editProjectShortDescription: boolean = false;

  protected projectLink: string = 'https://example.com';
  protected editProjectLink: boolean = false;

  protected projectImagesUrls: string[] = [
    "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
    "https://www.gmund.com/shop/media/catalog/product/cache/ed18249e57a555397e203784300f83ad/g/m/gmund_papier_cotton_max_white_flat_4740.jpg"
  ];

  protected editProjectImagesUrls: boolean = false;

  removeImage(image: string) {
    const index = this.projectImagesUrls.indexOf(image);
    if (index > -1) {
      this.projectImagesUrls.splice(index, 1);
    }
  }


  isDragging = false;
  startX = 0;
  scrollLeft = 0;

  onDragStart(event: MouseEvent, element: HTMLElement) {
    this.isDragging = true;
    this.startX = event.pageX - element.offsetLeft;
    this.scrollLeft = element.scrollLeft;
    event.preventDefault();
  }

  onDragMove(event: MouseEvent, element: HTMLElement) {
    if (!this.isDragging) return;
    const x = event.pageX - element.offsetLeft;
    const walk = (x - this.startX) * 1; // *1 für Geschwindigkeit
    element.scrollLeft = this.scrollLeft - walk;
  }

  onDragEnd() {
    this.isDragging = false;
  }
}
