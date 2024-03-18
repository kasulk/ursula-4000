import Link from "next/link";
import { GlowText } from "@/components";
import { Button } from "@nextui-org/react";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";

// export default function Home() {
export default async function Home() {
  console.log(await getServerSession(authOptions));

  return (
    <section id="welcome">
      <div className="flex flex-col items-center justify-center gap-12">
        <p className="text-5xl font-bold">
          Meet <GlowText variant="orange pink">Ursula</GlowText>!
        </p>
        <h3 className="mb-12 text-3xl font-bold">
          Find potentially{" "}
          <GlowText variant="secondary primary">cheap stocks</GlowText> fast and
          easy.
        </h3>
        <Link href="/allstocks">
          <Button
            radius="md"
            className="bg-gradient-to-tr from-pink-500 to-orange-500 font-bold uppercase text-white shadow-lg"
          >
            Unbelieveable!
          </Button>
        </Link>
      </div>
    </section>
  );
}
