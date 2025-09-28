import { MdGroupAdd } from 'react-icons/md';
import { BsArrowRightCircle } from 'react-icons/bs';

export const userInfo = [
  {
    icon: <MdGroupAdd />,
    module: 'User Settings',
    link: '#',
    subModule: [
      {
        icon: <BsArrowRightCircle />,
        subModuleName: 'Reset Password',
        link: '/admin/user-settings/reset-password',
        innerSubModule: [],
      },
      {
        icon: <BsArrowRightCircle />,
        subModuleName: 'Set New Password',
        link: '/admin/user-settings/new-password',
        innerSubModule: [],
      },
      {
        icon: <BsArrowRightCircle />,
        subModuleName: 'User Info',
        link: '/admin/user-settings/user-info',
        innerSubModule: [],
      },
    ],
  },
];
