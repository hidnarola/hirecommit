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
    name: 'Employers',
    // name: 'Manage Employer',
    url: 'employers/view',
    icon: 'icon-user',

    children: [
      {
        name: 'Approved Employer',
        url: 'employers/approved_employer',
        icon: 'fa fa-check-square-o'
      },
      {
        name: 'New Employer',
        url: 'employers/new_employer',
        icon: 'fa fa-user-circle'
      }
    ]
  },
  {
    name: 'Candidates',
    // name: 'Manage Candidate',
    url: 'candidates',
    icon: 'icon-people',

    children: [
      {
        name: 'Approved Candidate',
        url: 'candidates/approved_candidate',
        icon: 'fa fa-check-square-o'
      },
      {
        name: 'New Candidate',
        url: 'candidates/new_candidate',
        icon: 'fa fa-user-circle'
      },
    ]
  }
];

export const employer: NavData[] = [
  {
    name: 'Offers',
    // name: 'Manage Offer',
    url: 'offers/list',
    icon: 'icon-grid'
  },
  // {
  //   name: 'Candidates',
  //   // name: 'Manage Candidate',
  //   url: 'candidates',
  //   icon: 'icon-people',
  //   children: [
  //     {
  //       name: 'Approved Candidates',
  //       url: 'candidates/approved_candidate',
  //       icon: 'fa fa-check-square-o'
  //     },
  //     {
  //       name: 'New Candidates',
  //       url: 'candidates/new_candidate',
  //       icon: 'fa fa-user-circle'
  //     }
  //   ]
  // },
  {
    name: 'Locations',
    // name: 'Manage Location',
    url: 'locations/list',
    icon: 'icon-location-pin',
  },
  {
    name: 'Sub Accounts',
    // name: 'Manage Sub-accounts',
    url: 'sub_accounts/list',
    icon: 'icon-puzzle',
  },
  {
    name: 'Groups',
    // name: 'Manage Groups',
    url: 'groups/list',
    icon: 'icon-people',
  },
  // {
  //   name: 'Salary Brackets',
  //   // name: 'Manage Salary-Brackets',
  //   url: 'salary_brackets/list',
  //   icon: 'icon-wallet',
  // },

  {
    name: 'Custom Fields',
    url: 'custom_fields',
    icon: 'icon-paper-clip'
  },
  // {
  //   name: 'Timeline',
  //   url: 'timeline',
  //   icon: 'icon-user'
  // }
];
export const sub_employer: NavData[] = [
  {
    name: 'Offer',
    // name: 'Manage Employer',
    url: 'offers/list',
    icon: 'icon-grid',
  },
  {
    name: 'Locations',
    // name: 'Manage Location',
    url: 'locations/list',
    icon: 'icon-location-pin',
  },
  {
    name: 'Sub Accounts',
    // name: 'Manage Sub-accounts',
    url: 'sub_accounts/list',
    icon: 'icon-puzzle',
  },
  {
    name: 'Groups',
    // name: 'Manage Groups',
    url: 'groups/list',
    icon: 'icon-people',
  },

  {
    name: 'Custom Fields',
    url: 'custom_fields',
    icon: 'icon-paper-clip'
  }
];

export const candidate: NavData[] = [
  {
    name: 'Offers',
    // name: 'Manager Offers',
    url: 'offers/list',
    icon: 'icon-grid',
    // children: [
    //   {
    //     name: 'Offer List',
    //     url: 'offers/list'
    //   }
    // ]
  }
];


