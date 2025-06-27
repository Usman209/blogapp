import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BlogService } from '../../services/blog';

@Component({
  selector: 'app-blog-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // ✅ Correct modules
  templateUrl: './blog-editor.component.html',
  styleUrls: ['./blog-editor.component.css']
})
export class BlogEditorComponent implements OnInit {
  blogForm: FormGroup;
  blogId: string | null = null;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      summary: [''],
      body: ['', Validators.required]
    });
  }

ngOnInit(): void {
  this.blogId = this.route.snapshot.paramMap.get('id');
  this.isEditMode = !!this.blogId;

  // ✅ Dynamically set the page title
  document.title = this.isEditMode ? 'Edit Blog' : 'Create Blog';

  if (this.isEditMode) {
    this.blogService.getById(this.blogId!).subscribe(blog => {
      this.blogForm.patchValue(blog);
    });
  }
}


  onSubmit(): void {
    if (this.blogForm.invalid) return;

    const formValue = this.blogForm.value;

    if (this.isEditMode) {
      this.blogService.update(this.blogId!, formValue).subscribe(() => {
        this.router.navigate(['/admin/blogs']);
      });
    } else {
      this.blogService.create(formValue).subscribe(() => {
        this.router.navigate(['/admin/blogs']);
      });
    }
  }
}
