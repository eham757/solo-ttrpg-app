import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar-component',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.css',
})
export class NavbarComponent {
  links = [
    { label: 'Home', url: '/' },
    { label: 'Oracle', url: '/oracle' },
    { label: 'Dice', url: '/dice' },
    { label: 'Characters', url: '/characters' },
  ];
}
