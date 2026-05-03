import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../app/shared/components/header/header';
import { CategoryListComponent } from './component/category-list/category-list';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, CategoryListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('front-end');
}
