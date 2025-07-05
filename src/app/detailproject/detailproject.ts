import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageDto, ProjectDto } from '../db/dtos/project';
import { DbService } from '../db/db';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-detailproject',
  imports: [DatePipe, CommonModule],
  templateUrl: './detailproject.html',
  styleUrl: './detailproject.scss'
})
export class Detailproject implements OnInit {

  protected projectImagesUrls!: string[];
  protected maxPlaceholders: string[] = new Array(10);
  protected projectId!: number;
  protected project: ProjectDto | undefined;

  constructor(protected _router: Router, private route: ActivatedRoute, private db: DbService) {  }

  ngOnInit() {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(this.projectId)) {
      this._router.navigate(['/']);
      return;
    }
    this.db.getProject(this.projectId).then((project) => {
      this.project = project!;
      console.log('Project loaded:', this.project);
    }).catch(() => {
      this.project = undefined;
      console.error('Error loading project');
    });

    this.db.getProjectImages(this.projectId).then((images) => {
      console.log('Project images:', images);
      this.projectImagesUrls = images;
      console.log('Project images loaded:', this.projectImagesUrls);
    }).catch(() => {
      this.projectImagesUrls = [];
      console.error('Error loading project images');
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

  placeholders(): any[] {
      const count = 10 - this.projectImagesUrls.length;
      return new Array(count);
  }
}
