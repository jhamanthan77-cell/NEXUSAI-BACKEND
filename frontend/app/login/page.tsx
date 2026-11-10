"use client";
import { useState} from "react";
import { useRouter } from "next/navigation";
export default function LoginPage(){
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const router=useRouter();
    const[error, seterrorr]=useState("");
    const[loading, setloading]=useState(false);
const handleLogin = async(event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  setloading(true);//btata hai ki login process is working
  seterrorr("");//  clear prev login error!!
  
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
          method:"post",
          headers:{
              "content-type":"application/json"
          },
          body:JSON.stringify({email,password})
      }
    )
  const data =await response.json();
  if(response.ok && data.success && data.token){
    localStorage.setItem("mantrix_token",data.token);
    router.push("/workspace")
      console.log("Login successful",data);
  }
  else{
      seterrorr(data.message||"Login failed");
  }
  }
   catch (error) {
    seterrorr("unable to connect to the server.")
  }finally{
    setloading(false);
  }
}
    return (
<main className="min-h-screen bg-[#080808] text-white flex items-center justify-center">
<div className="w-full max-w-md p-8">
<h1 className="text-4xl font-bold text-center">
MANTRIX<span className="text-yellow-500">.</span>
</h1>

    <p className="text-gray-400 text-center mt-3">
      Welcome back to your AI workspace
    </p>

    <form className="mt-10 space-y-5"
    onSubmit={handleLogin}
    
    >

      <div>
        <label className="block text-sm text-gray-300 mb-2">
          Email
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full rounded-lg border border-gray-700 bg-[#111] px-4 py-3 outline-none focus:border-yellow-500"
          required
        />
      </div>
      

      <div>
        <label className="block text-sm text-gray-300 mb-2">
          Password
        </label>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="w-full rounded-lg border border-gray-700 bg-[#111] px-4 py-3 outline-none focus:border-yellow-500"
          required
        />
      </div>
      {error && (
        <p className="text-sm text-red-500">
        {error}
        </p>
      )

      }

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-yellow-500 py-3 font-semibold text-black transition hover:bg-yellow-400"
      >
        {loading?"signing in...":"sign In"}
        
      </button>
    </form>

    <p className="mt-6 text-center text-sm text-gray-400">
      Don't have an account?{" "}
      <a href="/register" className="text-yellow-500 hover:underline">
        Sign Up
      </a>
    </p>
  </div>
</main>

);

}