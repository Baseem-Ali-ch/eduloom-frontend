import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';
import { AppState } from '../../../state/user/user.state';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../../core/services/user/profile.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit, OnDestroy {
  user: any;
  private _subscription: Subscription = new Subscription();
  isSidebarOpen: boolean = false;
  profilePhoto: string = '';

  constructor(private _router: Router, private s_tore: Store<AppState>, private _profileService: ProfileService) {}

  ngOnInit(): void {
    this.loadUserData();
    this._profileService.profilePhoto$.subscribe((photoUrl) => {
      this.profilePhoto = photoUrl!;
    });
  }

  // display the user details
  loadUserData() {
    const loadUserDataSubscription = this._profileService.getUser().subscribe({
      next: (response: any) => {
        this.user = response.user;
        this.getImage();
      },
      error: (error) => {
        // console.error('Error loading user data:', error);
      },
    });
    this._subscription.add(loadUserDataSubscription);
  }

  getImage() {
    const getImageSubscription = this._profileService.getImage().subscribe({
      next: (response: any) => {
        this.profilePhoto = response.signedUrl;
      },
      error: (error) => {
        console.error('Error loading user image:', error);
      },
    });
    this._subscription.add(getImageSubscription);
  }

  // get image url
  getImageUrl(photoUrl: string): string {
    return this._profileService.getFullImageUrl(photoUrl);
  }

  // logout
  onLogout() {
    this._subscription = this._profileService.logout().subscribe({
      next: () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('token');
        localStorage.removeItem('refresh-token');

        this._router.navigate(['/student/login']).then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Logout Successful!',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: 'rgb(8, 10, 24)',
            color: 'white',
          });
        });
      },
      error: (error) => {
        console.error('Logout failed', error);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('token');
        localStorage.removeItem('refresh-token');

        this._router.navigate(['/student/login']).then(() => {
          Swal.fire({
            icon: 'error',
            title: 'Logout Failed!',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: 'rgb(8, 10, 24)',
            color: 'white',
          });
        });
      },
    });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
