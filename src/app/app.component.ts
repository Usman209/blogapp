import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component'; // ✅ Adjust path if needed
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, HeaderComponent,FooterComponent], // ✅ Include HeaderComponent
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
