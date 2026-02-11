'use client'
import { GetPagesQuery } from '@/graphql/generated/graphql'
import { useLogout } from '@/hooks/useLogout'
import { Avatar, Box, Divider, NavLink, Stack, Tabs, Text, Title } from '@mantine/core'

import { IconFileDescription, IconLogout } from '@tabler/icons-react'
import { useEffect, useState } from 'react'

export default function MembersArea({ privatePages }: { privatePages?: GetPagesQuery }) {
  const { logout, isLoading } = useLogout()
  const [userInfo, setUserInfo] = useState({ user: { name: 'Admin' } })

  useEffect(() => {
    ;(async function () {
      try {
        const response = await fetch('/api/auth/me', { method: 'GET' })
        const data = await response.json()
        setUserInfo({ ...data })
        console.log(data)
      } catch (e) {
        console.log(e)
      }
    })()
  }, [])

  return (
    <Tabs variant="pills" radius="xl" orientation="vertical" defaultValue="home">
      <Tabs.List className="min-w-[160px]">
        <NavLink
          href="#required-for-focus"
          label={userInfo?.user.name}
          active
          variant="light"
          bdrs={30}
          leftSection={
            <Avatar alt="it's me" color="primaryColor.9">
              {userInfo?.user.name.substring(0, 2).toUpperCase()}
            </Avatar>
          }
          childrenOffset={28}
        ></NavLink>
        <NavLink
          variant="light"
          active
          leftSection={<IconLogout size={16} />}
          bdrs={30}
          href="#required-for-focus"
          label="Log out"
          onClick={logout}
          disabled={isLoading}
        />
        <Divider my="sm" />
        {/* <Tabs.Tab value="home" leftSection={<IconHome size={12} />}>
          Home
        </Tabs.Tab>
        <Tabs.Tab value="profile" leftSection={<IconUser size={12} />}>
          Profile
        </Tabs.Tab>
        <Tabs.Tab value="plan" leftSection={<IconCrown size={12} />}>
          Plan
        </Tabs.Tab>
        <Tabs.Tab value="tickets" leftSection={<IconTicket size={12} />}>
          Tickets
        </Tabs.Tab> */}
      </Tabs.List>

      <div className="ml-10 w-full rounded-2xl bg-[#eaeaea] p-10">
        <Tabs.Panel value="home">
          <Stack>
            <div>
              <Title order={4} c="primaryColor.9" fw="bold">
                Welcome to your Members Area
              </Title>
              <p className="text-earaDark/80 mt-2">
                Here you can manage your profile, view your plan, and access support tickets.
              </p>
            </div>
            <Title order={5} c="primaryColor.9" fw="bold">
              Assets
            </Title>
            <div>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {privatePages?.pages?.nodes &&
                  privatePages.pages.nodes.map((page) => (
                    <>
                      <Box
                        key={page.id}
                        component="a"
                        href={page.uri || '#'}
                        className="bg-earaBgDark flex aspect-square w-full cursor-pointer items-end rounded-2xl p-5 transition hover:bg-white"
                      >
                        <Stack>
                          <IconFileDescription size={32} className="text-primaryColor.9" />
                          <Text c="primaryColor.9" fw="bold">
                            {page.title}
                          </Text>
                        </Stack>
                      </Box>
                    </>
                  ))}
              </div>
            </div>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="profile">Profile</Tabs.Panel>

        <Tabs.Panel value="plan">Plan</Tabs.Panel>
        <Tabs.Panel value="tickets">Tickets</Tabs.Panel>
      </div>
    </Tabs>
  )
}
