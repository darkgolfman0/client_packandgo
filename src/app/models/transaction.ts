export class LogisticRecord {
  id: number;
  organization_id: string;
  recorded_date: Date;
  delivery_method_id: string;
  delivery_method: string;
  amount: number;
  note: string;
  updated_time: Date;
  created_time: Date;
  updated_by: string;
}

export class Workorder {
    id: number;
    organization_id: string;
    workorder_date: Date;
    name: string;
    printed: number;
    completed_time: Date;
    updated_time: Date;
    created_time: Date;
    updated_by: string;
  }
  