import {
  Component,
  OnInit,
  HostListener,
  ElementRef,
  AfterViewInit
} from '@angular/core';

import { DOCUMENT } from '@angular/platform-browser';
import * as $ from 'jquery';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class Header implements AfterViewInit {
  public angularclassLogo = 'assets/img/cd-logo.svg';
  public scrolling = false;
  public headerHeight;
  public previousTop = 0;
  public currentTop = 0;
  public scrollDelta = 10;
  public scrollOffset = 150;
  public scrollCheck = '';

  constructor(private el: ElementRef) {}

  public ngAfterViewInit() {}

  @HostListener('window:scroll', [])onWindowScroll() {
    var headerTest = this;
    if( !this.scrolling ) {
      this.scrolling = true;
      if (!window.requestAnimationFrame) {
        setTimeout(function() {
          this.autoHideHeader(headerTest);
        }.bind(headerTest), 250);
      } else {
        requestAnimationFrame(function() {
          this.autoHideHeader(headerTest);
        }.bind(headerTest));
      }
    }
  }

  public autoHideHeader(header) {
    var currentTop = $(window).scrollTop();
    header.checkSimpleNavigation(currentTop, header);
    header.previousTop = currentTop;
    header.scrolling = false;
  }

  public checkSimpleNavigation(currentTop, header) {
    header.currentTop = currentTop;
    if (header.previousTop - header.currentTop > header.scrollDelta) {
      header.scrollCheck ='';
    } else if((header.currentTop - header.previousTop > header.scrollDelta) &&
      (header.currentTop > header.scrollOffset)) {
        header.scrollCheck ='is-hidden';
    }
  }
}
