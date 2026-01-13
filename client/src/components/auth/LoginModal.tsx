"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import Image from "next/image";
import { signIn } from "next-auth/react";


export default function LoginModal() {

    const handleGoogleLogin = () =>{
        signIn("google", {
            callbackUrl: `/dashboard`
        })
    }

    return (
        <Dialog>
        <DialogTrigger asChild>
            <Button>Getting Started</Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle className="text-2xl">Welcome to QuickChat</DialogTitle>
            <DialogDescription>
                QuickChat makes it effortless to create secure chat links and start conversation in seconds.
            </DialogDescription>
            </DialogHeader>
            <Button 
                variant='outline'
                onClick={handleGoogleLogin}
            >
                <Image 
                src='/images/google.png'
                className='mr-4'
                width={20}
                height={20}
                alt='google_logo'
                />
                Continue with Google
            </Button>
        </DialogContent>
        </Dialog>

    )
}