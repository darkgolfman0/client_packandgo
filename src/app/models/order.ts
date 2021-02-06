export class OrderHeader {
  id: number;
  principle_id: string;
  order_id: string;
  order_date: Date;
  customer_code: string;
  customer_name: string;
  customer_type: string;
  customer_telephone: string;
  address_id: number;
  address_detail: string;
  province:string;
  sub_district:string;
  district:string
  postcode: string;
  seller_id: string;
  seller_detail: string;
  delivery_fee: number;
  delivery_type: string;
  customer_reference: string;
  note: string;
  payment_status: string;
  payment_amount: number;
  payment_time: Date;
  order_source: string;
  order_amount: number;
  order_amount_without_delivery: number;
  created_time: Date;
  updated_by: string;
  updated_time: Date;
  confirmed: boolean;
  picked: boolean;
  packed: boolean;
  shipped: boolean;
  confirmed_time: Date;
  picked_time: Date;
  packed_time: Date;
  shipped_time: Date;
  tracking_number: string;
  urgent: boolean;
  partial_ship: boolean;
  extra_picked_items: number;
  package_detail: number;
  customer_order_id: string;
  items: OrderDetail[];
  selected: boolean;
}

export class OrderDetail {
  id: number;
  order_id: string;
  customer_product_code: string;
  product_code: string;
  product_detail: string;
  product_quantity: number;
  product_unit_price: number;
  product_total_price: number;
  product_unit_name: string;
  discount_for_item: number;
  created_time: Date;
  updated_time: Date;
  updated_by: number;
  stock_inventory_id: number;
  batch: string;
  batch_id: number;
}

export class saleMapping {
  seller_id: string;
  seller_name: string;
  seller_detail: string;
}
