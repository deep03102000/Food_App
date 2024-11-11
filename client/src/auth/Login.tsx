import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, LockKeyhole, Mail } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Link, useNavigate } from "react-router-dom"
import { ChangeEvent, FormEvent, useState } from "react"
import { LoginInputState, userLoginSchema } from "@/schema/userSchema"
import { useUserStore } from "@/store/useUserStore"

/*type LoginInputState = {
    email: string;
    password: string;
}*/
const Login = () => {

    const [input, setInput] = useState<LoginInputState>({
        email: "",
        password: "",

    })
    const [errors, setErrors] = useState<Partial<LoginInputState>>({})
    const {login, loading} = useUserStore()
    const navigate = useNavigate()
    const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setInput({ ...input, [name]: value })
    }
    const loginSubmitHandler = async (e: FormEvent) => {
        e.preventDefault()
        //check validation
        const result = userLoginSchema.safeParse(input)
        if(!result.success){
            const fieldErrors = result.error.formErrors.fieldErrors
            setErrors(fieldErrors as Partial<LoginInputState>)
            return

        }
        
        await login(input)
        try {
            navigate("/")
        } catch (error) {
            console.log(error)
        }
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
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={input.email}
                            onChange={changeEventHandler}
                            className="pl-10 focus-visible:ring-1" />
                        <Mail className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                        {
                            errors && <span className="text-xs text-red-500">{errors.email}</span>
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
                            errors && <span className="text-xs text-red-500">{errors.password}</span>
                        }
                    </div>
                </div>

                <div className="mb-4">
                    {
                        loading ? <Button disabled className="bg-orange hover:bg-hoverOrange w-full text-md"><Loader2 className="animate-spin w-4 h-4 mr-2" />Please wait</Button> :
                            <Button type="submit" className="bg-orange hover:bg-hoverOrange w-full text-md">Login</Button>
                    }

                </div>
                <div className="mb-3 text-blue-500 text-sm hover:text-blue-700 hover:underline">
                <Link to='/forgot-password'>Forgot Password</Link>
                
                </div>
                <Separator />
                <p className="mt-4">Don't have and account?
                    <Link to="/signup" className="text-blue-500 ml-2 hover:text-blue-700">Sign Up</Link>
                </p>



            </form>
        </div>
    )
}

export default Login

