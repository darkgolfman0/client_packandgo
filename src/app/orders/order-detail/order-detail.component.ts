import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { Customer, CustomerDetail } from '../../models/customer';
import { CustomerService } from '../../services/customer.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatTableDataSource } from '@angular/material';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { OrderDetail, OrderHeader } from '../../models/order';
import { BehaviorSubject } from 'rxjs';
import { formatDate } from '@angular/common';
import { MasterService } from '../../services/master.service';
import { DeliveryTypeMaster, ExtraPickedMaster } from '../../models/master';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


export interface ShippedDialogData {
  trackingNumber: string;
}

export interface ConfirmedDialogData {
  urgent: boolean;
  // partial_ship: boolean;
}

export interface CustomerType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-customers-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})

export class OrderDetailComponent implements OnInit {

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

  customerName: string;
  customerType: string;
  customerAddress: string;
  customerTelephone: string;
  customerReference: string;
  customerNote: string;
  userId: number;
  userProfile: any;

  deliveryMethods: DeliveryTypeMaster[] = [];
  totalProductPrice: number;

  constructor(
    private productService: ProductService,
    private customerService: CustomerService,
    private orderService: OrderService,
    private masterService: MasterService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toast: MatSnackBar,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) { }


  ngOnInit() {
    this.userProfile = JSON.parse(localStorage.getItem('userProfile'));

    this.orderHeader.order_id = this.route.snapshot.paramMap.get('code');
    // this.orderHeader = this.orderService.getOrder(this.orderHeader.order_id)[0];
    this.orderService.getOrder(this.orderHeader.order_id).pipe(first()).subscribe(items => {
      this.orderHeader = items[0];
      console.log(this.orderHeader)
      this.orderDetails = this.orderHeader.items;
      // @ts-ignore
      this.orderDetailDatasource.next(this.orderDetails);
      this.getTotal();
      this.paymentDate = new Date(this.orderHeader.payment_time);
      this.paymentHour = this.pad_with_zeroes(this.paymentDate.getHours(), 2);
      this.paymentMinute = this.pad_with_zeroes(this.paymentDate.getMinutes(), 2);
      console.log({ order_detail: this.orderHeader.shipped });

      if (this.orderHeader.confirmed) { this.orderHeader.confirmed = true; } else { this.orderHeader.confirmed = false; }
      if (this.orderHeader.picked) { this.orderHeader.picked = true; } else { this.orderHeader.picked = false; }
      if (this.orderHeader.packed) { this.orderHeader.packed = true; } else { this.orderHeader.packed = false; }
      if (this.orderHeader.shipped) { this.orderHeader.shipped = true; } else { this.orderHeader.shipped = false; }
      if (this.orderHeader.urgent) { this.orderHeader.urgent = true; } else { this.orderHeader.urgent = false; }
      if (this.orderHeader.partial_ship) { this.orderHeader.partial_ship = true; } else { this.orderHeader.partial_ship = false; }

      if (this.orderHeader.payment_status === 'ยังไม่จ่าย') {
        this.showPaymentPanel = false;
      } else {
        this.showPaymentPanel = true;
      }
    });
    // return;


    // @ts-ignore
    this.orderDetailDatasource = new BehaviorSubject<OrderDetail>([]);
    this.userId = JSON.parse(localStorage.getItem('userProfile')).username;


    this.productService.getActive().pipe(first()).subscribe(products => {
      this.products = products;
    });

    this.showOrderDetailTable = true;
    this.showAddNewItemButton = true;
    this.masterService.getDeliveryType().pipe(first()).subscribe(deliveryType => {
      this.deliveryMethods = deliveryType;
    });
    // this.showPaymentPanel = true;
    this.addingProduct = null;

  }

  pad_with_zeroes(number: number, length: number) {
    var my_string = '' + number;
    while (my_string.length < length) {
      my_string = '0' + my_string;
    }
    return my_string;
  }

  getInitialTempOrderDetail(selectedProduct) {
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
    console.log('Totel price: ' + this.totalProductPrice);
    return this.totalProductPrice;
  }

  insertTempOrderDetail() {
    try {
      console.log(this.addingProduct);
    } catch (e) {
      console.log(e);
      console.log('This is error.');

      return;
    }
    let tempChkProductId: string[] = [];
    this.orderDetails.forEach(function (value) {
      tempChkProductId.push(value.product_code);
    });
    //
    // console.log({tempId: tempChkProductId});
    for (var v in tempChkProductId) {
      console.log({ v: tempChkProductId[v], });
      if (tempChkProductId[v] === this.addingProduct.product_id) {
        this.doToast('สินค้าซ้ำ กรุณาลบออกจากตระกร้าก่อน หากต้องการแก้ไขรายการ.', 'Warning');
        return;
      }
    }

    this.orderDetails.push({
      id: null,
      order_id: null,
      product_code: this.addingProduct.product_id,
      customer_product_code: '',
      product_detail: this.addingProduct.product_detail,
      product_unit_price: this.addingUnitPrice,
      product_quantity: this.addingQty,
      product_unit_name: 'ชิ้น',
      discount_for_item: this.addingDiscount,
      product_total_price: this.addingTotalPrice,
      created_time: null,
      updated_time: null,
      updated_by: this.userId,
      stock_inventory_id: null,
      batch: null,
      batch_id: null,
      // stock_inventory_id: this.addingProduct.stock_inventory_id,
    });
    this.totalPrice = this.getTotal();
    // this.newOrderDetailForm.reset();
    this.addingUnitPrice = null;
    this.addingQty = null;
    this.addingDiscount = null;
    this.addingTotalPrice = null;
    this.showOrderDetailTable = true;
    this.showAddNewItemButton = true;
    this.showAddNewItemPanel = false;
    // @ts-ignore
    this.orderDetailDatasource.next(this.orderDetails);
    this.addingProduct = null;
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

  deliveryFeeChange() {
    // this.orderHeader.delivery_fee = this.customerForm.value.deliveryFee;
    // console.log(this.orderHeader.delivery_type);
  }


  paymentStatusChange(paymentStatus) {
    if (paymentStatus === 'ยังไม่จ่าย') {
      this.showPaymentPanel = false;
      this.orderHeader.payment_amount = 0;
    } else {
      this.showPaymentPanel = true;
      // this.paymentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
      this.paymentDate = new Date();
      this.paymentHour = formatDate(new Date(), 'HH', 'en');
      this.paymentMinute = formatDate(new Date(), 'mm', 'en');
      this.orderHeader.payment_amount = +this.totalProductPrice + this.orderHeader.delivery_fee;
    }
  }

  deliveryMethodChange(dm) {
    this.orderHeader.delivery_type = dm;
  }

  cancelOrder() {
    this.router.navigate(['/olist']);
  }


  deleteOrder() {
    if (confirm('Are you sure to delete')) {
      this.orderService.deleteOrder(this.orderHeader.order_id);
    }
    setTimeout(() => {
      this.router.navigate(['/olist']);
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

  statusUpdate(updateField: string, nextStatus: boolean) {

    if (updateField === 'urgent') {
      const roles = this.userProfile.groups.split(",");
      if (!((roles.indexOf('pgc_managers') > -1) || (roles.indexOf('pg_operators') > -1))) {
        alert('You do not have permission to update [urgent] status. Please contact system administrator.');
        return;
      } else {
        const tempUrgentJson = {
          order_id: this.orderHeader.order_id,
          urgent: nextStatus,
        }

        this.orderService.updateOrderStatusUrgent(JSON.stringify(tempUrgentJson)).pipe(first()).subscribe(
          data => {
            this.toast.open('Status updated.', '', {
              duration: 2000,
              panelClass: ['snackBarSuccess'],
              verticalPosition: 'top',
            });
            this.orderHeader.urgent = nextStatus;
          },
          error => {
            this.toast.open('Error, cannot update urgent status.', '', {
              duration: 2000,
              panelClass: ['snackBarError'],
              verticalPosition: 'top',
            });
          }
        );
        return;
      }
    }
    if (updateField === 'confirmed') {
      const roles = this.userProfile.groups.split(",");
      if (!(roles.indexOf('pgc_managers') > -1)) {
        alert('You do not have permission to update [confirmed] status. Please contact system administrator.');
        return;
      } else {
        if (nextStatus === true) {
          const dialogRef = this.dialog.open(DialogOrderDetailConfirmed, {
            width: '500px',
            data: { urgent: this.orderHeader.urgent, partial_ship: this.orderHeader.partial_ship }
          });

          dialogRef.afterClosed().subscribe(result => {
            this.orderHeader.urgent = result.urgent;
            this.orderHeader.partial_ship = result.partial_ship;
            console.log({ urgent: this.orderHeader.urgent, partial: this.orderHeader.partial_ship });
            this.doUpdateStatus(updateField, nextStatus);
          });
          return;
        } else {
          this.orderHeader.urgent = false;
          this.orderHeader.partial_ship = false;
        }
      }
    }
    if ((updateField === 'picked') || ((updateField === 'picked')) || (updateField === 'packed') || (updateField === 'shipped')) {
      if (!(this.userProfile.groups === 'pg_operators')) {
        alert('You do not have permission to update [picked, packed, shipped] status. Please contact system administrator.');
        return;
      }
      else {
        if (updateField === 'picked') {
          if (this.orderHeader.confirmed === false) {
            alert('This order is not confirmed yet. Cannot update [picked] status');
            return;
          }
        }
        if (updateField === 'packed') {
          if (!((this.orderHeader.confirmed === true) && (this.orderHeader.picked === true))) {
            alert('This order is not picked yet. Cannot update [packed] status');
            return;
          } else {
            if (nextStatus === true) {
              if (this.orderHeader.delivery_type == 'ไปรษณีย์ไทย') {
                const dialogRef = this.dialog.open(DialogOrderDetailTracking, {
                  width: '350px',
                  data: { trackingNumber: this.orderHeader.tracking_number }
                });

                dialogRef.afterClosed().subscribe(result => {
                  this.orderHeader.tracking_number = result;
                  this.doUpdateStatus(updateField, nextStatus);
                });
                return;
              }
            }
          }
        }
        if (updateField === 'shipped') {
          if (!((this.orderHeader.confirmed === true) && (this.orderHeader.picked === true) && (this.orderHeader.packed === true))) {
            alert('This order is not packed yet. Cannot update [shipped] status');
            return;
          }
        }
      }
    }
    this.doUpdateStatus(updateField, nextStatus);
  }

  doUpdateStatus(updateField: string, nextStatus: boolean) {
    const tempJson = {
      order_id: this.orderHeader.order_id,
      update_field: updateField,
      update_field_value: nextStatus,
      tracking_number: this.orderHeader.tracking_number,
      urgent: this.orderHeader.urgent,
      partial_ship: this.orderHeader.partial_ship,
    }

    this.orderService.updateOrderStatus(JSON.stringify(tempJson)).pipe(first()).subscribe(
      data => {
        this.toast.open('Status updated.', '', {
          duration: 2000,
          panelClass: ['snackBarSuccess'],
          verticalPosition: 'top',
        });

        if (updateField === 'confirmed') {
          if (nextStatus == true) {
            this.orderHeader.confirmed = nextStatus;
          } else {
            this.orderHeader.confirmed = false;
            this.orderHeader.picked = false;
            this.orderHeader.packed = false;
            this.orderHeader.shipped = false;
          }
        }
        if (updateField === 'picked') {
          if (nextStatus == true) {
            this.orderHeader.picked = nextStatus;
          } else {
            this.orderHeader.picked = false;
            this.orderHeader.packed = false;
            this.orderHeader.shipped = false;
          }
        }
        if (updateField === 'packed') {
          if (nextStatus == true) {
            this.orderHeader.packed = nextStatus;
          } else {
            this.orderHeader.packed = false;
            this.orderHeader.shipped = false;
          }
        }
        if (updateField === 'shipped') { this.orderHeader.shipped = nextStatus; }
      },
      error => {
        this.toast.open('Error, cannot update order.', '', {
          duration: 2000,
          panelClass: ['snackBarError'],
          verticalPosition: 'top',
        });
      }
    );
  }


  getOrderJson() {

    let tempPaymentDate: string;
    if (this.orderHeader.payment_status === 'ยังไม่จ่าย') {
      this.orderHeader.payment_amount = 0;
      tempPaymentDate = null;
    } else {
      this.paymentDate.setHours(+this.paymentHour, +this.paymentMinute, 0)
      tempPaymentDate = this.paymentDate.toISOString();
      console.log({ paymentTimeISO: tempPaymentDate });
    }

    const tempJson = {
      principle_id: 1,
      order_id: this.orderHeader.order_id,
      order_date: this.orderHeader.order_date,
      customer_code: this.orderHeader.customer_code,
      customer_name: this.orderHeader.customer_name,
      customer_type: this.orderHeader.customer_type,
      customer_telephone: this.orderHeader.customer_telephone,
      customer_reference: this.orderHeader.customer_reference,
      note: this.orderHeader.note,
      address_id: this.orderHeader.address_id,
      address_detail: this.orderHeader.address_detail,
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
      order_source: 'na',
      created_time: this.orderHeader.created_time,
      created_by: this.orderHeader.updated_by,
      confirmed: this.orderHeader.confirmed,
      picked: this.orderHeader.picked,
      packed: this.orderHeader.packed,
      shipped: this.orderHeader.shipped,
      confirmed_time: this.orderHeader.confirmed_time,
      picked_time: this.orderHeader.picked_time,
      packed_time: this.orderHeader.packed_time,
      shipped_time: this.orderHeader.shipped_time,
      tracking_number: this.orderHeader.tracking_number,
      urgent: this.orderHeader.urgent,
      partial_ship: this.orderHeader.partial_ship,
      updated_by: this.userId,
      items: this.orderDetails,
    };
    return tempJson;
  }

  submitOrder() {

    console.log(this.orderHeader.customer_name);
    if (this.orderHeader.customer_name === '') {
      this.doToast('กรุณาระบุ ชื่อลูกค้า', 'Warning');
    }
    if (this.orderHeader.address_detail === '') {
      this.doToast('กรุณาระบุ ที่อยู่ของลูกค้า', 'Warning');
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
    }

    const tempJson = this.getOrderJson();
    console.log({ UpdateOrder: tempJson });


    this.orderService.updateOrder(JSON.stringify(tempJson)).pipe(first()).subscribe(
      data => {
        this.toast.open('แก้ไขรายการสั่งซื้อเรียบร้อย ^_^', '', {
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
        this.toast.open('Error, cannot update order.', '', {
          duration: 2000,
          panelClass: ['snackBarError'],
          verticalPosition: 'top',
        });
      }
    );
  }
}


@Component({
  selector: 'dialog-order-detail-confirmed',
  templateUrl: 'dialog-order-detail-confirmed.html',
})
export class DialogOrderDetailConfirmed {

  constructor(
    public dialogRef: MatDialogRef<DialogOrderDetailConfirmed>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmedDialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'dialog-order-detail-tracking',
  templateUrl: 'dialog-order-detail-tracking.html',
})
export class DialogOrderDetailTracking {

  constructor(
    public dialogRef: MatDialogRef<DialogOrderDetailTracking>,
    @Inject(MAT_DIALOG_DATA) public data: ShippedDialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    console.log(this.data.trackingNumber);
    if (this.data.trackingNumber == null) {
      alert('Please enter tracking number.');
    } else {
      this.dialogRef.close(this.data.trackingNumber);
    }
  }
}
