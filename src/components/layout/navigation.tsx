"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flower2, Heart, MoreHorizontal, X, Sprout } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { navigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";
export function Logo() {
  return (
    <Link href="/" className="brand" aria-label="Deutsch Garden ana sayfa">
      <span className="brand-icon">
        <Flower2 size={27} />
      </span>
      <span>
        Deutsch
        <span className="brand-second">
          Garden<span className="brand-dot">✦</span>
        </span>
      </span>
    </Link>
  );
}
function NavItem({
  item,
  onClick,
}: {
  item: (typeof navigation)[number];
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const Icon = item.icon;
  return (
    <Link
      onClick={onClick}
      href={item.href}
      aria-current={pathname === item.href ? "page" : undefined}
      className={cn("nav-item", pathname === item.href && "active")}
    >
      <Icon size={20} />
      <span>{item.title}</span>
      {pathname === item.href && <span className="active-dot" />}
    </Link>
  );
}
export function Sidebar() {
  return (
    <aside className="sidebar">
      <Logo />
      <div className="sidebar-caption">KÜÇÜK ADIMLAR, BÜYÜK KEŞİFLER</div>
      <nav aria-label="Ana gezinme">
        {navigation.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}
      </nav>
      <div className="sidebar-note">
        <span className="note-sprout">
          <Sprout size={30} />
        </span>
        <strong>
          Her gün biraz Almanca,
          <br />
          her gün yeni bir çiçek.
        </strong>
        <p>Senin hızın, senin bahçen.</p>
        <span aria-hidden="true" className="note-flower">
          ✿
        </span>
      </div>
      <div className="made-with">
        <Heart size={12} /> Senin için sevgiyle hazırlandı.
      </div>
    </aside>
  );
}
export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    if (open) dialog.current?.showModal();
    else dialog.current?.close();
  }, [open]);
  function close() {
    setOpen(false);
    trigger.current?.focus();
  }
  return (
    <>
      <nav className="mobile-nav" aria-label="Mobil gezinme">
        {navigation.slice(0, 4).map((item) => (
          <NavItem key={item.href} item={item} />
        ))}
        <button
          ref={trigger}
          className={cn(
            "nav-item",
            navigation.slice(4).some((item) => item.href === pathname) &&
              "active",
          )}
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-haspopup="dialog"
        >
          <MoreHorizontal size={22} />
          <span>Diğer</span>
        </button>
      </nav>
      <dialog
        aria-labelledby="mobile-menu-title"
        ref={dialog}
        className="nav-dialog"
        onCancel={close}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className="dialog-heading">
          <h2 id="mobile-menu-title">Bahçeyi keşfet</h2>
          <button
            className="icon-button"
            onClick={close}
            aria-label="Menüyü kapat"
          >
            <X />
          </button>
        </div>
        <nav aria-label="Tüm bölümler">
          {navigation.map((item) => (
            <NavItem key={item.href} item={item} onClick={close} />
          ))}
        </nav>
      </dialog>
    </>
  );
}
