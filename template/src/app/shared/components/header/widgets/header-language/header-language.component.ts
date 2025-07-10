import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { language } from '../../../../data/header';
import { Language } from '../../../../interface/header';
import { NavService } from '../../../../services/nav.service';
import { LayoutService } from '../../../../services/layout.service';

@Component({
  selector: 'app-header-language',
  imports: [CommonModule],
  templateUrl: './header-language.component.html',
  styleUrl: './header-language.component.scss'
})

export class HeaderLanguageComponent {

  public languages = language;
  public selectedLanguage: Language;

  constructor(
    public navService: NavService, 
    private translate: TranslateService,
    private layoutService: LayoutService
  ) {
    this.languages.filter((details) => {
      if (details.active) {
        this.selectedLanguage = details
      }
    })
  }

  selectLanguage(language: Language) {
    this.selectedLanguage = language;
    console.log('Selected language:', language);
    
    // تغيير اللغة في الترجمة
    this.translate.use(language.code);
    
    // تطبيق اتجاه التخطيط المناسب
    if (language.code === 'en') {
      document.getElementsByTagName('html')[0].setAttribute('dir', 'ltr');
      document.body.className = 'ltr ' + this.layoutService.config.settings.layout_version;
      this.layoutService.config.settings.layout_type = 'ltr';
      localStorage.setItem('layout_type', 'ltr');
    } else if (language.code === 'ae') {
      document.getElementsByTagName('html')[0].setAttribute('dir', 'rtl');
      document.body.className = 'rtl ' + this.layoutService.config.settings.layout_version;
      this.layoutService.config.settings.layout_type = 'rtl';
      localStorage.setItem('layout_type', 'rtl');
    }
    
    // إغلاق قائمة اللغات
    this.navService.isLanguage = false;
  }

  toggleLanguageMenu() {
    this.navService.isLanguage = !this.navService.isLanguage;
  }

}
