
import { NextResponse } from "next/server";
import { findUserByEmail, insertUser } from "@/models/user";
import { getUuid } from "@/lib/hash";
import { getIsoTimestr, getOneYearLaterTimestr } from "@/lib/time";
import { CreditsAmount, CreditsTransType, increaseCredits } from "@/services/credit";
import { User } from "@/types/user";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const newUser: User = {
      uuid: getUuid(),
      email,
      nickname: email.split("@")[0],
      avatar_url: "",
      created_at: getIsoTimestr(),
      password: password, // Store plain text password
      signin_type: "email",
    };

    await insertUser(newUser);

    // Add initial credits
    try {
      await increaseCredits({
        user_uuid: newUser.uuid || "",
        trans_type: CreditsTransType.NewUser,
        credits: CreditsAmount.NewUserGet,
        expired_at: getOneYearLaterTimestr(),
      });
    } catch (e) {
      console.error("Failed to add initial credits:", e);
      // Continue even if credit addition fails
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
