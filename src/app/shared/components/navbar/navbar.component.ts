import { Component, HostListener, inject, OnInit, PLATFORM_ID, signal, WritableSignal, computed, Signal } from '@angular/core';
import { FlowbiteService } from '../../../core/services/flowbite/flowbite.service';
import { initFlowbite } from 'flowbite';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { CartService } from '../../../core/services/cart/cart.service';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, FormsModule, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {

  //Flags
  isLoggedInUser: Signal<boolean> = computed(() => this.authService.isLoggedInUser());// if user logged in

  //constructor(private flowbiteService: FlowbiteService) { }
  private readonly flowbiteService = inject(FlowbiteService);
  private readonly platformId = inject(PLATFORM_ID);
  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
    this.checkUserLoggedIn();
  }
  private readonly authService = inject(AuthService);
  checkUserLoggedIn() {
    if (isPlatformBrowser(this.platformId)) {
      if (localStorage.getItem('eCommerceToken') != undefined || sessionStorage.getItem('eCommerceToken') != undefined) {
        this.authService.isLoggedInUser.set(true);
        this.getLoggedUserCart();
        this.getLoggedUsertWishlist();
      }
      else {
        this.authService.isLoggedInUser.set(false);

      }
    }
  }
  mobileMenuOpen: WritableSignal<boolean> = signal(false);
  // mobileMenuOpen: boolean = false;

  toggleMenu() {
    console.log('before', this.mobileMenuOpen());
    // this.mobileMenuOpen = !this.mobileMenuOpen
    this.mobileMenuOpen.update(value => !value);
    console.log('After', this.mobileMenuOpen());

  }

  searchProducts() { }

  private readonly router = inject(Router)
  logOut() {
    //ٌRemove Token
    localStorage.removeItem('eCommerceToken');
    sessionStorage.removeItem('eCommerceToken');
    //Navigate
    this.router.navigate(['/login'])
    this.authService.isLoggedInUser.set(false);
    this.cartService.numberOfCartItems.set(0);
    this.wishListService.numberOfWishListItems.set(0);
    this.mobileMenuOpen.set(false);
  }

  private readonly cartService = inject(CartService);
  private readonly wishListService = inject(WishlistService);
  cartCount: Signal<number> = computed(() => this.cartService.numberOfCartItems());
  wishListCount: Signal<number> = computed(() => this.wishListService.numberOfWishListItems());

  getLoggedUserCart() {
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        console.log(res);
        this.cartService.numberOfCartItems.set(res.numOfCartItems);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getLoggedUsertWishlist() {
    this.wishListService.getLoggedUserWishlist().subscribe({
      next: (res) => {
        this.wishListService.numberOfWishListItems.set(res.data.length);
      },
      error: (err) => {
        console.log(err);
      }

    });
  }

}
