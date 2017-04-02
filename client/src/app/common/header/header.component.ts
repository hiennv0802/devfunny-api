import {
  Component,
  OnInit,
  HostListener
} from '@angular/core';

import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})

export class Header implements OnInit {
  public angularclassLogo = 'assets/img/cd-logo.svg';
  public scrolling = false;

  constructor() {

  }

  public ngOnInit() {

  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    console.log("scrolling")
    if( !this.scrolling ) {
			this.scrolling = true;
			(!window.requestAnimationFrame)
				? setTimeout(this.autoHideHeader, 250)
				: requestAnimationFrame(this.autoHideHeader);
		}
  }

  public autoHideHeader() {

  }
}
