import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ProductCardComponent } from "../../shared/components/product-card/product-card.component";
import { ProductsService } from '../../core/services/products/products.service';
import { IProduct } from '../../core/models/IProduct/iproduct.interface';

import { CategoryService } from '../../core/services/category/category.service';
import { ICategory } from '../../core/models/ICategory/icategory.interface';
import { RouterLink } from "@angular/router";
import { register } from 'swiper/element/bundle';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { CategoryCardComponent } from '../../shared/components/category-card/category-card.component';
@Component({
  selector: 'app-home',
  imports: [ProductCardComponent, CategoryCardComponent, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly categoryService = inject(CategoryService);
  private readonly authService = inject(AuthService);
  productList: WritableSignal<IProduct[]> = signal([]);
  categoriesList: WritableSignal<ICategory[]> = signal([]);
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getAllProducts();
    this.getAllCategories();
    if (this.authService.isLoggedInUser() === true) {
      this.getLoggedUserWishList();
    }
    // register Swiper custom elements
    register();
  }


  getAllProducts() {
    this.productsService.getAllProducts().subscribe({
      next: (res) => {
        this.productList.set(res.data);
        console.log(this.productList());

      },
      error: (err) => {
        console.log(err);
      }
    })
  }
  getAllCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (res) => {
        this.categoriesList.set(res.data);
        console.log(this.categoriesList());
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  private readonly wishlistService = inject(WishlistService);
  wishListDetails: WritableSignal<IProduct[]> = signal([]);

  getLoggedUserWishList() {
    this.wishlistService.getLoggedUserWishlist().subscribe({

      next: (res) => {
        this.wishListDetails.set(res.data);
        console.log('wishlist', res.data);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }




  //Slider

}
