import Header from "@/components/Header"
import { TodoomStatus } from "@/utils/enums"
import { useRouter } from "next/router"
import storage from "@/utils/storage"
import { userGetResponse, userGroupResponse } from "@/utils/interfaces"
import TodoomForm from "@/components/TodoomForm"

export default function createTodoom() {

    const user = storage.user.load()
    const router = useRouter()
    const defaultDeadline = new Date().toISOString().split('T')[0]

    return (
        <>
            <Header />
            <TodoomForm
                todoomId={undefined}
                title={undefined}
                description={undefined}
                deadline={defaultDeadline}
                groupId={undefined}
                assigneeId={undefined}
                status={TodoomStatus.NotStarted}
                user={user as userGetResponse}
                router={router}
                context="create"
            />
        </>
    )

}