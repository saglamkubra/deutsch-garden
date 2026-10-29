import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { homeShortcuts } from "@/lib/home-demo";
import { Reveal } from "@/components/garden/animated";
export function QuickAccess() {
  return (
    <section aria-labelledby="shortcuts-title">
      <div className="adventure-section-heading">
        <div>
          <p className="eyebrow">MERAKIN SANA YOL GÖSTERSİN</p>
          <h2 id="shortcuts-title">Hangi patikadan gidelim?</h2>
        </div>
        <span className="path-flower" aria-hidden="true">
          ✿
        </span>
      </div>
      <div className="adventure-shortcuts">
        {homeShortcuts.map((item) => {
          const Icon = item.icon;
          return (
            <Reveal key={item.href}>
              <Link
                href={item.href}
                className={`adventure-shortcut tone-${item.tone}`}
              >
                <div className="shortcut-icon">
                  <Icon size={25} />
                </div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <span>
                    {item.future
                      ? "Yakında · Taslağa göz at"
                      : "Hemen keşfet"}
                  </span>
                </div>
                <ArrowUpRight size={18} />
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
