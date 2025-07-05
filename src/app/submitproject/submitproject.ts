import { CommonModule } from '@angular/common';
import { Component, ElementRef, NgModule, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AccountService } from '../account';
import { DbService } from '../db/db';
import { UserDto } from '../db/dtos/project';

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
  protected showImageUpload: boolean = false;
  protected imageCount: number = 10;

  protected projectName!: string;
  protected editProjectName: boolean = false;

  protected projectDescription!: string;
  protected editProjectDescription: boolean = false;

  protected projectShortDescription!: string;
  protected editProjectShortDescription: boolean = false;

  protected projectLink!: string;
  protected editProjectLink: boolean = false;

  protected projectImagesUrls!: string[];
  protected editProjectImagesUrls: boolean = false;

  protected projectColor: string = '#FFFFFF';

  protected account: AccountService;
  protected db: DbService;

  protected bildoverlaytoggle: boolean = false;


  changeEditProjectName() {
    this.editProjectName = !this.editProjectName;
    sessionStorage.setItem('projectName', this.projectName);
  }

  changeEditProjectDescription() {
    this.editProjectDescription = !this.editProjectDescription;
    sessionStorage.setItem('projectDescription', this.projectDescription);
  }

  changeEditProjectShortDescription() {
    this.editProjectShortDescription = !this.editProjectShortDescription;
    sessionStorage.setItem('projectShortDescription', this.projectShortDescription);
  }

  changeEditProjectLink() {
    this.editProjectLink = !this.editProjectLink;
    sessionStorage.setItem('projectLink', this.projectLink);
  }

  changeEditProjectImagesUrls() {
    this.editProjectImagesUrls = !this.editProjectImagesUrls;
    sessionStorage.setItem('projectImagesUrls', JSON.stringify(this.projectImagesUrls));
  }

  removeImage(image: string) {
    const index = this.projectImagesUrls.indexOf(image);
    if (index > -1) {
      this.projectImagesUrls.splice(index, 1);
    }
  }

  constructor(account: AccountService, db: DbService) {
    this.account = account;
    this.db = db;
    this.loadProject();
  }

  loadProject() {
    this.projectName = sessionStorage.getItem('projectName') || 'PlaceholderName';
    this.projectDescription = sessionStorage.getItem('projectDescription') || 'PlaceholderDescription';
    this.projectShortDescription = sessionStorage.getItem('projectShortDescription') || 'PlaceholderShortDescription';
    this.projectLink = sessionStorage.getItem('projectLink') || 'https://example.com';
    const images = sessionStorage.getItem('projectImagesUrls');
    this.projectImagesUrls = images ? JSON.parse(images) : ["https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"];
  }

  onSubmit() {
    this.db.pushProject(this.account.getAuthkey()!, {
      title: this.projectName,
      description: this.projectDescription,
      shortdesc: this.projectShortDescription,
      projecturl: this.projectLink,
      color: this.projectColor.replace('#', ''),
      leader: {
        authkey: this.account.getAuthkey()!,
        name: this.account.getName(),
      },
      authorized: false,
    }, this.projectImagesUrls).then(() => {
      console.log('Project submitted successfully');
    }).catch(error => {
      console.error('Error submitting project:', error);
    });
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


  @ViewChild('colorref') colorinputref!: ElementRef<HTMLImageElement>;

  triggerPicker() {
    console.log("pssst triggerPicker wollte dir nur sagen, dass er funktioniert :D")
    this.colorinputref.nativeElement.click();
  }

  onColorChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.projectColor = input.value
  }

  protected startBildOverlay() {
    this.bildoverlaytoggle = true;
  }

  protected exitBildOverlay() {
    this.bildoverlaytoggle = false;
  }

  protected submitBildOverlay(url: string) {
    this.projectImagesUrls.push(url);
    sessionStorage.setItem('projectImagesUrls', JSON.stringify(this.projectImagesUrls));
    this.bildoverlaytoggle = false;
  }
}
