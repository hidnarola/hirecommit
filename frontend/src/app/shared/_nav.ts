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
        url: 'employers/approved_employer'
      },
      {
        name: 'New Employer',
        url: 'employers/new_employer'
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
        url: 'candidates/approved_candidate'
      },
      {
        name: 'New Candidate',
        url: 'candidates/new_candidate'
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
    name: 'Sub accounts',
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
    name: 'Locations',
    // name: 'Manage Location',
    url: 'locations/list',
    icon: 'icon-location-pin',
  },
  {
    name: 'Custom Field',
    url: 'custom_fields',
    icon: 'icon-paper-clip'
  }
  // {
  //   name: 'Timeline',
  //   url: 'timeline',
  //   icon: 'icon-user'
  // }
];

export const candidate: NavData[] = [
  {
    name: 'Offers',
    // name: 'Manager Offers',
    url: 'user',
    icon: 'icon-puzzle',
    children: [
      {
        name: 'Offer List',
        url: 'offers/list'
      }
    ]
  }
];
