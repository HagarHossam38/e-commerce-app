import { CartService } from '../../../core/services/cart/cart.service';
import { Component, inject, input, Input, InputSignal, signal, WritableSignal } from '@angular/core';
import { IProduct } from '../../../core/models/IProduct/iproduct.interface';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  //Old way
  // @Input({ required: true }) product!: IProduct;
  //using Signals
  product: InputSignal<IProduct> = input.required<IProduct>();
  wishListDetails: InputSignal<IProduct[]> = input.required<IProduct[]>();

  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  ngOnChanges(): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.checkIfInWishList();
  }

  addToCart() {
    this.cartService.addProductToCart(this.product()._id).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          console.log(res);
          //Show Success Message
          this.toastrService.success(
            `${this.product().title} has been added to your cart`,
            "Product Added"
          );
          //To show cart items count in nav bar
          this.cartService.numberOfCartItems.set(res.numOfCartItems);
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  private readonly wishlistService = inject(WishlistService);
  addToWishlist() {
    this.wishlistService.addProductToWishlist(this.product()._id).subscribe({
      next: (res) => {
        console.log(res);
        this.toastrService.success(
          `${this.product().title} has been added to your wish list`,
          "Product Added"
        );
        this.inWishListFlag.set(true);
        this.wishlistService.numberOfWishListItems.set(res.data.length);
      },
      error: (err) => {
        console.log(err);
        this.toastrService.error(
          `Failed to Add ${this.product().title} to your wish list`,
          "Error"
        );
      }
    });
  }


  deleteItemFromWishlist() {
    this.wishlistService.removeProductFromWishlist(this.product()._id).subscribe({
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
  inWishListFlag: WritableSignal<boolean> = signal(false);
  checkIfInWishList() {
    //Check if in wish List
    this.inWishListFlag.set(this.wishListDetails()?.some(
      p => p.id === this.product().id
    ));
    console.log(this.inWishListFlag());

  }
}
