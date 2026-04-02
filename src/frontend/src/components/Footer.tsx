import { Github, Heart, Twitter, Type } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  const cols = [
    { title: "Company", links: ["About Us", "Blog", "Careers", "Press Kit"] },
    {
      title: "Products",
      links: ["Font Gallery", "Type Tester", "Font Pairings", "API Access"],
    },
    {
      title: "Resources",
      links: ["Documentation", "Tutorials", "Font Licenses", "Changelog"],
    },
    {
      title: "Legal",
      links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"],
    },
  ];

  return (
    <footer
      className="mt-auto"
      style={{ borderTop: "1px solid oklch(0.22 0.025 235)" }}
    >
      <div className="max-w-[1300px] mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{
                  background: "oklch(0.68 0.15 245 / 0.2)",
                  border: "1px solid oklch(0.68 0.15 245 / 0.35)",
                }}
              >
                <Type
                  className="w-3.5 h-3.5"
                  style={{ color: "oklch(0.75 0.1 240)" }}
                />
              </div>
              <span
                className="font-semibold text-[14px]"
                style={{ color: "oklch(0.88 0.01 240)" }}
              >
                TypeFlow
              </span>
            </div>
            <p
              className="text-[13px] leading-relaxed mb-4"
              style={{ color: "oklch(0.5 0.03 235)" }}
            >
              Elegant typography discovery for designers and developers.
            </p>
            <div className="flex items-center gap-2">
              {[
                {
                  icon: <Twitter className="w-3.5 h-3.5" />,
                  label: "Twitter",
                  href: "https://twitter.com",
                },
                {
                  icon: <Github className="w-3.5 h-3.5" />,
                  label: "GitHub",
                  href: "https://github.com",
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-lg flex items-center justify-center hover:brightness-125 transition-all"
                  style={{
                    background: "oklch(0.22 0.025 235)",
                    border: "1px solid oklch(0.28 0.03 235)",
                    color: "oklch(0.55 0.03 235)",
                  }}
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4
                className="text-[12px] font-semibold uppercase tracking-wider mb-3"
                style={{ color: "oklch(0.5 0.03 235)" }}
              >
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="/"
                      className="text-[13px] hover:brightness-125 transition-all"
                      style={{ color: "oklch(0.6 0.03 235)" }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6"
          style={{ borderTop: "1px solid oklch(0.2 0.02 235)" }}
        >
          <p className="text-[12px]" style={{ color: "oklch(0.45 0.03 235)" }}>
            &copy; {year} TypeFlow. All rights reserved.
          </p>
          <p
            className="text-[12px] flex items-center gap-1"
            style={{ color: "oklch(0.45 0.03 235)" }}
          >
            Built with{" "}
            <Heart
              className="w-3 h-3 inline"
              style={{
                color: "oklch(0.65 0.22 15)",
                fill: "oklch(0.65 0.22 15)",
              }}
            />{" "}
            using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:brightness-125 transition-all"
              style={{ color: "oklch(0.65 0.1 240)" }}
            >
              caffeine.ai
            </a>
          </p>
          <p
            className="text-[12px] italic"
            style={{ color: "oklch(0.38 0.03 235)" }}
          >
            Elegant Typography
          </p>
        </div>
      </div>
    </footer>
  );
}
