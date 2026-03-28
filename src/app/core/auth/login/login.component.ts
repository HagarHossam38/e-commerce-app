import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart/cart.service';
import { WishlistService } from '../../services/wishlist/wishlist.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  loginForm!: FormGroup;
  showPassword: WritableSignal<boolean> = signal(false);
  ngOnInit(): void {
    this.initLoginForm();
  }
  initLoginForm() {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      rememberMe: [false]
    })
  }
  errorMsg: WritableSignal<string> = signal('');
  successMsg: WritableSignal<string> = signal('');
  login() {
    if (this.loginForm.valid) {
      console.log('form: ', this.loginForm.value);
      // Destructure the form value:
      //       // - 'rememberMe' will be extracted as a separate variable
      //       // - '...payload' will contain the rest of the form fields without 'rememberMe'
      const { rememberMe, ...payload } = this.loginForm.value;
      console.log('payload: ', payload);
      this.authService.singIn(payload).subscribe({
        next: (res) => {
          console.log(res);
          if (res.message == "success") {
            //1. Save token if remember me==true;
            if (rememberMe) {
              localStorage.setItem('eCommerceToken', res.token);
            } else {
              sessionStorage.setItem('eCommerceToken', res.token);
            }
            this.authService.isLoggedInUser.set(true);
            // hide Error message
            this.errorMsg.set('');
            //2. show success message
            this.successMsg.set('Login Successfully');
            //3.navigate to login page
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 2000)

            this.getLoggedUserCart();
            this.getLoggedUsertWishlist();
          }
        },
        error: (err) => {
          console.log(err);
          //1. show Error message
          this.successMsg.set('');
          //2. hide success message
          this.errorMsg.set(err.error.message);
        }
      })
    }
  }


  private readonly cartService = inject(CartService);
  private readonly wishListService = inject(WishlistService);
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

