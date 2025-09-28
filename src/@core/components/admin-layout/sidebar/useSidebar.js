import React, { useState } from 'react';
import { fashionAndLifestyleModule } from './sidebar-item/fashion-and-lifestyle';
const useSidebar = () => {
  const [sidebarItems, setSideBarItems] = useState([
    ...fashionAndLifestyleModule,
    //...userInfo,
  ]);

  return { sidebarItems };
};

export default useSidebar;
