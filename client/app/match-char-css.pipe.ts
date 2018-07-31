import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'matchCharCss'
})
export class MatchCharCssPipe implements PipeTransform {

  constructor(private _sanitizer: DomSanitizer) { 
  }

  transform(value: any, args?: any): any {    
    let termsApply = value.replace(args,"<span style='font-weight:bold;color:Blue;'>"+args+"</span>");  
    return this._sanitizer.bypassSecurityTrustHtml(termsApply);   
  }

}
