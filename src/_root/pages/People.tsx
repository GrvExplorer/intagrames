import UserCards from "@/components/shared/UserCards/UserCards"
import { useGetAllUsers } from "@/lib/react-query/queriesAndMutations"
import { Loader } from "lucide-react"

function People() {

  const {data:users, isLoading:gettingUsers} = useGetAllUsers()

  return (
<>
<h1 className="text-3xl font-bold mb-10">People Feed</h1>
    {
gettingUsers ? <Loader className="mr-2 h-10 w-10 animate-spin" /> : <>
<UserCards users={users} />
</>

    }
</>
    )
}

export default People