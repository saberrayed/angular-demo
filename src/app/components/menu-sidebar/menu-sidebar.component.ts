import {
  Component,
  OnInit,
  AfterViewInit,
  Renderer2,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core';
import { Router } from '@angular/router';
import { TOKEN, CURRENT_USER } from 'src/app/utils/items/storage-names';
import { ApiService } from 'src/app/utils/services/api.service';
import { AppService } from 'src/app/utils/services/app.service';

@Component({
  selector: 'app-menu-sidebar',
  templateUrl: './menu-sidebar.component.html',
  styleUrls: ['./menu-sidebar.component.scss']
})
export class MenuSidebarComponent implements OnInit, AfterViewInit {
  
  @ViewChild('mainSidebar', { static: false }) mainSidebar;

  @Output() mainSidebarHeight: EventEmitter<any> = new EventEmitter<any>();

  processing = false;

  constructor(
    public appService: AppService,
    private service: ApiService,
    private router: Router
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.mainSidebarHeight.emit(this.mainSidebar.nativeElement.offsetHeight);
  }

  isCurrentPath(homeName) {
    const paths = window?.location?.pathname?.split('/')?.filter((x) => x);
    return paths?.indexOf(homeName) > -1
      ? true
      : false;
  }

  logout() {
    if(this.processing) {
      return;
    }
    this.processing = true;
    
    this.service.logout()
    .subscribe((response: any) => {
      this.router.navigate(['/logout']);
    },(err) => {
      this.processing = false;
    });
  }
}
