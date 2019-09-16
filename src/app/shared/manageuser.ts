import { Component } from '@angular/core';
@Component({
  selector: 'manageuser',
})
export class manageusercomponent {
  app: any = [];

  constructor() { }
 

  dispalyMenu (navItems?, user?) {
      this.app = [];
    if (user != null && user !== '' && user != undefined) {
        if(user == 'admin') {
            for (let index = 0; index < navItems.length; index++) {
                if (index <= 1  )
                {
                this.app.push(navItems[index]);
                } 
            }
          //  navItems = this.app;
            } else if (user == 'employer') {
              
                for (let index = 0; index < navItems.length; index++) {
                if (index == 1 || index ==2 || index == 4 || index == 5 || index== 6 || index ==7)
                {
                    this.app.push(navItems[index]);
                } 
                }
               // navItems = this.app;
            } else if (user == 'candidate') {
                for (let index = 0; index < navItems.length; index++) {
                if ( index == 3  )
                {
                    this.app.push(navItems[index]);
                } 
                }
             
            }
        }
        return navItems = this.app;
    }
}
