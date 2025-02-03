import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CTA() {
  return (
    <section className="border-t">
      <div className="container flex flex-col items-center gap-4 py-24 text-center md:py-32 mx-auto">
        <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
          Ready to revolutionize your business?
        </h2>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Capture all employee details and automate payslip creation and sending while your team gets their pay information right on WhatsApp. No more paperwork, no more delays.
        </p>
        <Link href="/auth/signIn">
        <Button size="lg" className="mt-4">
          Get Started Today
        </Button>
        </Link>
      </div>
    </section>
  )
}

