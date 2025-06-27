import { Component, OnInit } from '@angular/core';
import { BlogService, Blog } from '../../services/blog'; // Make sure BlogService is properly imported
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports:[CommonModule,RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  blogs: Blog[] = [];
  loading = true;
  error = '';

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.blogService.getAll().subscribe({
      next: (data) => {
        this.blogs = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load blogs';
        this.loading = false;
      }
    });
  }
}
