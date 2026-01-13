import DashNav from '@/components/dashboard/DashNav'
import { getServerSession } from 'next-auth'
import React from 'react'
import { authOptions, CustomnSession } from '../api/auth/[...nextauth]/options'
import CreateChat from '@/components/groupChat/CreateChat'
import { fetchChatGroups } from '@/fetch/groupFetch'
import GroupChatCard from '@/components/groupChat/GroupChatCard'

const dashboard = async () => {

    const session : CustomnSession|null = await getServerSession(authOptions)
    const groups:Array<ChatGroupType> | [] = await fetchChatGroups(session?.user?.token!);

    return (
      <div>
          <DashNav name={session?.user?.name!} image={session?.user?.image ?? undefined}/>
          <div className='flex justify-end mt-10 mx-10'>
            <CreateChat user={session?.user!}/>
          </div>

          {/* If Groups */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-10">
          {groups.length > 0 &&
            groups.map((item, index) => (
              <GroupChatCard group={item} key={index} user={session?.user!} />
            ))}
        </div>
      </div>
  )
}

export default dashboard