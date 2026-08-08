import { Mail, MessageCircle, Phone, ChevronDown } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Card } from '@/components/ui/card'

const faqSections = [
  {
    category: 'Orders & Shipping',
    items: [
      {
        q: 'How long does shipping take?',
        a: 'Standard shipping arrives in 3–5 business days. Orders over $50 ship free; expedited options are available at checkout.',
      },
      {
        q: 'Can I change or cancel my order?',
        a: 'Orders can be changed or canceled within 1 hour of placing them. After that, they enter fulfillment and can no longer be modified — contact support and we\'ll do our best to help.',
      },
      {
        q: 'How do I track my order?',
        a: 'Go to Order History and select an order to see live tracking status: Processing, Shipped, or Delivered.',
      },
    ],
  },
  {
    category: 'Shades & Matching',
    items: [
      {
        q: 'How accurate is the shade match?',
        a: 'Our photo scan reports a confidence score alongside every result. For best accuracy, use even, natural lighting and a centered, unfiltered selfie.',
      },
      {
        q: 'What if my shade doesn\'t look right in person?',
        a: 'We offer free exchanges on foundation and concealer shades within 30 days — no questions asked.',
      },
    ],
  },
  {
    category: 'Returns',
    items: [
      {
        q: 'What is your return policy?',
        a: 'Unopened products can be returned within 30 days for a full refund. Opened complexion products are eligible for a one-time shade exchange.',
      },
    ],
  },
  {
    category: 'Account',
    items: [
      {
        q: 'How do I delete my account?',
        a: 'Go to Settings → Profile and scroll to Account actions, or contact support and we\'ll process it within 48 hours.',
      },
    ],
  },
]

const contactChannels = [
  { icon: MessageCircle, label: 'Live chat', detail: 'Avg. reply time: 2 minutes', cta: 'Start chat' },
  { icon: Mail, label: 'Email', detail: 'support@lumiere.example', cta: 'Send email' },
  { icon: Phone, label: 'Phone', detail: 'Mon–Fri, 9am–6pm CT', cta: '1 (800) 555-0110' },
]

export default function HelpPage() {
  return (
    <>
      <PageHeader
        eyebrow="Support"
        title="Help Center"
        description="Answers to common questions, or reach our team directly."
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          {faqSections.map((section) => (
            <div key={section.category}>
              <h2 className="mb-3 font-serif text-xl">{section.category}</h2>
              <div className="flex flex-col divide-y rounded-xl border">
                {section.items.map((item) => (
                  <details key={item.q} className="group p-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium">
                      {item.q}
                      <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Card className="h-fit gap-4 p-6">
          <h3 className="font-medium">Contact us</h3>
          <div className="flex flex-col divide-y">
            {contactChannels.map((c) => {
              const Icon = c.icon
              return (
                <div key={c.label} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">{c.label}</p>
                    <p className="text-xs text-muted-foreground">{c.detail}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </>
  )
}
