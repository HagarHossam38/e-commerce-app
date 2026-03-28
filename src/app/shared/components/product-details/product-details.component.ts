import { Component, computed, inject, input, InputSignal, OnInit, Signal, signal, WritableSignal, CUSTOM_ELEMENTS_SCHEMA, } from '@angular/core';
import { IProduct } from '../../../core/models/IProduct/iproduct.interface';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsService } from '../../../core/services/products/products.service';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';

import { register } from 'swiper/element/bundle';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';
import { AuthService } from '../../../core/services/auth/auth.service';
@Component({
  selector: 'app-product-details',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductDetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);
  productId: WritableSignal<string> = signal('');
  prodData: WritableSignal<IProduct> = signal({} as IProduct);

  quantity: WritableSignal<number> = signal(1);
  maxQuantity: Signal<number> = computed(() => this.prodData().quantity);

  totalPrice: Signal<number> = computed(() => this.prodData().price * this.quantity());

  increaseQuantity() {
    this.quantity.update(q => q < this.maxQuantity() ? q + 1 : q);
  }
  decreaseQuantity() {
    this.quantity.update(q => q > 1 ? q - 1 : q);
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.getProductIDfromRoute();
    register();
  }


  getProductIDfromRoute() {
    this.activatedRoute.paramMap.subscribe((url) => {
      let id = url.get('id');
      if (id) {
        this.productId.set(id);
        this.getSpecificProduct();
      }
    })
  }
  private readonly authService = inject(AuthService);

  getSpecificProduct() {
    this.productsService.getSpecificProduct(this.productId()).subscribe({
      next: (res) => {
        console.log(res);
        this.prodData.set(res.data);
        if (this.authService.isLoggedInUser() === true) {
          this.getLoggedUserWishList();
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);


  addToCart() {
    this.cartService.addProductToCart(this.productId()).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          console.log(res);
          if (this.quantity() > 1) {
            this.updateProductQuantity();
            this.toastrService.success(`${this.quantity()} of ${this.prodData().title} Added`, "Product Added")
          }
          else {
            this.toastrService.success(
              `${this.prodData().title} has been added to your cart`,
              "Product Added"
            );
          }
          //To show cart items count in nav bar
          this.cartService.numberOfCartItems.set(res.numOfCartItems);
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }


  updateProductQuantity() {
    this.cartService.updateCartProductQuantity(this.productId(), this.quantity()).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }


  private readonly wishlistService = inject(WishlistService);
  addToWishlist() {
    this.wishlistService.addProductToWishlist(this.productId()).subscribe({
      next: (res) => {
        console.log(res);
        this.inWishListFlag.set(true);
        this.toastrService.success(
          `${this.prodData().title} has been added to your wish list`,
          "Product Added"
        );
        this.wishlistService.numberOfWishListItems.set(res.data.length);
      },
      error: (err) => {
        console.log(err);
        this.toastrService.error(
          `Failed to Add ${this.prodData().title} to your wish list`,
          "Error"
        );
      }
    });
  }

  deleteItemFromWishlist() {
    this.wishlistService.removeProductFromWishlist(this.productId()).subscribe({
      next: (res) => {
        console.log(res);
        this.inWishListFlag.set(false);
        this.wishlistService.numberOfWishListItems.set(res.data.length);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }


  wishListDetails: WritableSignal<IProduct[]> = signal([]);
  inWishListFlag: WritableSignal<boolean | null> = signal(null);
  private readonly wishListService = inject(WishlistService);
  getLoggedUserWishList() {
    this.wishListService.getLoggedUserWishlist().subscribe({
      next: (res) => {
        this.wishListDetails.set(res.data);
        //Check if in wish List
        this.inWishListFlag.set(this.wishListDetails()?.some(
          p => p.id === this.productId()
        ));
      },
      error: (err) => {
        console.log(err);
      }
    });
  }



}
