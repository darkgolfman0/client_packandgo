export class DeliveryTypeMaster {
  id: number;
  principle_id: string;
  ref_id: string;
  ref_name: string;
  status: string;
  updated_by: number;
  created_time: Date;
  updated_time: Date;
}

export class ExtraPickedMaster {
  id: number;
  detail: string;
  quantity: number;
  picked_option: number;
}

export class SupplyProductMaster {
  id: number;
  detail: string;
  product_id: number;
  brand: string;
  category: string;
  variance: string;
  ean: string;
  list_price: number;
  unit_price: number;
  unit_width: number;
  unit_long: number;
  unit_height: number;
  quantity: number;
  picked_option: number;
}

export class StockAdjustmentMaster {
  id: number;
  received_date: Date;
  product_code: string;
  product_detail: string;
  batch: string;
  quantity: number;
  expiration_date: Date;
  adjust_type: string;
  note: number;
  updated_time: Date;
  created_time: Date;
}

export class StockInventory {
  id: number;
  orginizarion_id: string;
  product_code: string;
  batch: string;
  quantity_onhand: number;
  created_time: Date;
  updated_time: Date;
  updated_by: string;
  brand_id: string;
  short_description_thai: string;
  total_quantity_onhand: number;
  total_quantity_visable: number;
  batches: any[];
  product_id: string;
  holding_order: any[];
  items: any;
  // holding_order: 
}
