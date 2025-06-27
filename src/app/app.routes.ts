import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { BlogDetailComponent } from './pages/blog-detail/blog-detail.component';
import { AdminComponent } from './pages/admin/admin.component';
import { LoginComponent } from './pages/login/login.component';
import { BlogEditorComponent } from './pages/blog-editor/blog-editor.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { RegisterComponent } from './auth/register/register.component';
import { BlogListComponent } from './pages/blog-list/blog-list.component'; // 👈 Import this

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'blog/:id', component: BlogDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'editor', component: BlogEditorComponent }, // optional, not part of admin

  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: 'blogs', component: BlogListComponent },               // ✅ List view
      { path: 'blogs/create', component: BlogEditorComponent },      // ✅ Create
      { path: 'blogs/:id/edit', component: BlogEditorComponent },    // ✅ Edit
      {
        path: 'profile',
        loadComponent: () => import('./pages/user-profile/user-profile.component').then(m => m.UserProfileComponent)
      },
      { path: '', redirectTo: 'blogs', pathMatch: 'full' }           // ✅ Default
    ]
  },

  { path: '**', component: NotFoundComponent }
];
