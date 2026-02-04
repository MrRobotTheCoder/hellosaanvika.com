"use client";

import { useEffect, useState } from "react";

/* ---------------- CONFETTI ---------------- */
function Confetti({ big = false }: { big?: boolean }) {
  const count = big ? 120 : 40;
  const colors = ["#f94144", "#f3722c", "#f9c74f", "#90be6d", "#577590"];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 1,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${Math.random() * 100}%`,
            top: "-10%",
            width: 10,
            height: 10,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            animation: `fall ${big ? 4 : 8}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}

      <style>{`
        @keyframes fall {
          from { transform: translateY(0) rotate(0deg); }
          to { transform: translateY(110vh) rotate(720deg); }
        }
      `}</style>
    </div>
  );
}

/* ---------------- TIMER ---------------- */
function RollingDigit({ value }: { value: number }) {
  return (
    <div
      style={{
        height: 48,
        width: 32,
        overflow: "hidden",
        background: "#111",
        color: "#fff",
        borderRadius: 6,
        fontSize: "1.5rem",
        fontWeight: "bold",
        textAlign: "center",
      }}
    >
      <div
        style={{
          transform: `translateY(-${value * 48}px)`,
          transition: "transform 0.6s ease-in-out",
        }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} style={{ height: 48, lineHeight: "48px" }}>
            {i}
          </div>
        ))}
      </div>
    </div>
  );
}

function TimeBlock({ value }: { value: number }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      <RollingDigit value={Math.floor(value / 10)} />
      <RollingDigit value={value % 10} />
    </div>
  );
}

/* ================= PAGE ================= */
export default function Home() {
  const birthdayStart = new Date("2026-01-04T00:00:00+05:30").getTime();
  const birthdayEnd = new Date("2026-01-04T23:59:59+05:30").getTime();

  const [now, setNow] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [burst, setBurst] = useState(false);
  const [showBlessing, setShowBlessing] = useState(false);

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [wishes, setWishes] = useState<any[]>([]);
  const [showWishes, setShowWishes] = useState(false);
  const [diyaCount, setDiyaCount] = useState(0);

  /* Init */
  useEffect(() => {
    setMounted(true);
    setNow(Date.now());

    fetch("/api/wishes").then(r => r.json()).then(setWishes);
    fetch("/api/diya").then(r => r.json()).then(d => setDiyaCount(d.count));
  }, []);

  /* Clock */
  useEffect(() => {
    if (!mounted) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [mounted]);

  /* Confetti burst every 45s */
  useEffect(() => {
    const i = setInterval(() => {
      setBurst(true);
      setTimeout(() => setBurst(false), 4000);
    }, 45000);
    return () => clearInterval(i);
  }, []);

  if (!mounted) return null;

  const isBefore = now < birthdayStart;
  const isDuring = now >= birthdayStart && now <= birthdayEnd;
  const isAfter = now > birthdayEnd;

  const diff = birthdayStart - now;
  const hours = Math.max(Math.floor(diff / (1000 * 60 * 60)), 0);
  const minutes = Math.max(Math.floor((diff / (1000 * 60)) % 60), 0);
  const seconds = Math.max(Math.floor((diff / 1000) % 60), 0);

  const addWish = async () => {
    if (!name || !message) return;
    await fetch("/api/wishes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message }),
    });
    setName("");
    setMessage("");
    setWishes(await (await fetch("/api/wishes")).json());
  };

  const lightDiya = async () => {
    setShowBlessing(true);
    setTimeout(() => setShowBlessing(false), 3000);
    const res = await fetch("/api/diya", { method: "POST" });
    const data = await res.json();
    setDiyaCount(data.count);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fff1f6, #fef6ff)",
        position: "relative",
      }}
    >
      <Confetti />
      {(isDuring || burst) && <Confetti big />}

      {showBlessing && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "3rem",
            zIndex: 20,
          }}
        >
          ✨🪔✨
        </div>
      )}

      <main
        style={{
          position: "relative",
          zIndex: 10,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          textAlign: "center",
          color: "#111",
        }}
      >
        {isBefore && (
          <>
            <h1>🎀 Saanvika turns <strong>ONE</strong> in… 🎀</h1>
            <div style={{ display: "flex", gap: 10 }}>
              <TimeBlock value={hours} /> :
              <TimeBlock value={minutes} /> :
              <TimeBlock value={seconds} />
            </div>
          </>
        )}

        {isDuring && (
          <>
            <h1>🎉 Happy 1st Birthday, Saanvika! 🎂</h1>
            <p>One year of love, laughter, and tiny miracles ✨</p>
          </>
        )}

        {isAfter && (
          <>
            <h1>🌙 A perfect birthday comes to an end…</h1>
            <p>Thank you for all the love and blessings 💖</p>
          </>
        )}

        <section
          style={{
            marginTop: 40,
            width: "100%",
            maxWidth: 420,
            background: "#ffffffee",
            padding: 20,
            borderRadius: 14,
          }}
        >
          <h3 style={{ color: "#111" }}>💌 Leave a Birthday Wish</h3>
          <p style={{ color: "#444" }}>
            Messages filled with love for Saanvika 💕
          </p>

          <input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              marginTop: 10,
              borderRadius: 8,
              border: "1px solid #ccc",
              color: "#111",
            }}
          />

          <textarea
            placeholder="Your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              marginTop: 10,
              borderRadius: 8,
              border: "1px solid #ccc",
              color: "#111",
            }}
          />

          <button
            onClick={addWish}
            style={{
              marginTop: 12,
              padding: "10px 18px",
              borderRadius: 10,
              border: "none",
              backgroundColor: "#f5c4d8",
              cursor: "pointer",
            }}
          >
            Send Wish 💖
          </button>

          <button
            onClick={lightDiya}
            style={{
              marginTop: 10,
              background: "none",
              border: "none",
              color: "#b45309",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            🪔 Light a Diya ({diyaCount})
          </button>

          {wishes.length > 0 && (
            <>
              <button
                onClick={() => setShowWishes(!showWishes)}
                style={{
                  marginTop: 14,
                  background: "none",
                  border: "none",
                  color: "#444",
                  cursor: "pointer",
                }}
              >
                {showWishes ? "Hide Wishes ▲" : "See Wishes ▼"}
              </button>

              {showWishes && (
                <div
                  style={{
                    marginTop: 14,
                    textAlign: "left",
                    maxHeight: 260,
                    overflowY: "auto",
                  }}
                >
                  {wishes.map((w, i) => (
                    <div
                      key={i}
                      style={{
                        marginBottom: 12,
                        paddingBottom: 8,
                        borderBottom: "1px dashed #eee",
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>{w.name}</div>
                      <div style={{ color: "#333", fontSize: 14 }}>
                        {w.message}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
