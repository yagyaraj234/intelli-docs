import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/services/constant";
import { authenticate } from "@/services/user";
import { useUser } from "@/hooks/use-user";

export const LoginButton = () => {
    const {setUser} = useUser();
    const [loading, setLoading] = useState<boolean>(false);
   
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
    //   !user && checkUserLoggedIn();
    //   user && router.push(`/workspace/${user.id}`);
    checkUserLoggedIn();
    }, []);
    return (
        <div className="space-y-2">
        <p className="text-lg font-medium">Get started now!</p>
        <div className="flex items-center justify-center  bg-gray-100 dark:bg-gray-700">
          <button
            className="flex items-center bg-white dark:bg-gray-900 border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 dark:text-white hover:bg-gray-200 focus:ring-gray-500  gap-4 rounded-2"
            onClick={handleGoogleLogin}
          >
            <img
              src="/icons/google.png"
              alt="google-icon"
              className="h-6 w-6 bg-transparent "
            />

            {loading && <div className="flex gap-4 items-center "><Loader2 className="h-6 w-6 animate-spin" />
            <span>Verifying...</span>
            </div>}
            {!loading && <span>Continue with Google</span>}
          </button>
        </div>
      </div>
    )
}
