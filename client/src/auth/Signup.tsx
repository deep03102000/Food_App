import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, LockKeyhole, Mail, PhoneCallIcon, User } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Link, useNavigate } from "react-router-dom"
import { ChangeEvent, FormEvent, useState } from "react"
import { SignupInputState, userSignupSchema } from "@/schema/userSchema"
import { useUserStore } from "@/store/useUserStore"

/*type SignupInputState = {
    fullname: string;
    email: string;
    password: string;
    contact: string;

}*/
const Signup = () => {

    const [input, setInput] = useState<SignupInputState>({
        fullname: "",
        email: "",
        password: "",
        contact: ""

    })
    const [error, setError] = useState<Partial<SignupInputState>>({})
    const {signup, loading} = useUserStore()
    const navigate = useNavigate()

    const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setInput({ ...input, [name]: value })
    }
    const loginSubmitHandler = async(e: FormEvent) => {
        e.preventDefault()
        //check form validation
        const result = userSignupSchema.safeParse(input)
        if (!result.success) {
            const fieldErrors = result.error.formErrors.fieldErrors
            setError(fieldErrors as Partial<SignupInputState>)
            return
        }
        // login api implimentation starts from here
         try {
            await signup(input)
            navigate("/verify-email")
         } catch (error) {
            console.log(error)
         }
        await signup(input)
    }
    return (
        <div className="flex items-center justify-center min-h-screen">
            <form onSubmit={loginSubmitHandler} className="md:p-8 w-full max-w-md md:border md:border-gray-200 rounded-lg mx-4">
                <div>
                    <h1 className="font-semibold text-2xl mb-5">Food Express</h1>
                </div>
                <div className="mb-4">
                    <div className="relative">

                        <Input
                            type="text"
                            placeholder="Full Name"
                            name="fullname"
                            value={input.fullname}
                            onChange={changeEventHandler}
                            className="pl-10 focus-visible:ring-1" />
                        <User className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                        {
                            error && <span className="text-xs text-red-500">{error.fullname}</span>
                        }

                    </div>
                </div>
                <div className="mb-4">
                    <div className="relative">

                        <Input
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={input.email}
                            onChange={changeEventHandler}
                            className="pl-10 focus-visible:ring-1" />
                        <Mail className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                        {
                            error && <span className="text-xs text-red-500">{error.email}</span>
                        }

                    </div>
                </div>

                <div className="mb-4">
                    <div className="relative">

                        <Input
                            type="password"
                            placeholder="Password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            className="pl-10 focus-visible:ring-1" />
                        <LockKeyhole className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                        {
                            error && <span className="text-xs text-red-500">{error.password}</span>
                        }
                    </div>
                </div>

                <div className="mb-4">
                    <div className="relative">

                        <Input
                            type="text"
                            placeholder="Contact"
                            name="contact"
                            value={input.contact}
                            onChange={changeEventHandler}
                            className="pl-10 focus-visible:ring-1" />
                        <PhoneCallIcon className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                        {
                            error && <span className="text-xs text-red-500">{error.contact}</span>
                        }

                    </div>
                </div>

                <div className="mb-10">
                    {
                        loading ? <Button disabled className="bg-orange hover:bg-hoverOrange w-full text-md"><Loader2 className="animate-spin w-4 h-4 mr-2" />Please wait</Button> :
                            <Button type="submit" className="bg-orange hover:bg-hoverOrange w-full text-md">Sign up</Button>
                    }

                </div>
                <Separator />
                <p className="mt-4">Already have an account?
                    <Link to="/login" className="text-blue-500 ml-1 hover:underline hover:text-blue-600">Login</Link>
                </p>



            </form>
        </div>
    )
}

export default Signup

