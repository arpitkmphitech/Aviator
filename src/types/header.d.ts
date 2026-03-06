export type NavLink = { label: string; href: string; disabled?: boolean };

export type HeaderNavProps = {
  links: NavLink[];
  pathname: string;
  className?: string;
};

export type MobileMenuSheetProps = {
  pathname: string;
  links: NavLink[];
  children: React.ReactNode;
};
