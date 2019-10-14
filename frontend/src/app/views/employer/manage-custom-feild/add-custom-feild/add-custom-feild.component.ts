import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomFeildService } from '../customFeild.service';
import { ToastrService } from 'ngx-toastr';
import { Params, ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-add-custom-feild',
  templateUrl: './add-custom-feild.component.html',
  styleUrls: ['./add-custom-feild.component.scss']
})
export class AddCustomFeildComponent implements OnInit {
  submitted = false;
  panelTitle = 'Add Custom Field'
  buttonTitle = 'Add';
  addCustomFeild: FormGroup;
  id:any;
  data: any ={};
  constructor(private service: CustomFeildService, 
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router : Router) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      console.log(this.id);
    });

    this.service.get_custom_field(this.id).subscribe(res => {
      this.data= res['data'];
      this.panelTitle = 'Edit Custom Field';
      this.buttonTitle = 'Update';
      console.log('custom data',this.data);
      
    })


    this.addCustomFeild = new FormGroup({
      key: new FormControl('', [Validators.required])
    })
  }
  onSubmit(valid) {
    this.submitted = true;
    if(this.id != 0){
      let obj = {
        "id": this.id,
        "key": this.addCustomFeild.value['key']
      }
      console.log('Edited!!', obj);
      this.service.edit_custom_field(obj).subscribe(res => {
        this.router.navigate(['/employer/customfeild/list'])
      })
    }
    else{
    if (valid) {
      this.service.add_custom_field(this.addCustomFeild.value).subscribe(res => {
        console.log('add', res);

        if (res['data']['status'] === 1) {
          this.submitted = false;
          this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
          this.addCustomFeild.reset();
        }
      }, (err) => {
        console.log('error msg ==>', err['error']['message']);

        this.toastr.error(err['error']['message'][0].msg, 'Error!', { timeOut: 3000 });
      });
    }
    }
  }
}
