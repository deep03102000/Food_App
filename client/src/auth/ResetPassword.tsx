import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, LockKeyhole} from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState<string>("")
    const loading = false

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
        <form className="flex flex-col gap-5 md:border md:p-8 w-full max-w-md rounded-lg mx-4">
            <div className="text-center">
                <h1 className="font-extrabold text-2xl mb-2">Reset Password</h1>
                <p className="text-sm text-gray-500 mb-3">Enter your new password</p>
                <div className="relative w-full mb-3">
                    <Input
                    type="password"
                    value={newPassword}
                    onChange={(e)=>setNewPassword(e.target.value)}
                    className="pl-10"
                    placeholder="Enter your new password"/>
                    <LockKeyhole className="absolute inset-y-2 left-2 pointer-events-none text-gray-600"/>
                    
                </div>
                {
                    loading ? (
                        <Button disabled className="bg-hoverOrange hover:bg-orange text-slate-100 w-full"><Loader2 className="mr-2 h-4 w-4 animate-spin "/>Please wait</Button>
                    ): (
                        <Button type="submit" className="bg-orange hover:bg-hoverOrange w-full text-sm">Reset</Button>
                    )
                }
                <div className="mt-2">
                <span className="text-sm">Back to {" "}
                    <Link to='/login' className="text-blue-500 hover:text-blue-600 hover:underline">Login</Link>
                </span>
                </div>

            </div>
        </form>
    </div>
  )
}

export default ResetPassword