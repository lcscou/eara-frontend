import { Container } from '@mantine/core'
import { Metadata } from 'next'

import ButtonEara from '@/components/ui/ButtonEara/ButtonEara'

export const metadata: Metadata = {
  title: 'EARA | Not Found',
  description: 'The requested resource could not be found.',
}

const cards = [
  {
    title: 'Members and partners',
    description:
      'We bring organisations together to support responsible biomedical research. This section is designed for members and partners. It introduces EARA’s mission and values, and provides access to resources and opportunities to collaborate and engage.',
    links: [
      { label: 'What is EARA?', href: '/about-eara/who-we-are' },
      { label: 'Open second', href: '/members' },
    ],
  },
  {
    title: 'Policymakers and NGOs',
    description:
      'Animal research in Europe is subject to the most stringent animal-related legislation and ethical oversight. Explore scientific evidence, legal frameworks, and policy context.',
    links: [
      { label: 'What is EARA’s work on policy?', href: '/eara-work-on-policy' },
      {
        label: 'How is policy already protecting animals in research?',
        href: '/any-alternatives/what-are-the-3rs',
      },
      {
        label: 'Are alternatives ready to replace animal research?',
        href: '/any-alternatives/nams',
      },
    ],
  },
  {
    title: 'Researchers and healthcare professionals',
    description:
      'Biomedical research underpins medical progress. How to communicate responsible practices and clinical impact of animal research?',
    links: [
      {
        label: 'Explain why your field of research needs animals',
        href: '/diseases',
      },
      {
        label: 'Explain why basic research needs animals to advance',
        href: '/diseases/basicresearch',
      },
      { label: 'Come to our events', href: '/events' },
    ],
  },
  {
    title: 'Students and educators ',
    description:
      'Animal research plays a central role in modern medicine. Explore resources on why animals are used in research and how this work is regulated and safeguarded. ',
    links: [
      { label: 'Why are animals needed?', href: '/why-animals-are-needed' },
      {
        label: 'Which alternatives are being used?',
        href: '/any-alternatives/nams',
      },
    ],
  },
  {
    title: 'Media, journalists and communicators',
    description:
      'Accurate reporting depends on clear, reliable information. We provide quick access to verified facts and science-based context on animal research. ',
    links: [
      { label: 'What is EARA?', href: '/about-eara/who-we-are' },
      { label: 'Who are our members?', href: '/members' },
    ],
  },
  {
    title: 'Patients and patient advocates',
    description:
      'Biomedical research is ultimately about improving lives. This section focuses on real-world impact for patients and communities.',
    links: [
      {
        label: 'Why is my condition being researched with animals?',
        href: '/diseases',
      },
      {
        label: 'Why do animals need to be used?',
        href: '/why-animals-are-needed',
      },
    ],
  },
]

export default function NotFound() {
  return (
    <div className="pt-30 pb-27.5">
      <div className="my-auto flex flex-col items-center justify-center gap-4">
        <div className="flex flex-col items-center gap-2 py-10">
          <h2 className="text-primaryColor text-5xl font-bold">Not Found</h2>
          <small>Could not find requested resource.</small>
          <p>Please check the URL, return to the homepage or explore other sections.</p>
          <ButtonEara className="mt-5" link="/">
            Back to HOME
          </ButtonEara>
        </div>
        <Container size="xl">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <div key={card.title} className="flex flex-col gap-2 rounded-xl bg-white p-8">
                <h3 className="text-primaryColor text-2xl font-semibold">{card.title}</h3>
                <p className="text-[.9rem]">{card.description}</p>
                <div className="flex flex-col justify-start gap-2">
                  {card.links.map((link) => (
                    <ButtonEara
                      key={link.label}
                      variant="link"
                      link={link.href}
                      className="cursor-pointer text-left text-[.9rem]"
                    >
                      {link.label}
                    </ButtonEara>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </div>
  )
}
