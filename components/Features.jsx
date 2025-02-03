import { Calculator, MessageCircle, UserPlus, BadgeCheck } from "lucide-react"

const features = [
  {
    name: "Instant WhatsApp Payslips",
    description: "Send professional payslips directly to your employees' WhatsApp in seconds. No more printing or emailing hassles.",
    icon: MessageCircle,
  },
  {
    name: "Easy Employee Management",
    description: "Add and manage your team members effortlessly with our intuitive dashboard. Track all essential employee information in one place.",
    icon: UserPlus,
  },
  {
    name: "Automated Calculations",
    description: "Let our system handle all payroll calculations automatically - from basic salary to deductions and bonuses.",
    icon: Calculator,
  },
  {
    name: "Compliance Ready",
    description: "Stay compliant with local labor laws and tax regulations. All payslips meet statutory requirements.",
    icon: BadgeCheck,
  },
]

export default function Features() {
  return (
    <section className="container space-y-16 py-24 md:py-32 mx-auto bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
    <div className="mx-auto max-w-[58rem] text-center">
      <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
        Simplify Your Payroll Process
      </h2>
      <p className="mt-4 text-muted-foreground sm:text-lg">
        Everything you need to manage employee payroll and send instant WhatsApp payslips.
      </p>
    </div>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
        {features.map((feature) => (
          <div key={feature.name} className="relative overflow-hidden rounded-lg border bg-background p-8">
            <div className="flex items-center gap-4">
              <feature.icon className="h-8 w-8" />
              <h3 className="font-bold">{feature.name}</h3>
            </div>
            <p className="mt-2 text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

