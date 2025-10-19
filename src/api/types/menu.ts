export type MenuResponse = {
  menus: Menu[];
};

export type Menu = {
  name: string;
  guid: string;
  menuGroups: MenuGroup[];
};

export type MenuGroup = {
  name: string;
};
