import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { BlogService, Blog } from '../../services/blog';

@Component({
  selector: 'app-blog-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './blog-editor.component.html',
  styleUrls: ['./blog-editor.component.css']
})
export class BlogEditorComponent implements OnInit {
  blogForm!: FormGroup;
  blogId: string | null = null;
  isEditMode = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.initForm();

    if (isPlatformBrowser(this.platformId)) {
      document.title = this.isEditMode ? 'Edit Blog' : 'Create Blog';
    }

    this.blogId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.blogId;

    if (this.isEditMode && this.blogId) {
      this.loading = true;
      this.blogService.getById(this.blogId).subscribe({
        next: (blog: Blog) => {
          this.blogForm.patchValue({
            ...blog,
            tags: blog.tags?.join(', ') || ''
          });
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          alert('Failed to load blog for editing.');
          this.router.navigate(['/admin/blogs']);
        }
      });
    }
  }

  private initForm(): void {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
      tags: ['']
    });
  }

  onSubmit(): void {
    if (this.blogForm.invalid) return;

    const userJson = localStorage.getItem('user');
    if (!userJson) {
      alert('User not found in local storage.');
      return;
    }

    const user = JSON.parse(userJson);
    if (!user?.id) {
      alert('User ID not found in local storage.');
      return;
    }

    const rawFormValue = this.blogForm.value;

    const formValue = {
      ...rawFormValue,
      tags: rawFormValue.tags
        ? rawFormValue.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
        : [],
      author: user?.id,
      updatedBy: user?.id,
      ...(this.isEditMode ? {} : { author: user?.id })
    };

    if (this.isEditMode && this.blogId) {
      this.blogService.update(this.blogId, formValue).subscribe(() => {
        this.router.navigate(['/admin/blogs']);
      });
    } else {
      this.blogService.create(formValue).subscribe(() => {
        this.router.navigate(['/admin/blogs']);
      });
    }
  }
}
