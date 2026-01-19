import { NextResponse } from "next/server";
import { readJson, writeJson, DIYA_FILE } from "@/lib/data";

type Diya = {
  count: number;
};

/* ---------- READ COUNT ---------- */
export async function GET() {
  const diya = readJson<Diya>(DIYA_FILE, { count: 0 });
  return NextResponse.json(diya);
}

/* ---------- INCREMENT COUNT ---------- */
export async function POST() {
  const diya = readJson<Diya>(DIYA_FILE, { count: 0 });
  diya.count += 1;
  writeJson(DIYA_FILE, diya);
  return NextResponse.json(diya);
}
