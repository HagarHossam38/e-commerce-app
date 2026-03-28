import { Component, Input, input, InputSignal } from '@angular/core';
import { ICategory } from '../../core/models/ICategory/icategory.interface';

@Component({
  selector: 'app-category-card',
  imports: [],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.css',
})
export class CategoryCardComponent {
  categoryData: InputSignal<ICategory> = input.required<ICategory>();
}
