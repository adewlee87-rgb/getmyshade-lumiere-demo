import { PageHeader } from '@/components/page-header'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { GmsDeveloperPanel } from '@/components/gms-developer-panel'

const notificationPrefs = [
  { label: 'Order updates', description: 'Shipping, delivery, and order confirmations.' },
  { label: 'New shade matches', description: 'When your AI Beauty Match finds a new match.' },
  { label: 'Restock alerts', description: 'When a wishlist item is back in stock.' },
  { label: 'Promotions', description: 'Sales, new collections, and beauty tips.' },
]

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Manage your account, notifications, and API integration."
      />

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="developer">Developer</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Personal information</CardTitle>
              <CardDescription>This is how you appear across the app.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="first-name">First name</Label>
                  <Input id="first-name" defaultValue="Sofia" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input id="last-name" defaultValue="Rivera" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="sofia.rivera@example.com" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" defaultValue="+1 (555) 010-2837" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Notification preferences</CardTitle>
              <CardDescription>Choose what you'd like to hear about.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {notificationPrefs.map((pref, i) => (
                  <label
                    key={pref.label}
                    className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <span>
                      <span className="block text-sm font-medium">{pref.label}</span>
                      <span className="block text-xs text-muted-foreground">{pref.description}</span>
                    </span>
                    <input
                      type="checkbox"
                      defaultChecked={i < 2}
                      className="size-4 accent-primary"
                    />
                  </label>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="developer">
          <div className="max-w-2xl space-y-1.5 pb-4">
            <p className="text-sm text-muted-foreground">
              This tab talks to the real{' '}
              <a
                href="https://api.getmyshade.com"
                className="text-primary hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                GetMyShade API
              </a>{' '}
              through a server-side proxy at{' '}
              <code className="font-mono text-xs">/api/gms/*</code> — your key never reaches the
              browser.
            </p>
          </div>
          <Separator className="mb-6 max-w-2xl" />
          <div className="max-w-2xl">
            <GmsDeveloperPanel />
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}
