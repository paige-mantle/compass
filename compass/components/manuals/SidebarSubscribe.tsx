"use client";

import { useEffect, useState } from "react";

export function SidebarSubscribe() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const article = document.querySelector(".manual-content");
    if (!article) return;

    function update() {
      if (!article) return;
      const rect = article.getBoundingClientRect();
      const articleHeight = article.scrollHeight;
      const scrolledPast = -rect.top;
      setVisible(scrolledPast >= articleHeight * 0.5);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      className={
        "manual-sidebar-subscribe" + (visible ? " is-visible" : "")
      }
    >
      <div className="manual-sidebar-subscribe-title">
        15k+ serious builders read this newsletter
      </div>
      <div className="manual-sidebar-subscribe-desc">
        Weekly manuals, frameworks, and field notes.
      </div>
      <form
        className="manual-sidebar-subscribe-form"
        action="https://buttondown.com/api/emails/embed-subscribe/mantle"
        method="post"
        target="popupwindow"
      >
        <input
          className="manual-sidebar-subscribe-input"
          type="email"
          name="email"
          placeholder="Enter your email"
          required
          aria-label="Email address"
        />
        <button className="manual-sidebar-subscribe-button" type="submit">
          Get on the list
        </button>
      </form>
    </div>
  );
}
