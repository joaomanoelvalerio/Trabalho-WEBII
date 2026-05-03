import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../services/category';
import { Category } from '../../models/category';

@Component({
  selector: 'app-category-list',
  standalone: true, //
  imports: [CommonModule],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css'
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];

  constructor(private service: CategoryService) {}

  ngOnInit(): void {
    this.service.list().subscribe(dados => {
      this.categories = dados;
      console.log(dados);
    });
  }
}
