export class Customer {
  id: number;
  customer_code: string;
  customer_name: string;
  customer_type: string;
  active_time: Date;
  created_time: Date;
  updated_time: Date;
  updated_by: string;
  address: string;
  postcode: string;
  telephone: string;
  ref_data: string;
  note: string;
  address_id: number;
  addresses: CustomerDetail[];
}

export class CustomerDetail {
  id: number;
  customer_code: string;
  address: string;
  postcode: string;
  telephone: string;
  ref_data: string;
  note: string;
  active: number;
  province: string;
  sub_district: string;
  district: string
}
