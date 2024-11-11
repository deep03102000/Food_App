import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUserStore } from "@/store/useUserStore"
import { Loader2 } from "lucide-react"
import React, { FormEvent, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

const VerifyEmail = () => {

    const [otp, setOtp] = useState<string[]>(["","","","","",""])
    const inputRef = useRef<any>([])
    const navigate = useNavigate()

    
    const {loading, verifyEmail} = useUserStore()

    const handleChange = (index: number, value: string) =>{
        if(/^[a-zA-Z0-9]$/.test(value) || value ==""){
            const newOtp = [...otp]
            newOtp[index] = value
            setOtp(newOtp)
        }
        //move to the next input field if the digit entered
        if(value!="" && index<5){
            inputRef.current[index+1].focus()
        }

    }
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) =>{
        if(e.key =='Backspace' && !otp[index] && index>0){
            inputRef.current[index-1].focus()
        }
    }
    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const verificationCode = otp.join("")
        await verifyEmail(verificationCode)
    }

    try {
        navigate('/')
    } catch (error) {
        console.log(error)
    }
  return (
    <div className="flex justify-center items-center h-screen w-full p-8">
        <div className="p-8 rounded-md w-full max-w-md flex-col gap-10 border border-gray-200">
            <div className="text-center">
                <h1 className="font-extrabold text-xl">Verify your Email</h1>
                <p className="text-sm text-gray-600">Enter the 6 digit code that send to your email address</p>

                <form onSubmit={submitHandler} action="">
                    <div className="flex justify-between mt-4 ">
                        {
                            otp.map((letter:string, idx:number) =>{
                                return (
                                    <Input
                                    key={idx}
                                    ref={(element)=> (inputRef.current[idx] = element)}
                                    maxLength={1}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>)=> handleChange(idx, e.target.value)}
                                    onKeyDown={(e:React.KeyboardEvent<HTMLInputElement>)=> handleKeyDown(idx, e)}
                                    type="text"
                                    value={letter}
                                    className="md:w-12 md:h-12 w-10 h-10 text-center text-sm md:text-2xl font-normal md:font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                                )
                            }

                            )
                        }
                    </div>

                    {
                    loading ? (
                        <Button disabled className="bg-hoverOrange hover:bg-orange text-slate-100 w-full mt-6"><Loader2 className="mr-2 h-4 w-4 animate-spin "/>Please wait</Button>
                    ): (
                        <Button className="bg-orange hover:bg-hoverOrange mt-6 w-full">Verify OTP</Button>
                    )
                }
                    
                </form>
            </div>
        </div>
    </div>
  )
}

export default VerifyEmail