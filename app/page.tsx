import Link from "next/link";
import { brand } from "@/config/brand";
import { Container } from "@/components/Container";

export default function Startseite() {
  return (
    <Container className="py-24">
      <h1 className="text-6xl font-extrabold">{brand.name}</h1>
      <p className="mt-4 text-muted">{brand.hinweisInoffiziell}</p>
      <Link href="/interview" className="mt-8 inline-block text-accent">Interview starten</Link>
    </Container>
  );
}
