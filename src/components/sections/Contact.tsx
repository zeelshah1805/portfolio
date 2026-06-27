"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { profile } from "@/lib/data";
import Reveal, { SectionHeading } from "@/components/ui/Reveal";

interface Ripple {
  x: number;
  y: number;
  id: number;
}

export default function Contact() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const btn = e.currentTarget.querySelector("button[type=submit]") as HTMLElement;
    const rect = btn?.getBoundingClientRect();
    if (rect) {
      const id = Date.now();
      setRipples((r) => [...r, { x: rect.width / 2, y: rect.height / 2, id }]);
      setTimeout(() => setRipples((r) => r.filter((x) => x.id !== id)), 700);
    }
    setSent(true);
    setTimeout(() => setSent(false), 3500);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="section-pad relative">
      <SectionHeading
        eyebrow="// contact"
        title="Let's Build Together"
        subtitle="Have an idea, a role, or a collaboration in mind? Drop me a message."
      />

      <div className="grid gap-10 lg:grid-cols-5">
        {/* Info */}
        <Reveal direction="right" className="lg:col-span-2">
          <div className="glass h-full p-8">
            <h3 className="text-xl font-semibold text-white">Get in touch</h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">
              I&apos;m open to AI/ML roles, freelance projects, and research
              collaborations. Let&apos;s create something intelligent.
            </p>

            <div className="mt-8 space-y-3">
              <SocialLink
                href={`mailto:${profile.socials.email}`}
                label={profile.socials.email}
                icon={<MailIcon />}
              />
              <SocialLink
                href={`tel:${profile.socials.phone.replace(/\s+/g, "")}`}
                label={profile.socials.phone}
                icon={<PhoneIcon />}
              />
              <SocialLink
                href={profile.socials.github}
                label="github.com/zeelshah1805"
                icon={<GithubIcon />}
              />
              <SocialLink
                href={profile.socials.linkedin}
                label="linkedin.com/in/zeel-shah-k5"
                icon={<LinkedinIcon />}
              />
            </div>
          </div>
        </Reveal>

        {/* Form */}
        <Reveal direction="left" className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="glass space-y-5 p-8">
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Name"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                placeholder="Ada Lovelace"
              />
              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-400">
                Message
              </label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell me about your project..."
                className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-primary/50 focus:shadow-glow"
              />
            </div>

            <button
              type="submit"
              data-cursor="button"
              className="relative w-full overflow-hidden rounded-full bg-gradient-to-r from-primary to-secondary py-3.5 text-sm font-semibold text-[#04060f] shadow-glow transition-transform hover:scale-[1.01]"
            >
              {ripples.map((r) => (
                <span
                  key={r.id}
                  className="pointer-events-none absolute rounded-full bg-white/40"
                  style={{
                    left: r.x,
                    top: r.y,
                    transform: "translate(-50%, -50%)",
                    animation: "ripple 0.7s ease-out forwards",
                  }}
                />
              ))}
              <span className="relative z-10">
                {sent ? "✓ Message Sent!" : "Send Message"}
              </span>
            </button>
          </form>
        </Reveal>
      </div>

      <style jsx>{`
        @keyframes ripple {
          from {
            width: 0;
            height: 0;
            opacity: 0.6;
          }
          to {
            width: 500px;
            height: 500px;
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-400">
        {label}
      </label>
      <input
        required
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-primary/50 focus:shadow-glow"
      />
    </div>
  );
}

function SocialLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <motion.a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      data-cursor="button"
      whileHover={{ x: 4 }}
      className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-sm text-gray-300 transition-colors hover:border-primary/30 hover:text-primary"
    >
      <span className="text-primary">{icon}</span>
      {label}
    </motion.a>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 5L2 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.4 9.4 0 0 1 12 7.07c.85 0 1.71.12 2.51.34 1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.04 10.04 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" />
    </svg>
  );
}
function LinkedinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 17v-7H6v7h2.34zM7.17 8.9a1.36 1.36 0 1 0 0-2.72 1.36 1.36 0 0 0 0 2.72zM18 17v-3.86c0-2.06-1.1-3.02-2.57-3.02-1.18 0-1.71.65-2.01 1.11V10H11.1v7h2.34v-3.9c0-.21.02-.41.08-.56.16-.41.54-.84 1.17-.84.83 0 1.16.63 1.16 1.55V17H18z" />
    </svg>
  );
}
