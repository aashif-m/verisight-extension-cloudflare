import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const ProfilePic = ({ className }: { className?: string }) => {
    return (
        <div className="grid">
            <Avatar className={className}>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
        </div>
    )
}

export default ProfilePic