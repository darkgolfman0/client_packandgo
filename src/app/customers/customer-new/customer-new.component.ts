import { Component, OnInit } from '@angular/core';
import { Customer } from '../../models/customer';
import { CustomerService } from '../../services/customer.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { data } from 'jquery';

export interface CustomerType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-customers-new',
  templateUrl: './customer-new.component.html',
  styleUrls: ['./customer-new.component.scss']
})

export class CustomerNewComponent implements OnInit {

  customerName: string;
  customerType: string;
  customerAddress: string;
  customerPostcode: string;
  customerTelephone: string;
  customerReference: string;
  customerNote: string;
  userId: number;
  provincedata: any
  districtdata: any
  subdistrictdata: any
  postcodedata: any


  customerTypeControl = new FormControl('', [Validators.required]);
  customerTypeValue: CustomerType[] = [
    { value: 'Retail', viewValue: 'ลูกค้ารายย่อย (Retail)' },
    { value: 'Dealer', viewValue: 'ลูกค้าสั่งซื้อผ่านตัวแทน (Dealer)' },
    { value: 'Business', viewValue: 'ลูกค้ากลุ่ม B2B (Business)' }
  ];
  customers: Customer[] = [];
  customerForm: FormGroup;
  constructor(
    private customerService: CustomerService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toast: MatSnackBar
  ) { }

  ngOnInit() {
    this.customerService.get_province().subscribe(res => {
      this.provincedata = res
      console.log('respon', this.provincedata)
    })

    this.userId = JSON.parse(localStorage.getItem('userProfile')).username;
    this.customerForm = this.formBuilder.group({
      customerName: ['', Validators.required],
      customerAddress: ['', Validators.required],
      customerSubdistrict: ['', Validators.required],
      customerDistrict: ['', Validators.required],
      customerProvince: ['', Validators.required],
      customerPostcode: ['', Validators.required],
      customerTelephone: ['', Validators.required],
      customerType: ['', Validators.required],
      customerReference: [''],
      customerNote: [''],
    });
    //
    // this.customerService.getAll().pipe(first()).subscribe(customers => {
    //   this.customers = customers;
    // });
  }

  changeProvince(data) {
    console.log(data)
    this.customerService.get_district(data).subscribe(res => {
      this.districtdata = res
    })
  }

  changeDistrict(data) {
    console.log(data)
    this.customerService.get_sub_district(data).subscribe(res => {
      this.subdistrictdata = res
    })
  }

  changeSubDistrict(data) {
    console.log(data)
    this.customerService.get_postcode(data).subscribe(res => {
      console.log(res)
      this.postcodedata = res
    })
  }

  addCustomer() {
    if (!this.customerForm.value.customerType) {
      this.toast.open('กรุณาเลือกประเภทของลูกค้า', '', {
        duration: 2000,
        panelClass: ['snackBarError'],
        verticalPosition: 'top',
      });
      return;
    }
    if (!this.customerForm.valid) {
      this.toast.open('กรุณาเกรอกข้อมูลให้ครบถ้วน (ชื่อลูกค้า ที่อยู่ เบอร์โทรศัพท์)', '', {
        duration: 2000,
        panelClass: ['snackBarError'],
        verticalPosition: 'top',
      });
      return;
    }

    const pc = String(this.customerForm.value.customerPostcode)
    if (pc.length > 5) {
      this.toast.open('รหัสไปรษณีย์ ไม่ถูกต้อง', '', {
        duration: 2000,
        panelClass: ['snackBarError'],
        verticalPosition: 'top',
      });
      return;
    }

    const test_number: number = +pc;
    console.log(test_number);
    if (Number.isNaN(test_number)) {
      this.toast.open('รูปแบบรหัสไปรษณีย์ ไม่ถูกต้อง', '', {
        duration: 2000,
        panelClass: ['snackBarError'],
        verticalPosition: 'top',
      });
      return;
    }

    // const tempJson = {
    //   customer_name: this.customerForm.value.customerName,
    //   customer_type: this.customerForm.value.customerType,
    //   customer_address: this.customerForm.value.customerAddress,
    //   customer_postcode: this.customerForm.value.customerPostcode,
    //   customer_telephone: this.customerForm.value.customerTelephone,
    //   customer_reference: this.customerForm.value.customerReference,
    //   customer_note: this.customerForm.value.customerNote,
    //   updated_by: this.userId,
    // };

    const tempJson = {
      customer_name: this.customerForm.value.customerName,
      customer_type: this.customerForm.value.customerType,
      customer_address: this.customerForm.value.customerAddress,
      customer_province: this.customerForm.value.customerProvince,
      customer_district: this.customerForm.value.customerDistrict,
      customer_subdistrict: this.customerForm.value.customerSubdistrict,
      customer_postcode: this.customerForm.value.customerPostcode,
      customer_telephone: this.customerForm.value.customerTelephone,
      customer_reference: this.customerForm.value.customerReference,
      customer_note: this.customerForm.value.customerNote,
      updated_by: this.userId,
    };
    console.log(tempJson)
    this.customerService.addNewCustomer(JSON.stringify(tempJson)).pipe(first()).subscribe(
      data => {
        console.log(data)
        this.toast.open('เพิ่มลูกค้าใหม่เรียบร้อย ^_^', '', {
          duration: 2000,
          panelClass: ['snackBarSuccess'],
          verticalPosition: 'top',
        });
        setTimeout(() => {
          this.router.navigate(['clist']);
        },
          1000);
      },
      error => {
        this.toast.open('Error, cannot add new customer.', '', {
          duration: 2000,
          panelClass: ['snackBarError'],
          verticalPosition: 'top',
        });
      }
    );
  }
}
