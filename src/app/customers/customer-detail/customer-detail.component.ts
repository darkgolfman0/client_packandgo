import { Component, OnInit } from '@angular/core';
import { Customer, CustomerDetail } from '../../models/customer';
import { CustomerService } from '../../services/customer.service';
import { FormBuilder } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerType } from '../customer-new/customer-new.component';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-customers-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss']
})
export class CustomerDetailComponent implements OnInit {

  customer: Customer;
  customerCode: string;
  addressId: number;
  userId: number;
  customerTypeValue: CustomerType[] = [
    { value: 'Retail', viewValue: 'ลูกค้ารายย่อย (Retail)' },
    { value: 'Dealer', viewValue: 'ลูกค้าสั่งซื้อผ่านตัวแทน (Dealer)' },
    { value: 'Business', viewValue: 'ลูกค้ากลุ่ม B2B (Business)' }
  ];
  customerOrg: any;

  constructor(
    private customerService: CustomerService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toast: MatSnackBar
  ) {

  }

  ngOnInit() {
    this.customerOrg = JSON.parse(localStorage.getItem('userProfile'));
    console.log(this.customerOrg)
    this.customer = new Customer();
    const splitted = this.route.snapshot.paramMap.get('code').split('-');
    this.customerCode = splitted[0];
    this.addressId = +splitted[1];

    this.customerService.getCustomer(this.customerCode, this.addressId).pipe(first()).subscribe(customers => {
      this.customer = customers;
    });
  }

  updateCustomer() {
    if (!this.customer.customer_type) {
      this.toast.open('กรุณาเลือกประเภทของลูกค้า', '', {
        duration: 2000,
        panelClass: ['snackBarError'],
        verticalPosition: 'top',
      });
      return;
    }
    if ((this.customer.customer_name === '') || (this.customer.addresses[0].address === '') || (this.customer.addresses[0].telephone === '') || (this.customer.addresses[0].postcode === '') || (this.customer.customer_type === '')) {
      this.toast.open('กรุณาเกรอกข้อมูลให้ครบถ้วน (ชื่อลูกค้า ที่อยู่ รหัสไปรษณีย์เบอร์โทรศัพท์)', '', {
        duration: 2000,
        panelClass: ['snackBarError'],
        verticalPosition: 'top',
      });
      return;
    }

    if (this.customer.addresses[0].postcode.length > 5) {
      this.toast.open('รหัสไปรษณีย์ ไม่ถูกต้อง', '', {
        duration: 2000,
        panelClass: ['snackBarError'],
        verticalPosition: 'top',
      });
      return;
    }

    const test_number: number = +this.customer.addresses[0].postcode;
    console.log(test_number);
    if (Number.isNaN(test_number)) {
      this.toast.open('รูปแบบรหัสไปรษณีย์ ไม่ถูกต้อง', '', {
        duration: 2000,
        panelClass: ['snackBarError'],
        verticalPosition: 'top',
      });
      return;
    }

    const tempJson = {
      customer_code: this.customerCode,
      customer_name: this.customer.customer_name,
      customer_type: this.customer.customer_type,
      customer_address_id: this.customer.addresses[0].id,
      customer_address: this.customer.addresses[0].address,
      customer_province: this.customer.addresses[0].province,
      customer_district: this.customer.addresses[0].district,
      customer_subdistrict: this.customer.addresses[0].sub_district,
      customer_postcode: this.customer.addresses[0].postcode,
      customer_telephone: this.customer.addresses[0].telephone,
      customer_reference: this.customer.addresses[0].ref_data,
      customer_note: this.customer.addresses[0].note,
      updated_by: this.userId,
      com:this.customerOrg.orgID
    };
    console.log('update type', JSON.stringify(tempJson))
    this.customerService.updateCustomer(JSON.stringify(tempJson)).pipe(first()).subscribe(
      data => {
        console.log(data)
        this.toast.open('แก้ไขข้อมูลลูกค้าเรียบร้อย ^_^', '', {
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
        this.toast.open('Error, cannot update customer detail.', '', {
          duration: 2000,
          panelClass: ['snackBarError'],
          verticalPosition: 'top',
        });
      }
    );
  }

  doCancel() {
    this.router.navigate(['clist']);
  }

}
