'use client'

import ButtonEara from '@/components/ui/ButtonEara/ButtonEara'
import JoinEaraForm from '@/components/ui/JoinEaraForm/JoinEaraForm'
import MediaBankImageBlock from '@/components/ui/MediaBankImageBlock/MediaBankImageBlock'
import { ModalContent } from '@/components/ui/ModalContent/ModalContent'
import { ModalTrigger } from '@/components/ui/ModalTrigger/ModalTrigger'
import SubscribeNewsLetter from '@/components/ui/SubscribeNewsLetter/SubscribeNewsLetter'
import { BarChart, DonutChart } from '@mantine/charts'
import { Box, Button, Container, Group, Image, Text } from '@mantine/core'

export const data = [
  { month: 'January', Smartphones: 1200, Laptops: 900, Tablets: 200 },
  { month: 'February', Smartphones: 1900, Laptops: 1200, Tablets: 400 },
  { month: 'March', Smartphones: 400, Laptops: 1000, Tablets: 200 },
  { month: 'April', Smartphones: 1000, Laptops: 200, Tablets: 800 },
  { month: 'May', Smartphones: 800, Laptops: 1400, Tablets: 1200 },
  { month: 'June', Smartphones: 750, Laptops: 600, Tablets: 1000 },
]

export const data2 = [
  { name: 'Mice', value: 74.1, color: 'primaryColor.1' },
  { name: 'Rats', value: 5.2, color: 'primaryColor.2' },
  { name: 'Pigs', value: 0.4, color: 'primaryColor.3' },
  { name: 'Other birds', value: 1.9, color: 'primaryColor.4' },
  { name: 'Zebra fish', value: 8.9, color: 'primaryColor.5' },
  { name: 'Other fish', value: 3.7, color: 'primaryColor.6' },
]
export default function TestePage() {
  return (
    <div className="px-8 py-40">
      <Image
        w={300}
        h={400}
        src="http://eara.local/wp-content/uploads/eara-protected-files/featured-project.jpg"
      />
      <BarChart
        h={320}
        data={data}
        dataKey="month"
        orientation="horizontal"
        // yAxisProps={{ width: 100 }}
        // tooltipProps={{
        //   shared: false, // hover por item/barra, não por categoria inteira
        //   cursor: false, // remove o retângulo "estranho" do hover
        // }}
        // barChartProps={{
        //   barCategoryGap: '20%',
        //   barGap: 4,
        // }}
        // styles={{ tooltipBody: { padding: '10px 10px' } }}
        // barProps={{
        //   activeBar: { stroke: '#111', strokeWidth: 1 }, // destaque da barra ativa
        // }}
        series={[
          { name: 'Smartphones', color: 'violet.6' },
          { name: 'Laptops', color: 'blue.6' },
          { name: 'Tablets', color: 'teal.6' },
        ]}
      />
      <DonutChart withLabelsLine labelsType="percent" withLabels data={data2} />
      <JoinEaraForm
        title="Cadastre-se"
        description="Junte-se a nossa comunidade"
        buttonLabel="Entrar"
        submitUrl="/api/join-eara"
        renderMode="inline"
      />
      <MediaBankImageBlock
        width="400px"
        src="http://eara.local/wp-content/uploads/2025/11/19_UZH_TV_Grosstiere_Schafe_Bruederli_20226564.jpg"
      />

      <Container>
        <SubscribeNewsLetter renderMode="inline" />
      </Container>

      <Box mb="xl">
        <Text size="xl" fw={700} mb="md">
          Teste de Modal System
        </Text>
        <Text c="dimmed" mb="xl">
          Este exemplo demonstra o uso dos blocos eara/modal-trigger e eara/modal-content
        </Text>
      </Box>

      {/* Registra os modais - Estes seriam os blocos eara/modal-content */}
      <ModalContent triggerId="welcome-modal" title="Bem-vindo!" centered size="md">
        <Text mb="md">Este é um exemplo de modal simples criado com os blocos do Gutenberg.</Text>
        <Text c="dimmed">
          O conteúdo deste modal vem do bloco eara/modal-content com
          triggerId=&quot;welcome-modal&quot;
        </Text>
      </ModalContent>

      <ModalContent
        triggerId="large-modal"
        title="Modal Grande com Conteúdo Complexo"
        size="xl"
        centered={false}
      >
        <Box>
          <Text size="lg" fw={600} mb="md">
            Este é um modal maior
          </Text>
          <Text mb="md">
            Você pode adicionar qualquer conteúdo aqui, incluindo componentes complexos, imagens,
            formulários, etc.
          </Text>
          <Box bg="gray.1" p="md" style={{ borderRadius: '8px' }}>
            <Text fw={500} mb="xs">
              Exemplo de Box dentro do modal:
            </Text>
            <Text size="sm">
              O sistema de modais suporta múltiplos modais na mesma página, cada um identificado por
              seu triggerId único.
            </Text>
          </Box>
        </Box>
      </ModalContent>

      <ModalContent triggerId="fullscreen-modal" title="Modal em Tela Cheia" fullScreen>
        <Box p="xl">
          <Text size="xl" fw={700} mb="lg">
            Este modal ocupa a tela inteira
          </Text>
          <Text mb="md">
            Perfeito para conteúdo que precisa de mais espaço, como formulários longos, galerias de
            imagens, ou apresentações.
          </Text>
          <Box mt="xl">
            <Text c="dimmed" size="sm">
              Use a propriedade fullScreen=true no bloco eara/modal-content
            </Text>
          </Box>
        </Box>
      </ModalContent>

      {/* Triggers - Estes seriam os blocos eara/modal-trigger */}
      <Box mb="xl">
        <Text fw={600} mb="md">
          Exemplos de Triggers:
        </Text>

        <Group mb="md">
          <ModalTrigger triggerId="welcome-modal">
            <Button>Abrir Modal Simples</Button>
          </ModalTrigger>

          <ModalTrigger triggerId="large-modal">
            <Button variant="outline">Abrir Modal Grande</Button>
          </ModalTrigger>

          <ModalTrigger triggerId="fullscreen-modal">
            <Button variant="light">Abrir Modal Fullscreen</Button>
          </ModalTrigger>
        </Group>
      </Box>

      <Box mb="xl">
        <Text fw={600} mb="md">
          Trigger com Componente Customizado:
        </Text>

        <ModalTrigger triggerId="welcome-modal">
          <ButtonEara label="Clique Aqui (ButtonEara)" variant="filled" />
        </ModalTrigger>
      </Box>

      <Box mb="xl">
        <Text fw={600} mb="md">
          Trigger com Card/Box:
        </Text>

        <ModalTrigger triggerId="large-modal">
          <Box
            bg="blue.0"
            p="xl"
            style={{
              borderRadius: '12px',
              border: '2px solid var(--mantine-color-blue-3)',
              maxWidth: '400px',
            }}
          >
            <Text fw={600} mb="xs">
              Clique neste card inteiro
            </Text>
            <Text size="sm" c="dimmed">
              Qualquer elemento pode se tornar um trigger para abrir um modal
            </Text>
          </Box>
        </ModalTrigger>
      </Box>

      <Box mt="xl" p="xl" bg="gray.0" style={{ borderRadius: '8px' }}>
        <Text fw={600} mb="md">
          Como usar no Gutenberg:
        </Text>
        <Box component="pre" p="md" bg="white" style={{ borderRadius: '4px', overflow: 'auto' }}>
          <code>{`
1. Adicione um bloco eara/modal-content:
   - Configure o triggerId (ex: "meu-modal")
   - Configure título, tamanho, etc.
   - Adicione o conteúdo do modal dentro

2. Adicione um bloco eara/modal-trigger:
   - Configure o mesmo triggerId ("meu-modal")
   - Coloque os blocos filhos que serão clicáveis
   
3. Pronto! Ao clicar no trigger, o modal será aberto.
          `}</code>
        </Box>
      </Box>
    </div>
  )
}
