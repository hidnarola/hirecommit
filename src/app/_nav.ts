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
    name: 'Manage Employee',
    url: '/employer/view',
    icon: 'icon-user'
  },
  {
    name: 'Manager Candidate',
    url: '/candidate',
    icon: 'icon-puzzle',
    children: [
     {
       name: 'Approved Candidate',
       url: '/candidate/view'
     },
     {
       name: 'New Request',
       url: '/candidate/newcandidate'
     }
    ]
  },
  {
    name: 'Manager Offers',
    url: '/candidateUser',
    icon: 'icon-puzzle',
    children: [
     {
       name: 'Offer List',
       url: '/candidateUser/offerlist'
     }
    ]
  }
];
