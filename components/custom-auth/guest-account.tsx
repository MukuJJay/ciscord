import { useSignUp } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";

interface GuestAccountProps {
  created: boolean;
  setCreated: (arg: boolean) => void;
}

export const GuestAccount = ({ created, setCreated }: GuestAccountProps) => {
  const { isLoaded, signUp, setActive } = useSignUp();

  const onCreate = async () => {
    try {
      if (!signUp || !setActive) {
        return;
      }

      setCreated(true);

      await signUp
        .create({
          username: uuidv4(),
          password: "demo_password_123",
        })
        .then((result) => {
          if (result.status === "complete") {
            console.log(result);
            setActive({ session: result.createdSessionId });
            setCreated(true);
          } else {
            setCreated(false);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  if (!isLoaded) {
    return null;
  }

  if (created) {
    return null;
  }

  return (
    <div className="w-[500px] flex flex-col gap-2 items-center mb-3 sm:w-full">
      <Button
        onClick={onCreate}
        variant={"primary"}
        className="w-[90%] font-bold text-white"
        disabled={created}
      >
        Continue With Guest Account
      </Button>
      <p className="w-[90%] text-sm text-justify">
        This method gets you a system generated username. The password for your
        guest account is always{" "}
        <span className="font-bold text-emerald-500">demo_password_123</span>.
        You can change the username and password in the profile settings.
      </p>
    </div>
  );
};
