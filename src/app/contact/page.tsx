import ContactPage from '@/components/templates/Contacts/ContactsPage'
import PageTitleBar from '@/components/ui/PageTitleBar/PageTitleBar'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EARA |  Speak with us',
  description:
    'Get in touch with EARA for inquiries, support, or to learn more about our initiatives.',
}

export default function CaseStudiesPage() {
  return (
    <>
      <PageTitleBar title="Speak with us" subtitle="contacts" />
      <main>
        <ContactPage />
      </main>
    </>
  )
}
