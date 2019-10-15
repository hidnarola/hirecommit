import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { CustomFieldService } from '../custom-field.service';
@Component({
  selector: 'app-add-custom-field',
  templateUrl: './add-custom-field.component.html',
  styleUrls: ['./add-custom-field.component.scss']
})
export class AddCustomFieldComponent implements OnInit {
  submitted = false;
  panelTitle = 'Add Custom Field'
  buttonTitle = 'Add';
  addCustomFeild: FormGroup;
  id: any;
  data: any = {};
  isEdit = false;
  constructor(private service: CustomFieldService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      console.log('params', params);
      
      this.id = params['id'];
      this.isEdit = true;
      console.log(this.id);
    });

    this.service.get_custom_field(this.id).subscribe(res => {
      this.data = res['data'];
      this.panelTitle = 'Edit Custom Field';
      this.buttonTitle = 'Update';
      console.log('custom data', this.data);

    })


    this.addCustomFeild = new FormGroup({
      key: new FormControl('', [Validators.required])
    })
  }
  onSubmit(valid) {
    this.submitted = true;
    if (this.id && this.id != 0) {
      console.log('edit==>', this.id);
      
      let obj = {
        "id": this.id,
        "key": this.addCustomFeild.value['key']
      }
      console.log('Edited!!', obj);
      this.service.edit_custom_field(obj).subscribe(res => {
        if (res['data']['status'] === 1) {
          this.submitted = false;
          this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
          this.addCustomFeild.reset();
        }
        this.router.navigate(['/employer/custom_field/list'])
      }, (err) => {
        this.toastr.error(err['error']['message'][0].msg, 'Error!', { timeOut: 3000 });
      });
    }
     else {
       
      if (valid) {
        this.service.add_custom_field(this.addCustomFeild.value).subscribe(res => {
          console.log('>>', this.addCustomFeild.value);
          
          if (res['data']['status'] === 1) {
            this.submitted = false;
            this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
            this.addCustomFeild.reset();
          }
        }, (err) => {
          this.toastr.error(err['error']['message'][0].msg, 'Error!', { timeOut: 3000 });
        });
      }
    }
  }
}
