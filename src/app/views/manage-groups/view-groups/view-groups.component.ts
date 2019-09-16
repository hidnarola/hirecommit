import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-groups',
  templateUrl: './view-groups.component.html',
  styleUrls: ['./view-groups.component.scss']
})
export class ViewGroupsComponent implements OnInit {
  viewInfo : FormGroup;
  constructor(private router: Router) { }
  ngOnInit() {
    const table = $('#example').DataTable({
      drawCallback: () => {
        $('.paginate_button.next').on('click', () => {
            this.nextButtonClickEvent();
          });
      }
    });

  }

  buttonInRowClick(event: any): void {
    event.stopPropagation();
    console.log('Button in the row clicked.');
  }

  wholeRowClick(): void {
    console.log('Whole row clicked.');
  }

  nextButtonClickEvent(): void {
    // do next particular records like  101 - 200 rows.
    // we are calling to api

    console.log('next clicked');
  }
  previousButtonClickEvent(): void {
    // do previous particular the records like  0 - 100 rows.
    // we are calling to API
  }
  detail() {
    this.router.navigate(['/groups/summarydetail']);
   }
 
   edit() {
    this.router.navigate(['/groups/addgroup']);
   }
 
   delete() {}
 
   onAdd() {
     this.router.navigate(['/groups/addgroup']);
   }
   
   onclick(){
     

      Swal.fire({
        title: 'Enter Group Name',
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Add',
       confirmButtonClass: '/groups/addgroup',
        showLoaderOnConfirm: true,
        // preConfirm: (login) => {
        //   return fetch(`//api.github.com/users/${login}`)
        //     .then(response => {
        //       if (!response.ok) {
        //         throw new Error(response.statusText)
        //       }
        //       return response.json()
        //     })
        //     .catch(error => {
        //       Swal.showValidationMessage(
        //         `Request failed: ${error}`
        //       )
        //     })
        // },
  //       allowOutsideClick: () => !Swal.isLoading()
  //     }).then((result) => {
  //       if (result.value) {
  //         Swal.fire({
  //           title: `${result.value.login}'s avatar`,
  //           imageUrl: result.value.avatar_url
  //         })
  //       }
  //     });
  //  }
       } )}
 

}
