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
    name: 'Manager Employee',
    url: '/employer/view',
    icon: 'icon-user'

      // {
      //   name: 'Add Employee',
      //   url: '/employer/add',
      //   icon: 'icon-user-follow'
      // }

  },
  {
    name: 'Manager Candidate',
    url: '/candidate/view',
    icon: 'icon-user'
  },
  {
    name: 'Employer Summary',
    url: '/employeruser/summary',
    icon: 'icon-puzzle',
    // children: [
    //   {
    //     name: 'Summary',
    //     url: '/employeruser/summary',
    //   }
    // ]
  }
];


