'use client'
import { useLogout } from '@/hooks/useLogout'
import { Avatar, Divider, NavLink, Stack, Tabs, Text, Title } from '@mantine/core'
import {
  IconBook2,
  IconCrown,
  IconFileDescription,
  IconHome,
  IconLogout,
  IconPhoto,
  IconTicket,
  IconUser,
} from '@tabler/icons-react'

export default function MembersArea() {
  const { logout, isLoading } = useLogout()
  return (
    <Tabs variant="pills" radius="xl" orientation="vertical" defaultValue="home">
      <Tabs.List className="min-w-[160px]">
        <NavLink
          href="#required-for-focus"
          label="Lucas"
          active
          variant="light"
          bdrs={30}
          leftSection={
            <Avatar alt="it's me" color="primaryColor.9">
              LC
            </Avatar>
          }
          childrenOffset={28}
        >
          <NavLink
            variant="subtle"
            active
            leftSection={<IconLogout size={16} />}
            bdrs={30}
            href="#required-for-focus"
            label="Log out"
            onClick={logout}
            disabled={isLoading}
          />
        </NavLink>
        <Divider my="sm" />
        <Tabs.Tab value="home" leftSection={<IconHome size={12} />}>
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
        </Tabs.Tab>
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
              <div className="grid grid-cols-5 gap-4">
                <div className="bg-earaBgDark flex aspect-square w-full cursor-pointer items-end rounded-2xl p-5 transition hover:bg-white">
                  <Stack>
                    <IconFileDescription size={32} className="text-primaryColor.9" />
                    <Text c="primaryColor.9" fw="bold">
                      Policy briefings
                    </Text>
                  </Stack>
                </div>
                <div className="bg-earaBgDark flex aspect-square w-full cursor-pointer items-end rounded-2xl p-5 transition hover:bg-white">
                  <Stack>
                    <IconBook2 size={32} className="text-primaryColor.9" />
                    <Text c="primaryColor.9" fw="bold">
                      Comms handbook
                    </Text>
                  </Stack>
                </div>
                <div className="bg-earaBgDark flex aspect-square w-full cursor-pointer items-end rounded-2xl p-5 transition hover:bg-white">
                  <Stack>
                    <IconPhoto size={32} className="text-primaryColor.9" />
                    <Text c="primaryColor.9" fw="bold">
                      Resources
                    </Text>
                  </Stack>
                </div>
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
