import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule,  } from '@angular/forms';  // <-- import FormsModule
import { Post } from '../../model/post.model';

@Component({
  selector: 'app-home',
  imports: [FormsModule,CommonModule],
  
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {


  title = 'Welcome to C&W Blog!';
  clickCount = 0;



  posts: Post[] = [
  {
    id: 1,
    title: 'Welcome to My Blog',
    content: 'This is the first post on this blog platform.',
    author: 'Admin',
    date: '2025-06-24'
  },
  {
    id: 2,
    title: 'Angular Rocks!',
    content: 'Angular is a powerful framework for building dynamic apps.',
    author: 'C&W Dev',
    date: '2025-06-20'
  }
];


  onButtonClick() {
    this.clickCount++;
    alert(`Button clicked ${this.clickCount} times`);
  }

inputText: string = '';
reversedText: string = '';
processedText: string = '';
inputForProcessing1: string = '';  // 👈 new input field for processing

  reverseString() {
    this.reversedText = this.inputText.split('').reverse().join('');
  }


   processReversedString(str: string) {
    // Example: Convert to uppercase
    this.processedText = str.toUpperCase();
  }

}
