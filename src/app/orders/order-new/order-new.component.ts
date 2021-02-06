import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Customer, CustomerDetail } from '../../models/customer';
import { CustomerService } from '../../services/customer.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { OrderDetail, OrderHeader } from '../../models/order';
import { BehaviorSubject } from 'rxjs';
import { formatDate } from '@angular/common';
import { MasterService } from '../../services/master.service';
import { DeliveryTypeMaster } from '../../models/master';
import { DialogOrderProduct } from '../order-product/order-product.component';


export interface CustomerType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-customers-new',
  templateUrl: './order-new.component.html',
  styleUrls: ['./order-new.component.scss']
})

export class OrderNewComponent implements OnInit {

  displayedColumns: string[] = [
    'delete',
    'product_detail',
    'product_unit_price',
    'product_quantity',
    'discount_for_item',
    'product_total_price'];

  hourOptions: string[] = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15',
    '16', '17', '18', '19', '20', '21', '22', '23'];
  minuteOptions: string[] = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15',
    '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
    '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45',
    '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'];

  products: Product[] = [];
  orderHeader: OrderHeader = new OrderHeader();
  orderDetails: OrderDetail[] = [];
  orderDetailDatasource: BehaviorSubject<OrderDetail>;

  tempUnitPrice = 0;
  addingProduct: Product;
  addingUnitPrice: number;
  addingQty: number;
  addingDiscount: number;
  addingTotalPrice: number;

  paymentDate: Date;
  paymentHour: string;
  paymentMinute: string;

  totalPrice = 0;
  customer: Customer;
  customerDetail: CustomerDetail[] = [];
  addressId: number;
  showAddNewItemPanel = false;
  showAddNewItemButton: boolean;
  showOrderDetailTable: boolean;
  showPaymentPanel: boolean;
  disableAddItemButton: boolean;
  showEditCustomerPanel: boolean;
  showDeliveryFee: boolean;

  customerName: string;
  customerType: string;
  customerAddress: string;
  customerTelephone: string;
  customerReference: string;
  customerNote: string;
  userId: number;
  paymentTimeString: string;

  deliveryMethods: DeliveryTypeMaster[] = [];
  totalProductPrice: number;
  pressingOrder: boolean;

  constructor(
    private productService: ProductService,
    private customerService: CustomerService,
    private orderService: OrderService,
    private refMaster: MasterService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toast: MatSnackBar,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    // @ts-ignore
    this.orderDetailDatasource = new BehaviorSubject<OrderDetail>([]);
    this.userId = JSON.parse(localStorage.getItem('userProfile')).username;

    this.pressingOrder = false;
    this.productService.getActive().pipe(first()).subscribe(products => {
      this.products = products;
    });

    this.orderDetails = [];
    const splitted = this.route.snapshot.paramMap.get('code').split('-');
    this.orderHeader.customer_code = splitted[0];
    this.addressId = +splitted[1];

    this.customerService.getCustomer(this.orderHeader.customer_code, this.addressId).pipe(first()).subscribe(customers => {
      this.customer = customers;
      this.orderHeader.customer_name = this.customer.customer_name;
      this.orderHeader.customer_type = this.customer.customer_type;
      this.customerDetail = this.customer.addresses;
      this.orderHeader.address_id = this.customerDetail[0].id;
      this.orderHeader.address_detail = this.customerDetail[0].address;
      this.orderHeader.province = this.customerDetail[0].province;
      this.orderHeader.district = this.customerDetail[0].district;
      this.orderHeader.sub_district = this.customerDetail[0].sub_district;
      this.orderHeader.postcode = this.customerDetail[0].postcode;
      this.orderHeader.customer_telephone = this.customerDetail[0].telephone;
      this.orderHeader.note = this.customerDetail[0].note;
      this.orderHeader.customer_reference = this.customerDetail[0].ref_data;
    });

    this.orderHeader.delivery_type = null;
    this.orderHeader.delivery_fee = 0;
    this.totalProductPrice = 0;

    this.showOrderDetailTable = false;
    this.showAddNewItemButton = true;
    this.refMaster.getDeliveryType().pipe(first()).subscribe(deliveryType => {
      this.deliveryMethods = deliveryType;
    });
    this.orderHeader.payment_status = null;
    this.showPaymentPanel = false;
    this.addingProduct = null;
    this.disableAddItemButton = false;
    this.showEditCustomerPanel = false;
    this.showDeliveryFee = false;
  }

  getInitialTempOrderDetail(selectedProduct) {
    console.log({ selected_product: selectedProduct });
    this.addingUnitPrice = selectedProduct.unit_price;
    this.addingQty = 1;
    this.addingDiscount = 0;
    this.addingTotalPrice = selectedProduct.unit_price;
  }

  addNewItemClick() {
    this.showAddNewItemPanel = true;
    this.showAddNewItemButton = false;
  }

  removeItemClick(index: number) {
    this.orderDetails.splice(index, 1);
    this.totalProductPrice = this.getTotal();
    // @ts-ignore
    this.orderDetailDatasource.next(this.orderDetails);
    if (this.orderDetails.length === 0) {
      this.showOrderDetailTable = false;
      this.showAddNewItemButton = true;
    }
  }

  getTotal() {
    this.totalProductPrice = +this.orderDetails.map(t => +t.product_total_price).reduce((acc, value) => acc + value, 0);
    return this.totalProductPrice;
  }

  insertTempOrderDetail() {
  }

  insertTempOrderDetailClearForm() {
    // this.newOrderDetailForm.reset();
    this.addingUnitPrice = null;
    this.addingQty = null;
    this.addingDiscount = null;
    this.addingTotalPrice = null;
    this.showAddNewItemPanel = false;
    this.showAddNewItemButton = true;
  }


  unitOrQtyChangeAdd() {
    this.addingQty = this.addingQty + 1;
    this.unitOrQtyChange();
  }

  unitOrQtyChangeRemove() {
    this.addingQty = this.addingQty - 1;
    if (this.addingQty < 0) {
      this.addingQty = 0;
    }
    this.unitOrQtyChange();
  }

  unitOrQtyChange() {
    this.addingTotalPrice = (this.addingUnitPrice * this.addingQty) - this.addingDiscount;
  }

  discountChange() {
    this.addingTotalPrice = this.addingTotalPrice - this.addingDiscount;
  }

  totalPriceChange() {
    this.addingDiscount = (this.addingUnitPrice * this.addingQty) - this.addingTotalPrice;

  }

  deliveryFeeChange() { }
  // this.orderHeader.delivery_fee = this.customerForm.value.deliveryFee;
  // console.log(this.orderHeader.delivery_type);
  // }


  paymentStatusChange(paymentStatus) {
    if (paymentStatus === 'ยังไม่จ่าย') {
      this.showPaymentPanel = false;
      this.orderHeader.payment_amount = 0;
    } else {
      this.showPaymentPanel = true;
      this.paymentDate = new Date();
      this.paymentHour = formatDate(new Date(), 'HH', 'en');
      this.paymentMinute = formatDate(new Date(), 'mm', 'en');
      this.orderHeader.payment_amount = +this.totalProductPrice + this.orderHeader.delivery_fee;
    }
  }

  deliveryMethodChange(dm) {
    this.orderHeader.delivery_type = dm;
    this.showDeliveryFee = true;
  }

  cancelOrder() {
    setTimeout(() => {
      this.router.navigate(['clist']);
    },
      100);
  }

  doToast(msg: string, type: string) {
    this.toast.open(msg, '', {
      duration: 2000,
      panelClass: ['snackBar' + type],
      verticalPosition: 'top',
    });
  }

  submitOrder() {

    if (this.orderHeader.customer_name === '') {
      this.doToast('กรุณาระบุ ชื่อลูกค้า', 'Warning');
      return;
    }
    if (this.orderHeader.address_detail === '') {
      this.doToast('กรุณาระบุ ที่อยู่ของลูกค้า', 'Warning');
      return;
    }
    if (this.orderHeader.province === '') {
      this.doToast('กรุณาระบุ จังหวัดของลูกค้า', 'Warning');
      return;
    }
    if (this.orderHeader.district === '') {
      this.doToast('กรุณาระบุ อำเภอของลูกค้า', 'Warning');
      return;
    }
    if (this.orderHeader.postcode === '') {
      this.doToast('กรุณาระบุ รหัสไปรษณีย์ลูกค้า', 'Warning');
      return;
    }
    const pc = String(this.orderHeader.postcode)
    if (pc.length > 5) {
      this.doToast('รหัสไปรษณีย์ ไม่ถูกต้อง', 'Warning');
      return;
    }
    const test_number: number = +pc;
    console.log(test_number);
    if (Number.isNaN(test_number)) {
      this.doToast('รูปแบบรหัสไปรษณีย์ ไม่ถูกต้อง', 'Warning');
      return;
    }
    if (this.orderHeader.customer_telephone === '') {
      this.doToast('กรุณาระบุ เบอร์โทรศัพท์ของลูกค้า', 'Warning');
      return;
    }
    if (this.orderDetails.length == 0) {
      this.doToast('กรุณาเลือกสินค้า', 'Warning');
      return;
    }
    if (this.orderHeader.delivery_type == null) {
      this.doToast('กรุณาเลือกวิธีการจัดส่ง', 'Warning');
      return;
    }
    console.log({ payment: this.orderHeader.payment_status });
    if (this.orderHeader.payment_status == null) {
      this.doToast('กรุณาเลือก ระบุสถานะการจ่ายเงิน', 'Warning');
      return;
    }

    this.pressingOrder = true;
    let tempPaymentDate: string;
    if (this.orderHeader.payment_status === 'ยังไม่จ่าย') {
      this.orderHeader.payment_amount = 0;
      tempPaymentDate = null;
    } else {
      this.paymentDate.setHours(+this.paymentHour, +this.paymentMinute, 0)
      tempPaymentDate = this.paymentDate.toISOString();
      console.log({ paymentTimeISO: tempPaymentDate });
      // tempPaymentDate = this.paymentDate.toISOString().slice(0, 10) + 'T' + this.paymentHour + ':' + this.paymentMinute + ':00.000Z';
    }
    // console.log({payment_date:tempPaymentDate});

    const tempJson = {
      principle_id: 1,
      // order_id: null,
      // order_date: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
      customer_code: this.orderHeader.customer_code,
      customer_name: this.orderHeader.customer_name,
      customer_type: this.orderHeader.customer_type,
      customer_telephone: this.orderHeader.customer_telephone,
      customer_reference: this.orderHeader.customer_reference,
      note: this.orderHeader.note,
      address_id: this.orderHeader.address_id,
      address_detail: this.orderHeader.address_detail,
      province: this.orderHeader.province,
      district: this.orderHeader.district,
      sub_district: this.orderHeader.sub_district,
      postcode: this.orderHeader.postcode,
      seller_id: 1,
      seller_detail: '-',
      delivery_fee: this.orderHeader.delivery_fee,
      delivery_type: this.orderHeader.delivery_type,
      payment_status: this.orderHeader.payment_status,
      payment_amount: this.orderHeader.payment_amount,
      payment_time: tempPaymentDate,
      order_amount: (this.totalProductPrice + this.orderHeader.delivery_fee),
      order_amount_without_delivery: this.totalProductPrice,
      order_source: 'app',
      updated_by: this.userId,
      items: this.orderDetails,
    };
    console.log({ item: tempJson });
    this.orderService.addNewOrder(JSON.stringify(tempJson)).pipe(first()).subscribe(
      data => {
        this.toast.open('เพิ่มรายการสั่งซื้อเรียบร้อย ^_^', '', {
          duration: 2000,
          panelClass: ['snackBarSuccess'],
          verticalPosition: 'top',
        });
        setTimeout(() => {
          this.router.navigate(['/olist']);
        },
          1000);
      },
      error => {
        this.toast.open('Error, cannot create order.', '', {
          duration: 2000,
          panelClass: ['snackBarError'],
          verticalPosition: 'top',
        });
        this.pressingOrder = false;
      }
    );

  }


  getPaymentTime() {
    // let tempPaymentDate: string;
    console.log({ paymentTimeISO_Before: this.paymentTimeString });
    if (this.orderHeader.payment_status === 'ยังไม่จ่าย') {
      this.orderHeader.payment_amount = 0;
      this.paymentTimeString = null;
    } else {
      this.paymentDate.setHours(+this.paymentHour, +this.paymentMinute, 0)
      // this.paymentTimeString = this.paymentDate.toISOString();
      this.paymentTimeString = this.paymentDate.toISOString().slice(0, 10) + ' ' + this.paymentHour + ':' + this.paymentMinute + ':00';
      console.log({ paymentTimeISO: this.paymentTimeString });

    }
  }
  popupOrderDetail() {
    const dialogRef = this.dialog.open(DialogOrderProduct, {
      width: '550px',
      data: { order: null }
    });
    this.disableAddItemButton = true;
    dialogRef.afterClosed().subscribe(result => {
      // this.addingProduct = result;
      this.disableAddItemButton = false;
      if (result == null) {
        return;
      } else {

        try {
        } catch (e) {
          console.log(e);

          return;
        }
        const tempChkProductId: string[] = [];
        this.orderDetails.forEach(function (value) {
          tempChkProductId.push(value.product_code);
        });
        //
        for (const v in tempChkProductId) {
          if (tempChkProductId[v] === result.product_code) {
            this.doToast('สินค้าซ้ำ กรุณาลบออกจากตระกร้าก่อน หากต้องการแก้ไขรายการ.', 'Warning');
            return;
          }
        }
        // this.addingProduct.product_unit_name
        result.product_unit_name = 'ชิ้น';
        this.orderDetails.push(result);
        // this.orderDetails.push({
        //   id: null,
        //   order_id: null,
        //   product_code: this.addingProduct.product_id,
        //   product_detail: this.addingProduct.product_detail,
        //   product_unit_price: this.addingUnitPrice,
        //   product_quantity: this.addingQty,
        //   product_unit_name: 'ชิ้น',
        //   discount_for_item: this.addingDiscount,
        //   product_total_price: this.addingTotalPrice,
        //   created_time: null,
        //   updated_time: null,
        //   updated_by: this.userId,
        //   stock_inventory_id: this.addingProduct.stock_inventory_id,
        //   batch: this.addingProduct.batch,
        // });
        this.totalPrice = this.getTotal();
        // this.newOrderDetailForm.reset();
        // this.addingUnitPrice = null;
        // this.addingQty = null;
        // this.addingDiscount = null;
        // this.addingTotalPrice = null;
        this.showOrderDetailTable = true;
        this.showAddNewItemButton = true;
        // this.showAddNewItemPanel = false;
        // @ts-ignore
        this.orderDetailDatasource.next(this.orderDetails);
        // this.addingProduct = null;
      }
    });
  }

  discountPercent(od: OrderDetail) {
    return (od.discount_for_item / od.product_quantity) / od.product_unit_price * 100;
  }

  isDisplayDiscount(od: OrderDetail) {
    if (this.discountPercent(od) === 0) {
      return false;
    } else {
      return true;
    }
  }

  onEditCustomerClick(isEdit: boolean) {
    this.showEditCustomerPanel = !isEdit;
  }

}
