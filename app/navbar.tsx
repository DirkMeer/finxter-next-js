import React from 'react';
import Link from 'next/link';

interface NavItemProps {
  href: string;
  children: React.ReactNode;
}

const NavItem = ({ href, children }: NavItemProps) => (
  <li className="mx-4">
    <Link href={href} className="hover:text-gray-300">
      {children}
    </Link>
  </li>
);

const Navbar = () => {
  return (
    <nav className="bg-emerald-700 text-white p-4">
      <ul className="flex justify-between items-center">
        <NavItem href="/">Home</NavItem>
        <NavItem href="/blockbuster_chat">Blockbuster Chat V1</NavItem>
        <NavItem href="/blockbuster_chat_2">Blockbuster Chat V2</NavItem>
        <NavItem href="/blockbuster_chat_3">Blockbuster Chat V3</NavItem>
      </ul>
    </nav>
  );
}

export default Navbar