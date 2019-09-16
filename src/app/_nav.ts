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

export const navItems: NavData[] = [
  {
    name: 'Manage Employer',
    url: '/employer/view',
    icon: 'icon-user'
  },
  {
    name: 'Manage Candidate',
    url: '/candidate',
    icon: 'icon-people',
    children: [
      {
        name: 'Approved Candidate',
        url: '/candidate/view',
        icon: 'icon-check'
      },
      {
        name: 'New Request',
        url: '/candidate/newcandidate',
        icon: 'icon-user-follow'
      }
    ]
  },
  {
    name: 'Manage Offer',
    url: '/employeruser/summary',
    icon: 'icon-grid',
    // children: [
    //   {
    //     name: 'Summary',
    //     url: '/employeruser/summary',
    //   }
    // ]
  },

  {
    name: 'Manage Offers',
    url: '/candidateUser',
    icon: 'icon-tag',
    children: [
      {
        name: 'Offer List',
        url: '/candidateUser/offerlist',
        icon: 'icon-calendar'
      }
    ]
  },
  {
    name: 'Timeline',
    url: '/timeline',
    icon: 'icon-equalizer'
  },
  {
    name: 'Manage Sub-accounts',
    url: '/subaccounts/viewsubaccount',
    icon: 'icon-calendar',
  },
  {
    name: 'Manage Groups',
    url: '/groups/viewgroups',
    icon: 'icon-info',
  },
  {
    name: 'Manage Salary-Brackets',
    url: '/salary-brackets/viewsalarybracket',
    icon: 'icon-calendar',
  },
];
