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

    // Set page title dynamically
    document.title = this.isEditMode ? 'Edit Blog' : 'Create Blog';

    if (this.isEditMode && this.blogId) {
      this.loading = true;
      this.blogService.getById(this.blogId).subscribe({
        next: (blog: Blog) => {
          this.blogForm.patchValue(blog);
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
      summary: [''],
      body: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.blogForm.invalid) return;


   const userJson = localStorage.getItem('user'); // or 'authUser', adjust as needed
   if (!userJson) {
     alert('User not found in local storage.');
     return;
   }

   const user = JSON.parse(userJson);


   if (!user?.id) {
     alert('User ID not found in local storage.');
     return;
   }

   const formValue = {
     ...this.blogForm.value,
     author: user?.id,
     updatedBy: user?.id,
     ...(this.isEditMode ? {} : { createdBy: user?.id }) // only set createdBy when creating
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
