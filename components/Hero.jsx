import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"


export default function Hero() {
  return (
    <section className="container flex min-h-[calc(100vh-3.5rem)] max-w-screen-2xl flex-col items-center justify-center space-y-8 py-24 text-center md:py-32 mx-auto">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-gray-900">
            Payroll Made Simple WhatsApp
          <br />
           Payslips in One Click
        </h1>
        <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
        From adding new team members to sending instant WhatsApp payslips, our simple platform handles it all. Save time, reduce errors, and keep your team happy.
        </p>
      </div>
      <div className="flex gap-4">
        <Link href="/auth/signIn">
        <Button size="lg">
          Explore
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        </Link>
        <Link href="/auth/signIn">
        <Button variant="outline" size="lg">
          Get Started
        </Button>
        </Link>
      </div>
      <div className="relative w-10/12 aspect-video">
        <iframe
          src="https://demo.arcade.software/tZK3KpqHjTGGsb1tj3eC?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true"
          title="Add an Employee to Your Team for Enhanced Productivity"
          frameBorder="0"
          loading="lazy"
          webkitallowfullscreen="true"
          mozallowfullscreen="true"
          allowFullScreen={true}
          allow="clipboard-write"
          style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', colorScheme: 'light' }}
        />
      </div>
    </section>
  )
}