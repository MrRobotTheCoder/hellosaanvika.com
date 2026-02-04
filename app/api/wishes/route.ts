import { NextResponse } from "next/server";
import { readJson, writeJson, WISHES_FILE } from "@/lib/data";

type Wish = {
  name: string;
  message: string;
  time: string;
};

/* ---------- READ WISHES ---------- */
export async function GET() {
  const wishes = readJson<Wish[]>(WISHES_FILE, []);
  return NextResponse.json(wishes);
}

/* ---------- SAVE WISH ---------- */
export async function POST(req: Request) {
  const body = await req.json();

  if (!body.name || !body.message) {
    return NextResponse.json(
      { error: "Invalid input" },
      { status: 400 }
    );
  }

  const newWish: Wish = {
    name: body.name.trim(),
    message: body.message.trim(),
    time: new Date().toISOString(),
  };

  const wishes = readJson<Wish[]>(WISHES_FILE, []);
  wishes.push(newWish);

  writeJson(WISHES_FILE, wishes);

  return NextResponse.json({ success: true });
}
