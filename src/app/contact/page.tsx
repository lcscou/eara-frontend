'use client'

import PageTitleBar from '@/components/ui/PageTitleBar/PageTitleBar'
import { Container, Stack, Title } from '@mantine/core'
import clsx from 'clsx'
import { useState } from 'react'

export default function ContactPage() {
  const [currentTab, setCurrentTab] = useState<
    'lisbon-office' | 'brussels-office' | 'london-office'
  >('lisbon-office')

  const map = {
    'lisbon-office':
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3112.3430043069584!2d-9.145273523553646!3d38.73289045639327!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd19339f75d60d1f%3A0x97f16feb7f271e1c!2sAv.%20Defensores%20de%20Chaves%204%2C%201000-117%20Lisboa%2C%20Portugal!5e0!3m2!1spt-BR!2sbr!4v1764247288128!5m2!1spt-BR!2sbr',
    'brussels-office':
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2512.4082631949563!2d4.357139316034782!3d50.84119297952871!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3c380c6f5b8b7%3A0x5e8f5e8f5e8f5e8f!2sLABS%20Atrium%2C%20The%20Stables%20Market%2C%20Chalk%20Farm%20Rd%2C%20London%20NW1%208AH%2C%20Reino%20Unido!5e0!3m2!1spt-BR!2sbr!4v1764247426786!5m2!1spt-BR!2sbr',
    'london-office':
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2512.4082631949563!2d4.357139316034782!3d50.84119297952871!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3c380c6f5b8b7%3A0x5e8f5e8f5e8f5e8f!2sLABS%20Atrium%2C%20The',
  }

  return (
    <>
      <PageTitleBar title="Speak with us" subtitle="contacts" />
      <Container size="xl" my={100}>
        <div className="grid grid-cols-1 gap-20 sm:grid-cols-2">
          <div>
            <iframe
              src={map[currentTab]}
              width="100%"
              height="550"
              style={{ border: 0, borderRadius: '8px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <Stack gap={10}>
            <div
              id="lisbon-office"
              className={clsx(
                'cursor-pointer rounded-xl p-8 transition-all hover:bg-white/50',
                currentTab === 'lisbon-office' && 'bg-white hover:bg-white/100'
              )}
              onClick={() => setCurrentTab('lisbon-office')}
            >
              <Title mb={15} order={5} c="primaryColor.9">
                Lisbon Office
              </Title>
              <p>
                IDEA SpacesM
                <br />
                Av. Defensores de Chaves, 4<br />
                1000-117
                <br />
                Lisboa
                <br />
                Portugal
              </p>
            </div>
            <div
              className={clsx(
                'cursor-pointer rounded-xl p-8 transition-all hover:bg-white/50',
                currentTab === 'brussels-office' && 'bg-white hover:bg-white/100'
              )}
              onClick={() => setCurrentTab('brussels-office')}
            >
              <Title mb={20} order={5} c="primaryColor.9">
                Brussels Office
              </Title>
              <p>
                3.04 LABS Atrium, The Stables Market, <br />
                Chalk Farm Rd
                <br /> London NW1 8AH <br />
                Tel: +44 (0)20 3355 3095
                <br />
                Email: info@eara.eu
              </p>
            </div>
            <div
              className={clsx(
                'cursor-pointer rounded-xl p-8 transition-all hover:bg-white/50',
                currentTab === 'london-office' && 'bg-white hover:bg-white/100'
              )}
              onClick={() => setCurrentTab('london-office')}
            >
              <Title mb={20} order={5} c="primaryColor.9">
                London Office
              </Title>
              <p>
                3.04 LABS Atrium, The Stables Market, <br />
                Chalk Farm Rd
                <br /> London NW1 8AH <br />
                Tel: +44 (0)20 3355 3095
                <br />
                Email: info@eara.eu
              </p>
            </div>
          </Stack>
        </div>
      </Container>
    </>
  )
}
