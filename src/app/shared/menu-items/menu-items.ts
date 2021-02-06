import { Injectable } from '@angular/core';

export interface BadgeItem {
  type: string;
  value: string;
}
export interface Saperator {
  name: string;
  type?: string;
}
export interface ChildrenItems {
  state: string;
  name: string;
  type?: string;
}

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  badge?: BadgeItem[];
  saperator?: Saperator[];
  children?: ChildrenItems[];
}

const MENUITEMS = [
  {
    state: 'dashboards',
    name: 'Dashboard',
    type: 'link',
    icon: 'dashboard'
  },
  {
    state: 'olist',
    name: 'Orders',
    type: 'link',
    icon: 'library_books'
    // icon: 'bubble_chart'
  },
  {
    state: 'clist',
    name: 'Customers',
    type: 'link',
    icon: 'person'
  },
  {
    state: 'tracking',
    name: 'Tracking',
    type: 'link',
    icon: 'gps_fixed'
  },
  {
    state: 'payment',
    name: 'Payment',
    type: 'sub',
    icon: 'attach_money',
    children: [
      { state: 'paymenttran', name: 'Payment Transaction', type: 'link' },
      { state: 'paymentsum', name: 'Payment Summary', type: 'link' }
    ]
  },
  {
    state: 'report',
    name: 'Reports',
    type: 'sub',
    icon: 'assessment',
    children: [
      { state: 'summarysalereport', name: 'Summary Sale Report', type: 'link' },
      { state: 'mdetailreport', name: 'Monthly Deltail Report', type: 'link' },
      { state: 'logisticreport', name: 'Logistic Report', type: 'link' },
      { state: 'ilist', name: 'Inventory', type: 'link' }
    ]
  },
  {
    state: 'changpassword',
    name: 'Chang Password',
    type: 'link',
    icon: 'gps_fixed'
  },
  {
    state: 'logout',
    name: 'Logout',
    type: 'link',
    icon: 'power_settings_new'
  },
  //   {
  //     state: 'material',
  //     name: 'Material Ui',
  //     type: 'sub',
  //     icon: 'bubble_chart',
  //     badge: [{ type: 'red', value: '17' }],
  //     children: [
  //       { state: 'button', name: 'Buttons' },
  //       { state: 'cards', name: 'Cards' },
  //       { state: 'grid', name: 'Grid List' },
  //       { state: 'lists', name: 'Lists' },
  //       { state: 'menu', name: 'Menu' },
  //       { state: 'tabs', name: 'Tabs' },
  //       { state: 'stepper', name: 'Stepper' },
  //       { state: 'expansion', name: 'Expansion Panel' },
  //       { state: 'chips', name: 'Chips' },
  //       { state: 'toolbar', name: 'Toolbar' },
  //       { state: 'progress-snipper', name: 'Progress snipper' },
  //       { state: 'progress', name: 'Progress Bar' },
  //       { state: 'dialog', name: 'Dialog' },
  //       { state: 'tooltip', name: 'Tooltip' },
  //       { state: 'snackbar', name: 'Snackbar' },
  //       { state: 'slider', name: 'Slider' },
  //       { state: 'slide-toggle', name: 'Slide Toggle' }
  //     ]
  //   }
];

@Injectable()
export class MenuItems {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
  addMenuitem(item) {
    MENUITEMS.push(item);
  }
  clear() {
    MENUITEMS.splice(0, MENUITEMS.length);
  }
}
