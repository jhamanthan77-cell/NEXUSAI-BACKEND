
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function WorkspacePage() {
const [prompt, setPrompt] = useState("");
const [aiResponse,setaiResponse]=useState("");
const [loading,setloading]=useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    const initialPrompt = searchParams.get("prompt");

    if (initialPrompt) {
      setPrompt(initialPrompt);
    }
  }, [searchParams]);



return ( <main className="min-h-screen bg-[#080808] text-white"> <header className="flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-8"> <a href="/" className="text-xl font-bold tracking-[0.2em]">
MANTRIX<span className="text-amber-400">.</span> </a>


    <span className="rounded-full border border-amber-400/20 px-3 py-2 text-xs text-amber-300">
      AI WORKSPACE
    </span>
  </header>

  <section className="mx-auto flex min-h-[80vh] w-full max-w-4xl flex-col px-5 py-8 sm:px-8">
    <div className="flex-1 py-12 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/5 text-3xl text-amber-400">
        ✧
      </div>

      <h1 className="text-3xl font-semibold sm:text-4xl">
        Welcome to <span className="text-amber-400">MANTRIX</span>
      </h1>

      <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-zinc-400">
        Your intelligent workspace for coding, problem-solving,
        creativity and AI-powered ideas.
      </p>

      <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.025] p-5 text-left">
        <p className="text-sm font-medium text-amber-400">
          Start a conversation
        </p>

        <p className="mt-2 text-sm text-zinc-400">
          Ask a question, explore an idea, or work on your next project.
        </p>
      </div>
    </div>
    {loading && (
  <p className="mb-4 text-amber-400">
    MANTRIX is thinking...
  </p>
)}

{aiResponse && (
  <div className="mb-6 whitespace-pre-wrap rounded-2xl border border-amber-400/20 bg-[#101010] p-5 text-sm leading-7 text-zinc-200">
    {aiResponse}
  </div>
)}

    <form
          onSubmit={async(event) => {
        event.preventDefault();

        if (!prompt.trim()) return;
        const token=localStorage.getItem("mantrix_token");
        if(!token){
          alert("please login first.");
          return;
        }

        setloading(true);
        setaiResponse("");
       
        try {
          const response=await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/chat`,
            {
          method:"post",
          headers:{
          "content-type":"application/json",
      Authorization:`Bearer ${token}`
      
          },
          body:JSON.stringify({
         message:prompt.trim(),
          })  
 
            }
          );
          const result=await response .json();
          if(!response.ok|| !result.success){
            throw new Error(result.message||"Failed to get an Ai response ")

          }
                      setaiResponse(result.data.aiResponse);
                      setPrompt("");
          
        } catch (error) {
          console.log("chat request failed", error);
          setaiResponse(
            error instanceof Error? error.message:"something went wrong"
          );

          
        }
        finally{
          setloading(false)
        }

        console.log("Workspace prompt:", prompt.trim());
      }}
      className="rounded-2xl border border-white/10 bg-[#101010] p-3 focus-within:border-amber-400/40 sm:p-4"
    >
      <label htmlFor="workspace-prompt" className="sr-only">
        Ask MANTRIX
      </label>

      <textarea
        id="workspace-prompt"
        rows={3}
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        onKeyDown={(event)=>{
          if(event.key=="Enter"&&!event.shiftKey){
            event.preventDefault();
            event.currentTarget.form?.requestSubmit();
          }
        }}
        placeholder="Ask MANTRIX anything..."
        className="w-full resize-none bg-transparent px-2 py-2 text-sm leading-6 text-white outline-none placeholder:text-zinc-600"
      />

      <div className="flex justify-end border-t border-white/10 pt-3">
        <button
          type="submit"
          disabled={!prompt.trim()}
          className="rounded-xl bg-amber-400 px-5 py-2 text-sm font-semibold text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Send ↗
        </button>
      </div>
    </form>
  </section>
</main>


);
}
