import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { IProduct } from '../../core/models/IProduct/iproduct.interface';
import { RouterLink } from "@angular/router";
import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { CartService } from '../../core/services/cart/cart.service';
import { ICart } from '../../core/models/ICart/icart.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-wisht-list',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './wisht-list.component.html',
  styleUrl: './wisht-list.component.css',
})
export class WishtListComponent implements OnInit {
  private readonly wishlistService = inject(WishlistService);
  ngOnInit(): void {
    this.getLoggedUsertWishlist();
    this.getLoggedUserCart();
  }

  wishProductsList: WritableSignal<IProduct[]> = signal([]);
  getLoggedUsertWishlist() {
    this.wishlistService.getLoggedUserWishlist().subscribe({
      next: (res) => {
        this.wishProductsList.set(res.data);
        console.log(this.wishProductsList());
        this.wishlistService.numberOfWishListItems.set(res.data.length);
      },
      error: (err) => {
        console.log(err);
      }

    });
  }

  cartDetails: WritableSignal<ICart> = signal({} as ICart);
  private readonly cartService = inject(CartService);
  getLoggedUserCart() {
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        this.cartDetails.set(res);
      },
      error: (err) => {
        console.log(err);
      }
    });

  }

  checkIfInCart(productId: any) {
    return this.cartDetails()?.data?.products?.find(
      p => p.product.id === productId
    );
  }

  deleteItemFromWishlist(productId: any) {
    console.log(productId);

    this.wishlistService.removeProductFromWishlist(productId).subscribe({
      next: (res) => {
        console.log(res);
        this.getLoggedUsertWishlist();
        console.log(this.wishlistService.numberOfWishListItems());
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  addToCart(productId: any) {
    this.cartService.addProductToCart(productId).subscribe({
      next: (res) => {
        console.log(res);
        this.getLoggedUserCart();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
