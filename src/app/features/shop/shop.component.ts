import { Component, inject, signal, WritableSignal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { IProduct } from '../../core/models/IProduct/iproduct.interface';
import { ProductsService } from '../../core/services/products/products.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { ProductCardComponent } from "../../shared/product-card/product-card.component";
import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module

@Component({
  selector: 'app-shop',
  imports: [RouterLink, ProductCardComponent, NgxPaginationModule],// <-- include it in your app module
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent {
  private readonly productsService = inject(ProductsService);
  private readonly authService = inject(AuthService);
  productList: WritableSignal<IProduct[]> = signal([]);
  private readonly wishlistService = inject(WishlistService);
  wishListDetails: WritableSignal<IProduct[]> = signal([]);

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getAllProducts();
    if (this.authService.isLoggedInUser() === true) {
      this.getLoggedUserWishList();
    }
  }

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

  pageSize: WritableSignal<number> = signal(0);
  currentPage: WritableSignal<number> = signal(0);
  total: WritableSignal<number> = signal(0);
  getAllProducts(pageNumber: any = 1) {
    this.productsService.getAllProducts({ page: pageNumber, limit: 15 }).subscribe({
      next: (res) => {
        this.productList.set(res.data);
        console.log(res);
        this.pageSize.set(res.metadata.limit);
        this.currentPage.set(res.metadata.currentPage);
        this.total.set(res.results);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  pageChanged(event: number) {
    this.getAllProducts(event);
  }
}
