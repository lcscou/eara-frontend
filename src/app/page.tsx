'use client'
import ButtonEara from '@/components/ui/ButtonEara/ButtonEara'
import Hero from '@/components/ui/Hero/Hero'
import Quote from '@/components/ui/Quote/Quote'
import { Container, Group, Title, Text } from '@mantine/core'
export default function Home() {
  return (
    <>
      <div className="pt-[120px]">
        <Container size="sm">
          <Quote
            variant="light"
            texto="Animals can suffer from many of the same conditions as humans, such as cancer, heart disease, epilepsy and infectious diseases."
            author="António Exemplo"
            avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          />
        </Container>
      </div>
    </>
  )
}
