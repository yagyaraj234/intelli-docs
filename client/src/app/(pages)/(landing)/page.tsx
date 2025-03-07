"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { CheckIcon, XIcon, Loader2 } from "lucide-react";
import { authenticate } from "@/services/user";
import { API_URL } from "@/services/constant";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { createTemporaryWorkspace } from "@/services/workspace";

const names = ["Code", "Data", "Files", "Images", "Videos"];

export default function EnhancedLandingPage() {
  const { setUser, user } = useUser();
  const [name, setName] = useState("Code");
  const [loading, setLoading] = useState<boolean>(true);
  const featuresRef = useRef(null);
  const pricingRef = useRef(null);
  const aboutRef = useRef(null);
  const helpRef = useRef(null);

  const handleNameChange = () => {
    return setInterval(() => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      setName(randomName);
    }, 2000);
  };

  const router = useRouter();

  const handleGoogleLogin = async () => {
    window.open(`${API_URL}auth/google`, "_self");
  };

  const checkUserLoggedIn = async () => {
    try {
      const res = await authenticate();
      if (res.status === "success") {
        const workspaceId = res.data.workspace;
        router.push(`/workspace/${workspaceId}`);
        setUser(res.data);
      }
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const id = handleNameChange();
    return () => {
      clearInterval(id);
    };
  }, []);

  useLayoutEffect(() => {
    !user && checkUserLoggedIn();
  }, []);

  const scrollToSection = (ref: any) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };

  async function handleCreateWorkspace() {
    const res = await createTemporaryWorkspace();
    if (res.status === "success") {
      router.push(`/workspace/${res.data.id}`);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between sticky top-0 bg-white z-50 shadow-sm">
        <Link className="flex items-center justify-center" href="#">
          {/* <MountainIcon className="h-6 w-6 mr-2" /> */}
          <img src="/icon.svg" alt="" className="h-6 w-6 mr-2" />
          <span className="font-bold">Workbot</span>
        </Link>
        <nav className="flex gap-4 sm:gap-6">
          <button
            className="text-sm font-medium hover:underline underline-offset-4"
            onClick={() => scrollToSection(featuresRef)}
          >
            Features
          </button>
          <button
            className="text-sm font-medium hover:underline underline-offset-4"
            onClick={() => scrollToSection(pricingRef)}
          >
            Pricing
          </button>
          <button
            className="text-sm font-medium hover:underline underline-offset-4"
            onClick={() => scrollToSection(aboutRef)}
          >
            About
          </button>
          <button
            className="text-sm font-medium hover:underline underline-offset-4"
            onClick={() => scrollToSection(helpRef)}
          >
            Help
          </button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r to-[#A83279] from-[#D38312]">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center text-white">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Chat with Your {name}
                  <br />
                </h1>
                <p className="text-lg">Powered by AI</p>
                <p className="mx-auto max-w-[700px] text-xl md:text-2xl">
                  Unlock the power of your data with our advanced RAG-powered
                  chat application.
                </p>
              </div>
              <div className="space-y-2">
                {/* <p className="text-lg font-medium">Get started now!</p> */}
                <div className="flex items-center justify-center  bg-gray-100 dark:bg-gray-700 rounded-md">
                  <button
                    className="flex items-center bg-white dark:bg-gray-900 border border-gray-300  shadow-md px-6 py-2 text-sm font-medium text-gray-800 dark:text-white hover:bg-gray-200 focus:ring-gray-500  gap-4 rounded-md"
                    onClick={handleGoogleLogin}
                  >
                    <img
                      src="/icons/google.png"
                      alt="google-icon"
                      className="h-6 w-6 bg-transparent "
                    />

                    {loading && (
                      <div className="flex gap-4 items-center ">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Verifying...</span>
                      </div>
                    )}
                    {!loading && <span>Continue with Google</span>}
                  </button>
                </div>
              </div>

              {/* <Button
                variant="link"
                className="text-white transition-all duration-500 ease-in-out"
                onClick={handleCreateWorkspace}
              >
                Continue without signup
              </Button> */}
            </div>
          </div>
        </section>
        <section ref={featuresRef} className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Advanced RAG Technology</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Leverage state-of-the-art Retrieval-Augmented Generation for
                  accurate and context-aware responses.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Multi-format Support</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Chat with various file types including PDFs, code snippets,
                  and even YouTube videos.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">AI Model Selection</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Choose from a range of AI models including Llama, Mistral,
                  Claude, and GPT, based on your plan.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          ref={pricingRef}
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              Choose Your Plan
            </h2>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <CardTitle>Free Plan</CardTitle>
                  <CardDescription>Perfect for getting started</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-green-500" />{" "}
                      Upload up to 10MB of files
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-green-500" />{" "}
                      Create one workspace
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-green-500" />{" "}
                      Access to Llama and Mistral models
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-green-500" /> 20
                      every 6 hours
                    </li>
                    <li className="flex items-center">
                      <XIcon className="mr-2 h-4 w-4 text-red-500" /> No access
                      to premium models
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleGoogleLogin} className="w-full">
                    Get Started
                  </Button>
                </CardFooter>
              </Card>
              <Card className="border-purple-800">
                <CardHeader>
                  <CardTitle>Pro Plan</CardTitle>
                  <CardDescription>For power users and teams</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-green-500" />{" "}
                      Upload up to 100MB of files
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-green-500" />{" "}
                      Create unlimited workspaces
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-green-500" />{" "}
                      Access to Claude and GPT models
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-green-500" />{" "}
                      Unlimited queries
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-green-500" />{" "}
                      Priority support
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    disabled
                    className="w-full bg-purple-800 hover:bg-purple-600"
                  >
                    No Plan to launch
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Enterprise Plan</CardTitle>
                  <CardDescription>
                    Custom solutions for large organizations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-green-500" />{" "}
                      Custom file upload limits
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-green-500" />{" "}
                      Dedicated support
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-green-500" />{" "}
                      Custom AI model integration
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-green-500" />{" "}
                      Advanced analytics
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-green-500" /> SLA
                      guarantees
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline" disabled>
                    Contact Sales
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
        <section ref={aboutRef} className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              About Workbot
            </h2>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-xl mb-6">
                Workbot is revolutionizing the way people interact with their
                documents and data. Our mission is to make information retrieval
                and analysis as simple and intuitive as having a conversation.
              </p>
              <p className="text-xl mb-6">
                Founded by a team of AI enthusiasts and data scientists, we're
                committed to pushing the boundaries of what's possible with
                Retrieval-Augmented Generation technology.
              </p>
              <p className="text-xl">
                Join us on our journey to create a world where knowledge is
                instantly accessible and actionable for everyone.
              </p>
            </div>
          </div>
        </section>
        <section
          ref={helpRef}
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              Help Center
            </h2>
            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Frequently Asked Questions
                  </h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>How do I upload documents to Workbot?</li>
                    <li>What file formats are supported?</li>
                    <li>How can I upgrade my plan?</li>
                    <li>Is my data secure?</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Contact Support</h3>
                  <p>Need more help? Our support team is available 24/7.</p>
                  <Button className="mt-4">Contact Support</Button>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Documentation</h3>
                  <p>
                    Check out our comprehensive documentation for detailed
                    guides and tutorials.
                  </p>
                  <Button variant="outline" className="mt-4">
                    View Docs
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-purple-800 text-white">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to revolutionize your document interactions?
            </h2>
            <p className="text-xl mb-8">
              Join thousands of satisfied users who have transformed their
              workflow with Workbot.
            </p>
            <Button onClick={handleGoogleLogin} size="lg" variant="secondary">
              Start Your Journey Now
            </Button>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2023 Workbot. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy Policy
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Cookie Policy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
