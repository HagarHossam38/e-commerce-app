import { Component, computed, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { CartService } from '../../core/services/cart/cart.service';
import { isPlatformBrowser } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ICart } from '../../core/models/ICart/icart.interface';
import { FlowbiteService } from '../../core/services/flowbite/flowbite.service';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  private readonly flowbiteService = inject(FlowbiteService);
  private readonly cartService = inject(CartService);


  cartDetails: WritableSignal<ICart> = signal({} as ICart);
  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
    this.getLoggedUserCart();
  }
  getLoggedUserCart() {
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        console.log(res);
        this.cartDetails.set(res);
      },
      error: (err) => {
        console.log(err);
      }
    });

  }

  ///Delete || Clear
  showDeleteItemModal: WritableSignal<boolean> = signal(false);
  showClearCartModal: WritableSignal<boolean> = signal(false);
  selectedItemID: WritableSignal<any> = signal('');
  selectedItemTitle: WritableSignal<string> = signal('');
  clearCart() {
    this.cartService.ClearUserCart().subscribe({
      next: (res) => {
        console.log(res);
        if (res.message === "success") {
          this.cartDetails.set({} as ICart);//to refresh cart //empty object
          //To show cart items count in nav bar
          this.cartService.numberOfCartItems.set(0);
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  deleteSpecificItem() {
    this.cartService.removeSpecificCartItem(this.selectedItemID()).subscribe({
      next: (res) => {
        console.log(res);
        if (res.status === "success") {
          this.cartDetails.set(res);//to refresh cart
          //To show cart items count in nav bar
          this.cartService.numberOfCartItems.set(res.numOfCartItems);
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
    this.showDeleteItemModal.set(false);
  }
  productCount: WritableSignal<number> = signal(1);
  updateItemQuantity(id: any, newCount: any) {
    this.cartService.updateCartProductQuantity(id, newCount).subscribe({
      next: (res) => {
        console.log(res);
        this.productCount.set(newCount);
        if (res.status === "success") {
          this.cartDetails.set(res);//to refresh cart
          //To show cart items count in nav bar
          this.cartService.numberOfCartItems.set(res.numOfCartItems);
        }
      },
      error: (err) => {
        console.log(err);
      }
    });;
  }

  openDeleteItemModal(item: any) {
    this.selectedItemID.set(item.product.id);
    this.selectedItemTitle.set(item.product.title);
    this.showDeleteItemModal.set(true);
  }
  ////FREE  SHIPPING
  totalPrice = computed(() => this.cartDetails()?.data?.totalCartPrice ?? 0);

  remainingForFreeShipping = computed(() =>
    Math.max(0, 500 - this.totalPrice())
  );

  progressWidth = computed(() =>
    Math.min(100, (this.totalPrice() / 500) * 100)
  );

  hasFreeShipping = computed(() => this.totalPrice() >= 500);
}
