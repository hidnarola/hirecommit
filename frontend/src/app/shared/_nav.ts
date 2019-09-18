interface NavAttributes {
  [propName: string]: any;
}
interface NavWrapper {
  attributes: NavAttributes;
  element: string;
}
interface NavBadge {
  text: string;
  variant: string;
}
interface NavLabel {
  class?: string;
  variant: string;
}

export interface NavData {
  name?: string;
  url?: string;
  icon?: string;
  badge?: NavBadge;
  title?: boolean;
  children?: NavData[];
  variant?: string;
  attributes?: NavAttributes;
  divider?: boolean;
  class?: string;
  label?: NavLabel;
  wrapper?: NavWrapper;
}

export const admin: NavData[] = [
  {
    name: 'Manage Employer',
    url: 'employer_manage/view',
    icon: 'icon-user'
  },
  {
    name: 'Manager Candidate',
    url: 'candidate_manage',
    icon: 'icon-people',
    children: [
     {
       name: 'Approved Candidate',
       url: 'candidate_manage/approve_candidate'
     },
     {
       name: 'New Request',
       url: 'candidate_manage/new_candidate'
     }
    ]
  }
];

export const employer: NavData[] = [
  {
    name: 'Manage Offer',
    url: 'manage_offer/created_offerlist',
    icon: 'icon-grid'
  },
  {
    name: 'Manager Candidate',
    url: 'manage_candidate',
    icon: 'icon-people',
    children: [
     {
       name: 'Approved Candidate',
       url: 'manage_candidate/approve_candidate'
     },
     {
       name: 'New Request',
       url: 'manage_candidate/new_candidate'
     }
    ]
  },
  {
    name: 'Manage Sub-accounts',
    url: 'manage_subaccount/view_subaccount',
    icon: 'icon-puzzle',
  },
  {
    name: 'Manage Groups',
    url: 'manage_group/view_group',
    icon: 'icon-people',
  },
  {
    name: 'Manage Salary-Brackets',
    url: 'manage_salarybracket/view_salarybracket',
    icon: 'icon-wallet',
  },
  {
    name: 'Timeline',
    url: 'timeline',
    icon: 'icon-user'
  }
];

export const candidate: NavData[] = [
  {
    name: 'Manager Offers',
    url: 'user',
    icon: 'icon-puzzle',
    children: [
     {
       name: 'Offer List',
       url: 'offers/offerlist'
     }
    ]
  }
];
